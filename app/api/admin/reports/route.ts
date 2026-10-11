import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ReportStatus, ReportTargetType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status")?.trim() || "ALL";

    const whereClause: { status?: ReportStatus } = {};
    if (status !== "ALL" && (status === "PENDING" || status === "RESOLVED" || status === "DISMISSED")) {
      whereClause.status = status as ReportStatus;
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        reportedPost: {
          select: {
            id: true,
            title: true,
            skillName: true,
            pricingType: true,
            status: true,
          },
        },
        reportedProject: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ reports });
  } catch (error: unknown) {
    console.error("Admin Reports GET Error:", error);
    const message = error instanceof Error ? error.message : "Internal error fetching reports";
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
    const { reportId, status, adminNotes } = body;

    if (!reportId || !status) {
      return NextResponse.json({ error: "reportId and status are required" }, { status: 400 });
    }

    if (status !== "PENDING" && status !== "RESOLVED" && status !== "DISMISSED") {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: status as ReportStatus,
        adminNotes: adminNotes !== undefined ? String(adminNotes) : undefined,
      },
      include: {
        reporter: { select: { name: true } },
      },
    });

    return NextResponse.json({
      message: `Report marked as ${updated.status}`,
      report: updated,
    });
  } catch (error: unknown) {
    console.error("Admin Reports PATCH Error:", error);
    const message = error instanceof Error ? error.message : "Internal error updating report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Convenient helper for creating sample report if queue is empty
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth.error || !auth.session) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    const body = await req.json();
    const { targetType, reportedUserId, reportedPostId, reason } = body;

    if (!reason || !targetType) {
      return NextResponse.json({ error: "reason and targetType are required" }, { status: 400 });
    }

    const reporterId = auth.session.id;

    const newReport = await prisma.report.create({
      data: {
        reporterId,
        targetType: targetType as ReportTargetType,
        reportedUserId,
        reportedPostId,
        reason,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      message: "Report created successfully",
      report: newReport,
    });
  } catch (error: unknown) {
    console.error("Admin Reports POST Error:", error);
    const message = error instanceof Error ? error.message : "Internal error creating report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
