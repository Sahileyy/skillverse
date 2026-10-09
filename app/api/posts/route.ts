import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category")?.trim();
    const pricingType = searchParams.get("pricingType")?.trim();

    // Build Prisma where clause
    const whereClause: Record<string, unknown> = {
      status: "ACTIVE",
    };

    if (category && category !== "All Categories") {
      whereClause.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    if (pricingType && (pricingType === "FREE" || pricingType === "PAID")) {
      whereClause.pricingType = pricingType;
    }

    if (q) {
      whereClause.OR = [
        { skillName: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
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
                mentorScore: true,
                skills: true,
                bio: true,
              },
            },
            reviewsRecv: {
              select: {
                rating: true,
              },
            },
            _count: {
              select: {
                recvBookings: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
