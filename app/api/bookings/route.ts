import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateXpDiscount, getBadgeForXp } from "@/lib/badges";

const createBookingSchema = z.object({
  mentorId: z.string().min(1, "Mentor ID is required"),
  postId: z.string().optional(),
  sessionTitle: z.string().optional(),
  scheduledAt: z.string().optional(),
  slotTime: z.string().optional(),
  pricingType: z.enum(["FREE", "PAID"]).default("FREE"),
  rawPrice: z.union([z.number(), z.string()]).optional(),
  redeemXp: z.boolean().default(false),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [{ studentId: session.id }, { mentorId: session.id }],
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            skillName: true,
            pricingType: true,
            priceAmount: true,
          },
        },
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: {
              select: {
                headline: true,
                mentorLevel: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            xp: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to book a session." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid booking data" },
        { status: 400 }
      );
    }

    const {
      mentorId,
      postId: providedPostId,
      sessionTitle,
      scheduledAt,
      slotTime,
      pricingType,
      rawPrice,
      redeemXp,
    } = parsed.data;

    if (session.id === mentorId) {
      return NextResponse.json(
        { error: "You cannot book a mentorship session with yourself." },
        { status: 400 }
      );
    }

    // Verify student user record
    const studentUser = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, email: true, xp: true },
    });

    if (!studentUser) {
      return NextResponse.json({ error: "Student user not found" }, { status: 404 });
    }

    // Verify or ensure mentor user record exists
    let mentorUser = await prisma.user.findUnique({
      where: { id: mentorId },
    });

    if (!mentorUser) {
      const cleanName = mentorId
        .replace(/^mentor-/, "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ") || "Verified Mentor";

      mentorUser = await prisma.user.upsert({
        where: { id: mentorId },
        update: {},
        create: {
          id: mentorId,
          name: cleanName,
          email: `${mentorId.toLowerCase().replace(/[^a-z0-9]/g, "")}@skillverse.dev`,
          role: "MENTOR",
        },
      });
    }

    const effectiveMentorId = mentorUser.id;

    // Verify or find post
    let targetPostId = providedPostId;
    if (!targetPostId) {
      const existingPost = await prisma.post.findFirst({
        where: { userId: effectiveMentorId, status: "ACTIVE" },
      });
      if (existingPost) {
        targetPostId = existingPost.id;
      } else {
        // Fallback: create default post reference for this mentor
        const createdPost = await prisma.post.create({
          data: {
            userId: effectiveMentorId,
            skillName: sessionTitle || "General Mentorship",
            category: "General",
            title: sessionTitle || "1-on-1 Peer Mentorship Session",
            description: "Direct 1-on-1 technical and career mentorship session",
            pricingType,
            priceAmount: pricingType === "PAID" && rawPrice ? parseFloat(String(rawPrice)) || null : null,
            status: "ACTIVE",
          },
        });
        targetPostId = createdPost.id;
      }
    }

    // Calculate XP discount if requested and paid
    let xpDeducted = 0;
    let discountInfo = null;

    if (pricingType === "PAID" && redeemXp && rawPrice) {
      const calc = calculateXpDiscount(studentUser.xp, rawPrice);
      if (calc.canApply) {
        xpDeducted = calc.badge.redeemXpCost;
        discountInfo = {
          badgeName: calc.badge.name,
          discountAmount: calc.discountAmount,
          finalPrice: calc.finalPrice,
          xpRedeemed: xpDeducted,
        };
      }
    }

    const meetingCode = Math.random().toString(36).substring(2, 10);
    const meetingUrl = `https://meet.google.com/skv-${meetingCode}`;

    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          postId: targetPostId,
          mentorId: effectiveMentorId,
          studentId: session.id,
          status: "ACCEPTED",
          scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(Date.now() + 86400000),
          meetingUrl,
        },
        include: {
          post: true,
          mentor: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      }),
      // Deduct XP if discount applied
      prisma.user.update({
        where: { id: session.id },
        data: {
          xp: xpDeducted > 0 ? { decrement: xpDeducted } : undefined,
          completedActivities: {
            push: `booking_created:${targetPostId}`,
          },
        },
      }),
    ]);

    const badge = getBadgeForXp(studentUser.xp - xpDeducted);

    return NextResponse.json({
      success: true,
      booking,
      meetingUrl,
      discountInfo,
      currentBadge: badge,
      remainingXp: studentUser.xp - xpDeducted,
      message: discountInfo
        ? `Session confirmed! Applied ${discountInfo.badgeName} discount (-₹${discountInfo.discountAmount}).`
        : "Session confirmed! Google Meet link has been generated.",
    });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to book mentor session" }, { status: 500 });
  }
}
