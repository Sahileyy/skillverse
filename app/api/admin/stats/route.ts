import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await requireAuth(["ADMIN"]);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const [
      totalUsers,
      studentUsers,
      mentorUsers,
      adminUsers,
      totalPosts,
      freePosts,
      paidPosts,
      activePosts,
      totalBookings,
      pendingBookings,
      completedBookings,
      totalReports,
      pendingReports,
      usersWithXp,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "MENTOR" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.post.count(),
      prisma.post.count({ where: { pricingType: "FREE" } }),
      prisma.post.count({ where: { pricingType: "PAID" } }),
      prisma.post.count({ where: { status: "ACTIVE" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.report.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.user.aggregate({
        _sum: { xp: true },
        _avg: { xp: true },
      }),
    ]);

    // Fetch student peer ads vs mentor ads count
    const studentPeerAdsCount = await prisma.post.count({
      where: {
        user: { role: "STUDENT" },
      },
    });
    const mentorAdsCount = await prisma.post.count({
      where: {
        user: { role: "MENTOR" },
      },
    });

    // Recent 5 activities
    const [recentUsers, recentPosts, recentBookings, recentReports] = await Promise.all([
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          xp: true,
          createdAt: true,
        },
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          skillName: true,
          pricingType: true,
          priceAmount: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              role: true,
            },
          },
        },
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          createdAt: true,
          student: { select: { name: true } },
          mentor: { select: { name: true } },
          post: { select: { title: true, skillName: true } },
        },
      }),
      prisma.report.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          targetType: true,
          reason: true,
          status: true,
          createdAt: true,
          reporter: { select: { name: true } },
        },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        users: {
          total: totalUsers,
          students: studentUsers,
          mentors: mentorUsers,
          admins: adminUsers,
        },
        posts: {
          total: totalPosts,
          studentPeerAds: studentPeerAdsCount,
          mentorAds: mentorAdsCount,
          free: freePosts,
          paid: paidPosts,
          active: activePosts,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          completed: completedBookings,
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
        },
        economy: {
          totalXpDistributed: usersWithXp._sum.xp || 0,
          averageXp: Math.round(usersWithXp._avg.xp || 0),
        },
      },
      recent: {
        users: recentUsers,
        posts: recentPosts,
        bookings: recentBookings,
        reports: recentReports,
      },
    });
  } catch (error: unknown) {
    console.error("Admin Stats API Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error fetching admin stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
