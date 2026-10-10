import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { validateProfileSkillsWithGroq } from "@/lib/groq";

const validateSkillsRequestSchema = z.object({
  targetRole: z.string().min(2, "Target role must be at least 2 characters").max(80),
  skills: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const parsed = validateSkillsRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid target role" },
        { status: 400 }
      );
    }

    const { targetRole, skills: customSkills } = parsed.data;

    let candidateSkills: string[] = customSkills || [];
    let headline: string | null = null;
    let bio: string | null = null;
    let education: string | null = null;

    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: {
          profile: {
            select: {
              skills: true,
              headline: true,
              bio: true,
              education: true,
            },
          },
        },
      });

      if (user?.profile) {
        if (!candidateSkills || candidateSkills.length === 0) {
          candidateSkills = user.profile.skills || [];
        }
        headline = user.profile.headline;
        bio = user.profile.bio;
        education = user.profile.education;
      }
    }

    const validationResult = await validateProfileSkillsWithGroq({
      targetRole,
      skills: candidateSkills,
      headline,
      bio,
      education,
    });

    if (!validationResult) {
      return NextResponse.json(
        { error: "Could not evaluate skills for the requested job position" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      validation: validationResult,
    });
  } catch (error) {
    console.error("POST /api/ai/validate-skills error:", error);
    return NextResponse.json(
      { error: "Failed to validate profile skills" },
      { status: 500 }
    );
  }
}
