import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ assessments: [] }, { status: 200 });
    }

    const assessments = await prisma.skillAssessment.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error("GET /api/assessment/history error:", error);
    return NextResponse.json({ error: "Failed to fetch assessment history" }, { status: 500 });
  }
}
