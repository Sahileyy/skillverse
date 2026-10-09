import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createPostSchema, updatePostStatusSchema } from "@/lib/validations/post";

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

    // Check user & ensure MENTOR role or update if needed
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        role: true,
        xp: true,
        completedActivities: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Award XP for posting a skill ad if first time
    const ACTIVITY_KEY = "mentor_first_post_created";
    const alreadyAwarded = user.completedActivities.includes(ACTIVITY_KEY);
    let xpAwarded = 0;
    const updatedActivities = [...user.completedActivities];

    if (!alreadyAwarded) {
      xpAwarded = 15;
      updatedActivities.push(ACTIVITY_KEY);
    }

    const [post] = await prisma.$transaction([
      prisma.post.create({
        data: {
          userId: session.id,
          skillName: skillName.trim(),
          category: category.trim(),
          title: title.trim(),
          description: description.trim(),
          pricingType,
          priceAmount: pricingType === "PAID" ? (priceAmount ?? 0) : null,
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
          role: user.role === "STUDENT" ? "MENTOR" : undefined,
          xp: { increment: xpAwarded },
          completedActivities: { set: updatedActivities },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      post,
      xpAwarded,
      message: xpAwarded > 0
        ? "Skill offering published! You earned +15 XP."
        : "Skill offering published successfully.",
    });
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
