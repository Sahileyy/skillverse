import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateGroqCareerGuidance, GroqCareerGuidance } from "@/lib/groq";

const requestSchema = z.object({
  targetRole: z.string().min(2, "Target role must be at least 2 characters").max(80),
});

const FALLBACK_GUIDANCE: Record<string, GroqCareerGuidance> = {
  default: {
    targetRole: "Full-Stack Software Engineer",
    careerSummary: "Full-Stack engineering remains one of the highest-volume career sectors worldwide, bridging client experience with high-throughput backend infrastructure and cloud services.",
    marketDemand: "High Demand (94% industry hiring rate)",
    estimatedMonths: "4 - 6 Months",
    keySkillGaps: [
      "Production React 19 RSC & Server Actions",
      "Relational Database indexing, transactions, and Prisma ORM",
      "End-to-end authentication security and JWT cookie session management",
    ],
    milestones: [
      {
        id: "m-1",
        stage: "BASELINE",
        title: "Stage 1: Modern JavaScript & Component Architecture",
        description: "Master modern TypeScript ES6+, component state isolation, and UI styling with Tailwind CSS.",
        skills: ["TypeScript", "React 19", "Tailwind CSS", "Git"],
        resources: ["React Documentation", "TypeScript Handbook"],
        recommendedMentorRole: "Frontend Engineer",
      },
      {
        id: "m-2",
        stage: "SKILL_GAP",
        title: "Stage 2: Server-Side Rendering & App Routing",
        description: "Build performant server-rendered web applications with Next.js App Router, caching strategies, and streaming SSR.",
        skills: ["Next.js App Router", "Server Components", "API Routes"],
        resources: ["Next.js 16 Documentation", "Web Performance Vitals"],
        recommendedMentorRole: "Senior Full-Stack Engineer",
      },
      {
        id: "m-3",
        stage: "RECOMMENDED",
        title: "Stage 3: Relational Databases & Backend API Security",
        description: "Design normalized PostgreSQL database schemas, write type-safe queries with Prisma ORM, and secure endpoints with JWT sessions.",
        skills: ["PostgreSQL", "Prisma ORM", "Jose JWT Auth", "Zod Validation"],
        resources: ["PostgreSQL Tutorial", "Prisma Guides"],
        recommendedMentorRole: "Backend Architect",
      },
      {
        id: "m-4",
        stage: "CAPSTONE",
        title: "Stage 4: Production Capstone Project & Cloud Deployment",
        description: "Architect and deploy a live multi-user SaaS application with database migrations and automated deployment workflows.",
        skills: ["CI/CD Pipelines", "Docker", "Vercel / AWS Deployment"],
        resources: ["Docker Curriculum", "Vercel Guides"],
        recommendedMentorRole: "Principal Systems Mentor",
      },
    ],
    capstoneProjectIdea: {
      title: "Real-Time Collaborative Developer Learning Hub",
      description: "A production-grade web application featuring 1-on-1 peer scheduling, interactive chat rooms, and automated code review workflows.",
      deliverables: [
        "Production Next.js 16 + PostgreSQL schema with Prisma ORM",
        "Role-based authentication (Student / Mentor / Admin)",
        "Live deployed application with automated CI/CD and mobile responsive design",
      ],
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    let currentSkills: string[] = [];
    let interests: string[] = [];
    let education = "";
    let latestScore: number | null = null;

    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: {
          profile: {
            select: {
              skills: true,
              interests: true,
              education: true,
            },
          },
          assessments: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { score: true },
          },
        },
      });

      if (user?.profile) {
        currentSkills = user.profile.skills || [];
        interests = user.profile.interests || [];
        education = user.profile.education || "";
      }
      if (user?.assessments && user.assessments.length > 0) {
        latestScore = user.assessments[0].score;
      }
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid target role" },
        { status: 400 }
      );
    }

    const { targetRole } = parsed.data;

    // Attempt generation with Groq AI
    const groqGuidance = await generateGroqCareerGuidance({
      targetRole,
      currentSkills,
      interests,
      education,
      assessmentScore: latestScore,
    });

    if (groqGuidance) {
      return NextResponse.json({
        success: true,
        isAiGenerated: true,
        engine: "Groq LLaMA-3.3 70B Versatile",
        guidance: groqGuidance,
      });
    }

    // Fallback if Groq key is unset or unavailable
    const fallbackGuidance = {
      ...FALLBACK_GUIDANCE.default,
      targetRole,
    };

    return NextResponse.json({
      success: true,
      isAiGenerated: false,
      engine: "Deterministic Fallback Engine (Add GROQ_API_KEY to enable live AI)",
      guidance: fallbackGuidance,
    });
  } catch (error) {
    console.error("POST /api/ai/career-guidance error:", error);
    return NextResponse.json({ error: "Failed to generate career guidance" }, { status: 500 });
  }
}
