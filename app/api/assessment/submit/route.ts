import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const assessmentSubmitSchema = z.object({
  quizId: z.string().min(1),
  skillName: z.string().min(1),
  score: z.number().min(0).max(100),
  isVerified: z.boolean(),
  feedback: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please sign in to save your assessment result" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = assessmentSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid assessment submission" },
        { status: 400 }
      );
    }

    const { quizId, skillName, score, isVerified, feedback } = parsed.data;

    // Check user & activity history
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, xp: true, completedActivities: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ACTIVITY_KEY = `assessment:${quizId}`;
    let xpToAdd = 0;
    const completedActivities = [...user.completedActivities];

    if (!completedActivities.includes(ACTIVITY_KEY)) {
      xpToAdd = 10;
      completedActivities.push(ACTIVITY_KEY);
    }

    // Save assessment result and increment XP if applicable
    const [assessment] = await prisma.$transaction([
      prisma.skillAssessment.create({
        data: {
          userId: session.id,
          skillName,
          score,
          isVerified,
          feedback,
        },
      }),
      prisma.user.update({
        where: { id: session.id },
        data: {
          xp: { increment: xpToAdd },
          completedActivities: { set: completedActivities },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      assessment,
      xpAwarded: xpToAdd,
      message: xpToAdd > 0 ? "Assessment saved! +10 XP awarded." : "Assessment saved successfully.",
    });
  } catch (error) {
    console.error("POST /api/assessment/submit error:", error);
    return NextResponse.json({ error: "Failed to record assessment" }, { status: 500 });
  }
}
