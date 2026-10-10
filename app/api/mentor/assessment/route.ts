import { NextRequest, NextResponse } from "next/server";
import { getSession, signJWT, AUTH_COOKIE_NAME } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const score = typeof body.score === "number" ? Math.max(0, Math.min(100, Math.round(body.score))) : null;

    if (score === null) {
      return NextResponse.json({ error: "Valid numeric score (0-100) is required" }, { status: 400 });
    }

    // Determine Mentor Level based on deterministic threshold
    let decidedLevel = "Apprentice Mentor";
    let tierTitle = "In Training / Uncertified";
    let levelDescription = "Below the 60% threshold. Strengthen core architecture principles and retake to earn official accreditation.";

    if (score >= 90) {
      decidedLevel = "Master Mentor";
      tierTitle = "Tier 1: Principal Architect & Capstone Lead";
      levelDescription = "Elite technical mastery. Certified to lead complex system design evaluations, capstone reviews, and masterclass sessions.";
    } else if (score >= 75) {
      decidedLevel = "Senior Mentor";
      tierTitle = "Tier 2: Advanced Systems & Code Reviewer";
      levelDescription = "Strong architectural competence and pedagogy. Certified for deep-dive code reviews, full-stack debugging, and interview prep.";
    } else if (score >= 60) {
      decidedLevel = "Associate Mentor";
      tierTitle = "Tier 3: Core Foundations Guide";
      levelDescription = "Solid technical baseline. Certified for foundational tutoring, concept walkthroughs, and beginner debugging assistance.";
    }

    // Fetch user to check XP award eligibility and role upgrade
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

    const ACTIVITY_KEY = "mentor_accreditation_completed";
    const alreadyAwarded = user.completedActivities.includes(ACTIVITY_KEY);
    let xpAwarded = 0;
    const updatedActivities = [...user.completedActivities];

    if (!alreadyAwarded && score >= 60) {
      xpAwarded = 15;
      updatedActivities.push(ACTIVITY_KEY);
    }

    // Upgrade to MENTOR if user passed the 60% threshold and was a STUDENT
    const targetRole = score >= 60 && user.role === "STUDENT" ? "MENTOR" : user.role;

    // Update Profile and User records in database
    await prisma.$transaction([
      // 1. Update Profile with decided mentor level and score
      prisma.profile.upsert({
        where: { userId: session.id },
        update: {
          mentorLevel: decidedLevel,
          mentorScore: score,
        },
        create: {
          userId: session.id,
          mentorLevel: decidedLevel,
          mentorScore: score,
        },
      }),

      // 2. Award XP and update role
      prisma.user.update({
        where: { id: session.id },
        data: {
          role: targetRole,
          xp: { increment: xpAwarded },
          completedActivities: updatedActivities,
        },
      }),

      // 3. Persist assessment record
      prisma.skillAssessment.create({
        data: {
          userId: session.id,
          skillName: "Mentor Technical & Pedagogy Accreditation",
          score,
          isVerified: score >= 60,
          feedback: `AI Accreditation: Assigned ${decidedLevel} (${score}%) — ${tierTitle}`,
        },
      }),
    ]);

    let mentorRating = 3.8;
    if (score >= 90) mentorRating = 5.0;
    else if (score >= 75) mentorRating = 4.8;
    else if (score >= 60) mentorRating = 4.5;

    const response = NextResponse.json({
      success: true,
      score,
      level: decidedLevel,
      tier: tierTitle,
      rating: mentorRating,
      description: levelDescription,
      role: targetRole,
      xpAwarded,
      message: `Your AI Mentor level has been evaluated and officially set to "${decidedLevel}" (Rating: ${mentorRating}★)!`,
    });

    // Re-issue JWT cookie if role updated so client session updates immediately
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
    console.error("POST /api/mentor/assessment error:", error);
    return NextResponse.json({ error: "Failed to process mentor evaluation" }, { status: 500 });
  }
}
