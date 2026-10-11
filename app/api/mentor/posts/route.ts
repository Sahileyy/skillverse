import { NextRequest, NextResponse } from "next/server";
import { getSession, signJWT, AUTH_COOKIE_NAME } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createPostSchema, updatePostStatusSchema } from "@/lib/validations/post";
import { getBadgeForXp } from "@/lib/badges";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: session.id,
        status: { not: "REMOVED" },
      },
      orderBy: { createdAt: "desc" },
      include: {
        bookings: {
          select: {
            id: true,
            status: true,
            scheduledAt: true,
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/mentor/posts error:", error);
    return NextResponse.json({ error: "Failed to fetch mentor posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const {
      skillName,
      category,
      title,
      description,
      pricingType,
      priceAmount,
      availability,
    } = parsed.data;

    // Check user
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        xp: true,
        completedActivities: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isStudent = user.role === "STUDENT";

    // Students only post peer-to-peer FREE ads (no monetary pricing allowed)
    const effectivePricingType = isStudent ? "FREE" : pricingType;
    const effectivePriceAmount = isStudent ? null : (pricingType === "PAID" ? (priceAmount ?? 0) : null);

    // Calculate XP reward: Students earn +20 XP for every peer-to-peer skill ad
    let xpAwarded = 0;
    const updatedActivities = [...user.completedActivities];

    if (isStudent) {
      xpAwarded = 20;
      updatedActivities.push(`student_peer_post_created:${Date.now()}`);
    } else {
      const ACTIVITY_KEY = "mentor_first_post_created";
      const alreadyAwarded = user.completedActivities.includes(ACTIVITY_KEY);
      if (!alreadyAwarded) {
        xpAwarded = 15;
        updatedActivities.push(ACTIVITY_KEY);
      }
    }

    // Role is preserved: Students stay STUDENTS, Mentors stay MENTORS
    const targetRole = user.role;

    const [post] = await prisma.$transaction([
      prisma.post.create({
        data: {
          userId: session.id,
          skillName: skillName.trim(),
          category: category.trim(),
          title: title.trim(),
          description: description.trim(),
          pricingType: effectivePricingType,
          priceAmount: effectivePriceAmount,
          availability: availability.trim(),
          status: "ACTIVE",
        },
        include: {
          bookings: true,
        },
      }),
      prisma.user.update({
        where: { id: session.id },
        data: {
          role: targetRole,
          xp: { increment: xpAwarded },
          completedActivities: { set: updatedActivities },
        },
      }),
    ]);

    const newTotalXp = user.xp + xpAwarded;
    const userBadge = getBadgeForXp(newTotalXp);

    const response = NextResponse.json({
      success: true,
      post,
      xpAwarded,
      newXp: newTotalXp,
      badge: userBadge,
      isPeerAd: isStudent,
      message: isStudent
        ? `Peer-to-peer ad published! You earned +${xpAwarded} XP towards your ${userBadge.name} badge.`
        : (xpAwarded > 0 ? "Skill offering published! You earned +15 XP." : "Skill offering published successfully."),
    });

    // Re-issue JWT cookie only if role actually changed
    if (targetRole !== session.role) {
      const newToken = await signJWT({
        id: user.id,
        email: user.email,
        name: user.name,
        role: targetRole,
      });

      response.cookies.set(AUTH_COOKIE_NAME, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("POST /api/mentor/posts error:", error);
    return NextResponse.json({ error: "Failed to publish skill ad" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updatePostStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { id, status } = parsed.data;

    // Check ownership
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.userId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: You do not own this post" }, { status: 403 });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { status },
      include: {
        bookings: true,
      },
    });

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: `Post status changed to ${status.toLowerCase()}`,
    });
  } catch (error) {
    console.error("PATCH /api/mentor/posts error:", error);
    return NextResponse.json({ error: "Failed to update post status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.userId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: You do not own this post" }, { status: 403 });
    }

    await prisma.post.update({
      where: { id },
      data: { status: "REMOVED" },
    });

    return NextResponse.json({
      success: true,
      message: "Post removed successfully",
    });
  } catch (error) {
    console.error("DELETE /api/mentor/posts error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
