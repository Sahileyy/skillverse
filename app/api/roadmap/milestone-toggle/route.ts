import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const milestoneToggleSchema = z.object({
  pathwayId: z.string().min(1),
  milestoneId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please sign in to track milestone progress" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = milestoneToggleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid milestone request" }, { status: 400 });
    }

    const { pathwayId, milestoneId } = parsed.data;
    const ACTIVITY_KEY = `milestone:${pathwayId}:${milestoneId}`;

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, xp: true, completedActivities: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAlreadyCompleted = user.completedActivities.includes(ACTIVITY_KEY);

    // Enforce Rule: Roadmap progress requires attending a peer meeting with a mentor
    if (!isAlreadyCompleted) {
      const attendedPeerMeeting = await prisma.booking.findFirst({
        where: {
          studentId: session.id,
          status: { in: ["ACCEPTED", "COMPLETED"] },
        },
      });

      if (!attendedPeerMeeting) {
        return NextResponse.json(
          {
            success: false,
            requiresPeerMeeting: true,
            error: "Peer Meeting Required: Roadmap milestones unlock only after attending a 1-on-1 peer meeting with a mentor to verify your progress.",
          },
          { status: 403 }
        );
      }
    }

    let xpToAdd = 0;
    let updatedActivities = [...user.completedActivities];

    if (!isAlreadyCompleted) {
      // Award +10 XP for peer-verified career roadmap milestone
      xpToAdd = 10;
      updatedActivities.push(ACTIVITY_KEY);
    } else {
      // Uncheck milestone
      updatedActivities = updatedActivities.filter((act) => act !== ACTIVITY_KEY);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        xp: { increment: xpToAdd },
        completedActivities: { set: updatedActivities },
      },
      select: { id: true, xp: true, completedActivities: true },
    });

    return NextResponse.json({
      success: true,
      isCompleted: !isAlreadyCompleted,
      xpAwarded: xpToAdd,
      totalXp: updatedUser.xp,
      completedActivities: updatedUser.completedActivities,
      message: xpToAdd > 0 ? "Milestone completed! +5 XP awarded." : "Milestone updated.",
    });
  } catch (error) {
    console.error("POST /api/roadmap/milestone-toggle error:", error);
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 });
  }
}
