import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { BookingStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status")?.trim() || "ALL";

    const whereClause: { status?: BookingStatus } = {};
    if (
      status !== "ALL" &&
      (status === "PENDING" ||
        status === "ACCEPTED" ||
        status === "REJECTED" ||
        status === "COMPLETED" ||
        status === "CANCELLED")
    ) {
      whereClause.status = status as BookingStatus;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            xp: true,
          },
        },
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            xp: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            skillName: true,
            pricingType: true,
            priceAmount: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
          },
        },
      },
    });

    return NextResponse.json({ bookings });
  } catch (error: unknown) {
    console.error("Admin Bookings GET Error:", error);
    const message = error instanceof Error ? error.message : "Internal error fetching bookings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { bookingId, status, meetingUrl } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
    }

    const updateData: {
      status?: BookingStatus;
      meetingUrl?: string;
    } = {};

    if (
      status &&
      (status === "PENDING" ||
        status === "ACCEPTED" ||
        status === "REJECTED" ||
        status === "COMPLETED" ||
        status === "CANCELLED")
    ) {
      updateData.status = status as BookingStatus;
    }

    if (typeof meetingUrl === "string") {
      updateData.meetingUrl = meetingUrl.trim();
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        student: { select: { name: true } },
        mentor: { select: { name: true } },
      },
    });

    return NextResponse.json({
      message: `Booking updated to ${updated.status}`,
      booking: updated,
    });
  } catch (error: unknown) {
    console.error("Admin Bookings PATCH Error:", error);
    const message = error instanceof Error ? error.message : "Internal error updating booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
