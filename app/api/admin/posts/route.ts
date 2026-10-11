import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { PostStatus, PricingType, Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim() || "";
    const role = searchParams.get("role")?.trim() || "ALL";
    const status = searchParams.get("status")?.trim() || "ALL";
    const pricing = searchParams.get("pricing")?.trim() || "ALL";

    const whereClause: {
      status?: PostStatus;
      pricingType?: PricingType;
      user?: { role?: Role };
      OR?: Array<{
        skillName?: { contains: string; mode: "insensitive" };
        title?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (status !== "ALL" && (status === "ACTIVE" || status === "PAUSED" || status === "REMOVED")) {
      whereClause.status = status as PostStatus;
    }

    if (pricing !== "ALL" && (pricing === "FREE" || pricing === "PAID")) {
      whereClause.pricingType = pricing as PricingType;
    }

    if (role !== "ALL" && (role === "STUDENT" || role === "MENTOR")) {
      whereClause.user = { role: role as Role };
    }

    if (query) {
      whereClause.OR = [
        { skillName: { contains: query, mode: "insensitive" } },
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            xp: true,
            profile: {
              select: {
                headline: true,
                mentorLevel: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookings: true,
            reports: true,
          },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error: unknown) {
    console.error("Admin Posts GET Error:", error);
    const message = error instanceof Error ? error.message : "Internal error fetching posts";
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
    const { postId, status } = body;

    if (!postId || !status) {
      return NextResponse.json({ error: "postId and status are required" }, { status: 400 });
    }

    if (status !== "ACTIVE" && status !== "PAUSED" && status !== "REMOVED") {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: { status: status as PostStatus },
      include: {
        user: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: `Post "${updated.title}" marked as ${updated.status}`,
      post: updated,
    });
  } catch (error: unknown) {
    console.error("Admin Posts PATCH Error:", error);
    const message = error instanceof Error ? error.message : "Internal error updating post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Post permanently deleted" });
  } catch (error: unknown) {
    console.error("Admin Posts DELETE Error:", error);
    const message = error instanceof Error ? error.message : "Internal error deleting post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
