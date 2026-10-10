import { NextRequest, NextResponse } from "next/server";
import { getSession, signJWT, AUTH_COOKIE_NAME } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validations/profile";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        xp: true,
        completedActivities: true,
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const {
      name,
      education,
      bio,
      headline,
      skills,
      interests,
      careerGoal,
      image,
      githubUrl,
      linkedinUrl,
    } = parsed.data;

    // Fetch existing user to check activity completion
    const currentUser = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        role: true,
        xp: true,
        completedActivities: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine if profile setup qualifies for the +20 XP activity reward
    const hasCoreInfo =
      Boolean(name.trim()) &&
      Boolean(education && education.trim().length > 0) &&
      skills.length > 0 &&
      interests.length > 0 &&
      (currentUser.role === "MENTOR"
        ? Boolean(bio && bio.trim().length > 0)
        : Boolean(careerGoal && careerGoal.trim().length > 0));

    let xpToAdd = 0;
    const completedActivities = [...currentUser.completedActivities];
    const ACTIVITY_KEY = "profile_completed";

    if (hasCoreInfo && !completedActivities.includes(ACTIVITY_KEY)) {
      xpToAdd = 20;
      completedActivities.push(ACTIVITY_KEY);
    }

    const targetRole = parsed.data.role || currentUser.role;

    // Transaction to update User and Profile atomically
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: name.trim(),
        role: targetRole,
        image: image || null,
        xp: { increment: xpToAdd },
        completedActivities: { set: completedActivities },
        profile: {
          upsert: {
            create: {
              education: education || null,
              bio: bio || null,
              headline: headline || (targetRole === "MENTOR" ? "Mentor" : "Student"),
              skills,
              interests,
              careerGoal: careerGoal || null,
              githubUrl: githubUrl || null,
              linkedinUrl: linkedinUrl || null,
            },
            update: {
              education: education || null,
              bio: bio || null,
              headline: headline || undefined,
              skills,
              interests,
              careerGoal: careerGoal || null,
              githubUrl: githubUrl || null,
              linkedinUrl: linkedinUrl || null,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        xp: true,
        completedActivities: true,
        profile: true,
      },
    });

    const response = NextResponse.json({
      success: true,
      user: updatedUser,
      xpAwarded: xpToAdd,
      message: xpToAdd > 0 ? "Profile completed! +20 XP awarded." : "Profile updated successfully.",
    });

    // Re-issue JWT cookie if role or critical fields changed
    if (targetRole !== session.role || updatedUser.name !== session.name) {
      const newToken = await signJWT({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
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
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
