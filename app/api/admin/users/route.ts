import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim() || "";
    const role = searchParams.get("role")?.trim() || "ALL";

    const whereClause: {
      role?: Role;
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (role !== "ALL" && (role === "STUDENT" || role === "MENTOR" || role === "ADMIN")) {
      whereClause.role = role as Role;
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        xp: true,
        completedActivities: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            headline: true,
            mentorLevel: true,
            mentorScore: true,
            skills: true,
          },
        },
        _count: {
          select: {
            posts: true,
            sentBookings: true,
            recvBookings: true,
            reviewsRecv: true,
            reportsReceived: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error: unknown) {
    console.error("Admin Users GET Error:", error);
    const message = error instanceof Error ? error.message : "Internal error fetching users";
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
    const { userId, role, xpDelta, setXp } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: {
      role?: Role;
      xp?: number;
    } = {};

    if (role && (role === "STUDENT" || role === "MENTOR" || role === "ADMIN")) {
      updateData.role = role as Role;
    }

    if (typeof setXp === "number") {
      updateData.xp = Math.max(0, setXp);
    } else if (typeof xpDelta === "number") {
      updateData.xp = Math.max(0, existing.xp + xpDelta);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        xp: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: `User ${updatedUser.name} updated successfully`,
      user: updatedUser,
    });
  } catch (error: unknown) {
    console.error("Admin Users PATCH Error:", error);
    const message = error instanceof Error ? error.message : "Internal error updating user";
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
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Protect the admin from deleting themselves
    if (auth.session?.id === userId) {
      return NextResponse.json({ error: "You cannot delete your own admin account" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: unknown) {
    console.error("Admin Users DELETE Error:", error);
    const message = error instanceof Error ? error.message : "Internal error deleting user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
