"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { getBadgeForXp } from "@/lib/badges";

type PlatformMetrics = {
  users: {
    total: number;
    students: number;
    mentors: number;
    admins: number;
  };
  posts: {
    total: number;
    studentPeerAds: number;
    mentorAds: number;
    free: number;
    paid: number;
    active: number;
  };
  bookings: {
    total: number;
    pending: number;
    completed: number;
  };
  reports: {
    total: number;
    pending: number;
  };
  economy: {
    totalXpDistributed: number;
    averageXp: number;
  };
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "STUDENT" | "MENTOR" | "ADMIN";
  xp: number;
  completedActivities: string[];
  createdAt: string;
  updatedAt: string;
  profile?: {
    headline: string | null;
    mentorLevel: string | null;
    mentorScore: number | null;
    skills: string[];
  } | null;
  _count: {
    posts: number;
    sentBookings: number;
    recvBookings: number;
    reviewsRecv: number;
    reportsReceived: number;
  };
};

type AdminPost = {
  id: string;
  userId: string;
  skillName: string;
  category: string;
  title: string;
  description: string;
  pricingType: "FREE" | "PAID";
  priceAmount: number | null;
  availability: string | null;
  status: "ACTIVE" | "PAUSED" | "REMOVED";
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: "STUDENT" | "MENTOR" | "ADMIN";
    xp: number;
    profile?: {
      headline: string | null;
      mentorLevel: string | null;
    } | null;
  };
  _count: {
    bookings: number;
    reports: number;
  };
};

type AdminBooking = {
  id: string;
  postId: string;
  studentId: string;
  mentorId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  scheduledAt: string | null;
  meetingUrl: string | null;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    role: string;
    xp: number;
  };
  mentor: {
    id: string;
    name: string;
    email: string;
    role: string;
    xp: number;
  };
  post: {
    id: string;
    title: string;
    skillName: string;
    pricingType: "FREE" | "PAID";
    priceAmount: number | null;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
  }>;
};

type AdminReport = {
  id: string;
  reporterId: string;
  targetType: "USER" | "POST" | "PROJECT_POST" | "MESSAGE";
  reason: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  adminNotes: string | null;
  createdAt: string;
  reporter: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  reportedUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  reportedPost?: {
    id: string;
    title: string;
    skillName: string;
    pricingType: string;
    status: string;
  } | null;
  reportedProject?: {
    id: string;
    title: string;
  } | null;
};

type TabType = "overview" | "users" | "posts" | "bookings" | "reports";

export default function AdminDashboardView() {
  const { user, login } = useAuth();
  const openLoginModal = useLoginModal();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [postsList, setPostsList] = useState<AdminPost[]>([]);
  const [bookingsList, setBookingsList] = useState<AdminBooking[]>([]);
  const [reportsList, setReportsList] = useState<AdminReport[]>([]);

  // Search & Filter state
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"ALL" | "STUDENT" | "MENTOR" | "ADMIN">("ALL");
  const [postSearch, setPostSearch] = useState("");
  const [postRoleFilter, setPostRoleFilter] = useState<"ALL" | "STUDENT" | "MENTOR">("ALL");
  const [postStatusFilter, setPostStatusFilter] = useState<"ALL" | "ACTIVE" | "PAUSED" | "REMOVED">("ALL");

  // Loading & Action states
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Edit User Modal
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<"STUDENT" | "MENTOR" | "ADMIN">("STUDENT");
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  // Quick Admin Login State
  const [isQuickLoggingIn, setIsQuickLoggingIn] = useState(false);

  // Show notification helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => {
    setIsLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    let isCancelled = false;

    async function loadData() {
      try {
        const [statsRes, usersRes, postsRes, bookingsRes, reportsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/users"),
          fetch("/api/admin/posts"),
          fetch("/api/admin/bookings"),
          fetch("/api/admin/reports"),
        ]);

        if (isCancelled) return;

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (!isCancelled) setMetrics(statsData.metrics);
        }
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (!isCancelled) setUsersList(usersData.users || []);
        }
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          if (!isCancelled) setPostsList(postsData.posts || []);
        }
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          if (!isCancelled) setBookingsList(bookingsData.bookings || []);
        }
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          if (!isCancelled) setReportsList(reportsData.reports || []);
        }
      } catch (err: unknown) {
        console.error("Failed to load admin data:", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [user, refreshKey]);

  // Quick 1-click Admin Login helper for testing
  const handleQuickAdminLogin = async () => {
    setIsQuickLoggingIn(true);
    try {
      const res = await login("admin@gmail.com", "admin123");
      if (res.success) {
        showToast("Logged in as Admin (admin@gmail.com)");
      } else {
        showToast(res.error || "Failed to sign in as admin", "error");
      }
    } finally {
      setIsQuickLoggingIn(false);
    }
  };

  // User Actions
  const handleUpdateUserRole = async (userId: string, role: "STUDENT" | "MENTOR" | "ADMIN") => {
    setIsUpdatingUser(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");

      showToast(`User role updated to ${role}`);
      setSelectedUserForEdit(null);
      triggerRefresh();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error updating user role", "error");
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleAdjustXp = async (userId: string, xpDelta: number) => {
    setIsUpdatingUser(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, xpDelta }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to adjust XP");

      showToast(`Adjusted XP by ${xpDelta > 0 ? `+${xpDelta}` : xpDelta}`);
      setSelectedUserForEdit(null);
      triggerRefresh();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error updating XP", "error");
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to permanently delete user "${userName}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      showToast(`User "${userName}" deleted successfully`);
      triggerRefresh();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error deleting user", "error");
    }
  };

  // Post Actions
  const handleUpdatePostStatus = async (postId: string, status: "ACTIVE" | "PAUSED" | "REMOVED") => {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update post status");

      showToast(data.message || `Post status updated to ${status}`);
      triggerRefresh();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error updating post", "error");
    }
  };

  const handleDeletePost = async (postId: string, title: string) => {
    if (!confirm(`Permanently remove post: "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/posts?postId=${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete post");

      showToast(`Post deleted`);
      triggerRefresh();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error deleting post", "error");
    }
  };

  // Booking Actions
  const handleUpdateBookingStatus = async (bookingId: string, status: "ACCEPTED" | "COMPLETED" | "CANCELLED") => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update booking status");

      showToast(`Booking marked as ${status}`);
      triggerRefresh();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error updating booking", "error");
    }
  };

  // Report Actions
  const handleUpdateReportStatus = async (reportId: string, status: "RESOLVED" | "DISMISSED") => {
    const adminNotes = prompt("Enter admin resolution notes (optional):") || "";
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status, adminNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update report status");

      showToast(`Report updated to ${status}`);
      triggerRefresh();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error updating report", "error");
    }
  };

  // Filtered Lists
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredPosts = postsList.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.skillName.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.user.name.toLowerCase().includes(postSearch.toLowerCase());
    const matchesRole = postRoleFilter === "ALL" || p.user.role === postRoleFilter;
    const matchesStatus = postStatusFilter === "ALL" || p.status === postStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // NON-ADMIN STATE (CLEAN LIGHT THEME)
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50/50 px-5 py-16">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl text-purple-600 mb-4 font-bold shadow-xs">
            🛡️
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            SkillVerse Admin Control Center
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            This dashboard is restricted to verified administrators. You are currently{" "}
            {user ? (
              <span>
                signed in as <strong>{user.name}</strong> ({user.role})
              </span>
            ) : (
              <span>not signed in</span>
            )}.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              disabled={isQuickLoggingIn}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 py-3 text-xs font-bold text-white shadow-xs transition hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
            >
              <span>🛡️ Sign In with Admin Credentials</span>
              <span className="rounded-md bg-purple-500/80 px-2 py-0.5 text-[10px]">admin@gmail.com</span>
            </button>

            <button
              type="button"
              onClick={openLoginModal}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              Switch or Sign In to Another Account
            </button>

            <Link
              href="/"
              className="mt-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition underline"
            >
              ← Return to SkillVerse Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-5 sm:px-8 font-sans text-slate-900">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold shadow-xl transition animate-fade-in ${
            notification.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          <span>{notification.type === "success" ? "✓" : "⚠"}</span>
          <span>{notification.message}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Admin Command Center</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={triggerRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
            >
              <svg className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
            </button>

            <Link
              href="/search"
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition"
            >
              <span>View Catalog</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* 1. ADMIN HERO BANNER (WEBSITE THEME) */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start sm:items-center gap-4">
              <div className="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-2xl font-bold text-white shadow-xs">
                🛡️
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Admin Command Center
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                    <span>★</span>
                    <span>Super Administrator</span>
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Logged in as <strong>{user.name}</strong> ({user.email}) • Database:{" "}
                  <span className="font-semibold text-emerald-600">Live PostgreSQL (Neon)</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                <span className="font-bold text-slate-900">{metrics?.users.total || usersList.length}</span> Users Total
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                <span className="font-bold text-slate-900">{metrics?.posts.total || postsList.length}</span> Active Ads
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                <span className="font-bold text-slate-900">{metrics?.bookings.total || bookingsList.length}</span> Bookings
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview & Analytics", icon: "📊" },
              { id: "users", label: `Users (${usersList.length})`, icon: "👥" },
              { id: "posts", label: `Ads & Sessions (${postsList.length})`, icon: "📢" },
              { id: "bookings", label: `Bookings (${bookingsList.length})`, icon: "📅" },
              { id: "reports", label: `Moderation Reports (${reportsList.length})`, icon: "🚨" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI METRICS GRID (MATCHING THEME) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Users Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Total Users</span>
                  <span className="rounded-lg bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs text-blue-700 font-bold">
                    👥 Community
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{metrics?.users.total || usersList.length}</span>
                  <span className="text-xs text-slate-400">accounts</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <span>Students: <strong className="text-slate-800">{metrics?.users.students ?? 0}</strong></span>
                  <span>Mentors: <strong className="text-slate-800">{metrics?.users.mentors ?? 0}</strong></span>
                  <span>Admins: <strong className="text-purple-700">{metrics?.users.admins ?? 0}</strong></span>
                </div>
              </div>

              {/* Total Skill Ads Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Skill Ads & Sessions</span>
                  <span className="rounded-lg bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-xs text-emerald-800 font-bold">
                    📢 Catalog
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{metrics?.posts.total || postsList.length}</span>
                  <span className="text-xs text-slate-400">published ads</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <span className="text-emerald-700 font-semibold">🌱 Peer: {metrics?.posts.studentPeerAds ?? 0}</span>
                  <span className="text-blue-700 font-semibold">👑 Mentor: {metrics?.posts.mentorAds ?? 0}</span>
                  <span>Active: {metrics?.posts.active ?? 0}</span>
                </div>
              </div>

              {/* Total Bookings Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Session Bookings</span>
                  <span className="rounded-lg bg-amber-50 border border-amber-100 px-2 py-0.5 text-xs text-amber-800 font-bold">
                    📅 Sessions
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{metrics?.bookings.total || bookingsList.length}</span>
                  <span className="text-xs text-slate-400">1-on-1 sessions</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <span className="text-amber-700 font-semibold">Pending: {metrics?.bookings.pending ?? 0}</span>
                  <span className="text-emerald-700 font-semibold">Completed: {metrics?.bookings.completed ?? 0}</span>
                </div>
              </div>

              {/* XP Economy Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">XP Economy</span>
                  <span className="rounded-lg bg-purple-50 border border-purple-100 px-2 py-0.5 text-xs text-purple-700 font-bold">
                    ⚡ Badges & XP
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    {metrics?.economy.totalXpDistributed ?? usersList.reduce((acc, u) => acc + u.xp, 0)}
                  </span>
                  <span className="text-xs text-slate-400">XP distributed</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <span>Avg: ~{metrics?.economy.averageXp ?? 15} XP/user</span>
                  <span className="text-purple-700 font-medium">Milestones Active</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS & AUDIT SUMMARY */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Quick Actions Panel */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>⚡ Quick Admin Operations</span>
                </h3>
                <p className="mt-1 text-xs text-slate-500">One-click administrative shortcuts and audit triggers.</p>

                <div className="mt-5 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("users")}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-900 transition"
                  >
                    <span>Manage User Roles & Promote/Demote</span>
                    <span className="text-purple-600 font-bold">Open Users →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("posts")}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-900 transition"
                  >
                    <span>Moderate Peer Ads & Mentor Offers</span>
                    <span className="text-emerald-600 font-bold">Open Ads →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("reports")}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-900 transition"
                  >
                    <span>Review Community Content Flags</span>
                    <span className="text-rose-600 font-bold">Open Reports →</span>
                  </button>
                </div>
              </div>

              {/* Recent Users List */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Recent Users</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("users")}
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="mt-4 divide-y divide-slate-100">
                  {usersList.slice(0, 5).map((u) => {
                    const badge = getBadgeForXp(u.xp);
                    return (
                      <div key={u.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-800">
                            {u.name.slice(0, 1)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 leading-none">{u.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{u.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                              u.role === "ADMIN"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : u.role === "MENTOR"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {u.role}
                          </span>
                          <p className="text-[10px] text-slate-500 mt-0.5">{badge.name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Ads List */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Recent Skill Ads</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("posts")}
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="mt-4 divide-y divide-slate-100">
                  {postsList.slice(0, 5).map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate max-w-[180px]">{p.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          By {p.user.name} • {p.user.role === "STUDENT" ? "🌱 Peer" : "👑 Mentor"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            p.pricingType === "FREE"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {p.pricingType === "FREE" ? "Free Exchange" : `₹${p.priceAmount}`}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{p.status}</p>
                      </div>
                    </div>
                  ))}
                  {postsList.length === 0 && (
                    <p className="text-xs text-slate-500 py-4 text-center">No skill ads published yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-fade-in">
            {/* Search & Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filter Role:</span>
                {(["ALL", "STUDENT", "MENTOR", "ADMIN"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setUserRoleFilter(r)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      userRoleFilter === r
                        ? "bg-slate-900 text-white shadow-xs"
                        : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3.5">User</th>
                      <th className="px-5 py-3.5">Role</th>
                      <th className="px-5 py-3.5">XP & Milestone Badge</th>
                      <th className="px-5 py-3.5">Ads Published</th>
                      <th className="px-5 py-3.5">Bookings</th>
                      <th className="px-5 py-3.5">Registered</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => {
                      const badge = getBadgeForXp(u.xp);
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/60 transition">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 font-bold text-white shadow-xs">
                                {u.name.slice(0, 1)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{u.name}</p>
                                <p className="text-[11px] text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                u.role === "ADMIN"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : u.role === "MENTOR"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              }`}
                            >
                              <span>{u.role === "ADMIN" ? "🛡️" : u.role === "MENTOR" ? "👑" : "🌱"}</span>
                              <span>{u.role}</span>
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-purple-700">{u.xp} XP</span>
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-semibold">
                                {badge.icon} {badge.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 font-semibold text-slate-800">
                            {u._count.posts} {u.role === "STUDENT" ? "Peer Ads" : "Mentor Ads"}
                          </td>

                          <td className="px-5 py-4 text-slate-500">
                            <span>Sent: {u._count.sentBookings}</span> •{" "}
                            <span>Recv: {u._count.recvBookings}</span>
                          </td>

                          <td className="px-5 py-4 text-slate-500 text-[11px]">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUserForEdit(u);
                                  setNewRole(u.role);
                                }}
                                className="rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 text-[11px] font-bold text-purple-700 transition"
                              >
                                Edit Role / XP
                              </button>
                              {u.id !== user.id && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className="rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 px-2 py-1 text-[11px] font-bold text-rose-600 transition"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADS & SESSIONS MANAGEMENT */}
        {activeTab === "posts" && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  placeholder="Search ads by skill, title, or creator name..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Type:</span>
                {(["ALL", "STUDENT", "MENTOR"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPostRoleFilter(r)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      postRoleFilter === r
                        ? "bg-slate-900 text-white shadow-xs"
                        : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {r === "ALL" ? "All Ads" : r === "STUDENT" ? "🌱 Student Peer Ads" : "👑 Mentor Ads"}
                  </button>
                ))}

                <span className="text-xs font-semibold text-slate-500 ml-2">Status:</span>
                {(["ALL", "ACTIVE", "PAUSED", "REMOVED"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPostStatusFilter(s)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      postStatusFilter === s
                        ? "bg-slate-900 text-white shadow-xs"
                        : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 hover:shadow-md transition"
                >
                  <div>
                    {/* Header Pill */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        {post.user.role === "STUDENT" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                            <span>🌱</span>
                            <span>Student Peer Ad (XP Only)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                            <span>👑</span>
                            <span>Industry Mentor Ad</span>
                          </span>
                        )}
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          post.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : post.status === "PAUSED"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Creator:</span>
                        <strong className="text-slate-900">{post.user.name}</strong>
                        <span>({post.user.email})</span>
                      </div>
                      <h4 className="mt-2 text-base font-bold text-slate-900 leading-snug">{post.title}</h4>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">{post.description}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        Skill: {post.skillName}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        Category: {post.category}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          post.pricingType === "FREE"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {post.pricingType === "FREE" ? "🎁 Free Exchange" : `₹${post.priceAmount}`}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Bookings: {post._count.bookings} • Created: {new Date(post.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {post.status !== "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() => handleUpdatePostStatus(post.id, "ACTIVE")}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs transition"
                        >
                          Activate
                        </button>
                      )}
                      {post.status !== "PAUSED" && (
                        <button
                          type="button"
                          onClick={() => handleUpdatePostStatus(post.id, "PAUSED")}
                          className="rounded-lg bg-amber-500 hover:bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs transition"
                        >
                          Pause
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id, post.title)}
                        className="rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="col-span-2 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                  <p className="text-sm font-bold text-slate-900">No ads found matching your filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: BOOKINGS MANAGEMENT */}
        {activeTab === "bookings" && (
          <div className="space-y-6 animate-fade-in">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3.5">Student Learner</th>
                      <th className="px-5 py-3.5">Mentor / Peer</th>
                      <th className="px-5 py-3.5">Session Title</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Meeting URL</th>
                      <th className="px-5 py-3.5">Scheduled Date</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookingsList.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-4 font-bold text-slate-900">{b.student.name}</td>
                        <td className="px-5 py-4 text-slate-800">
                          {b.mentor.name}{" "}
                          <span className="text-[10px] text-slate-400">({b.mentor.role})</span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-purple-700 max-w-[200px] truncate">
                          {b.post.title}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              b.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : b.status === "ACCEPTED"
                                ? "bg-blue-100 text-blue-800"
                                : b.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-[11px] max-w-[150px] truncate">
                          {b.meetingUrl || "—"}
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-[11px]">
                          {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : "TBD"}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.status !== "COMPLETED" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateBookingStatus(b.id, "COMPLETED")}
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2 py-1 text-[10px] font-bold text-white shadow-xs transition"
                              >
                                Complete
                              </button>
                            )}
                            {b.status !== "CANCELLED" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateBookingStatus(b.id, "CANCELLED")}
                                className="rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 px-2 py-1 text-[10px] font-bold text-rose-600 transition"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {bookingsList.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-500">
                          No session bookings found in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MODERATION REPORTS */}
        {activeTab === "reports" && (
          <div className="space-y-6 animate-fade-in">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3.5">Reporter</th>
                      <th className="px-5 py-3.5">Target Type</th>
                      <th className="px-5 py-3.5">Reason</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Admin Notes</th>
                      <th className="px-5 py-3.5">Reported At</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportsList.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-4 font-bold text-slate-900">{r.reporter.name}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                            {r.targetType}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-800 max-w-[220px]">{r.reason}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              r.status === "RESOLVED"
                                ? "bg-emerald-100 text-emerald-800"
                                : r.status === "DISMISSED"
                                ? "bg-slate-100 text-slate-700"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-[11px] max-w-[150px] truncate">
                          {r.adminNotes || "—"}
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-[11px]">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {r.status === "PENDING" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateReportStatus(r.id, "RESOLVED")}
                                  className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 shadow-xs transition"
                                >
                                  Resolve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateReportStatus(r.id, "DISMISSED")}
                                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition"
                                >
                                  Dismiss
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reportsList.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-500">
                          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 text-lg font-bold mb-2">
                            ✓
                          </div>
                          <p className="text-sm font-bold text-slate-900">No open moderation reports!</p>
                          <p className="text-xs text-slate-500 mt-1">Platform community content is in good standing.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT USER ROLE / XP MODAL (MATCHING THEME) */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Admin: Edit User Profile
              </h3>
              <button
                type="button"
                onClick={() => setSelectedUserForEdit(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm font-bold text-slate-900">{selectedUserForEdit.name}</p>
              <p className="text-xs text-slate-500">{selectedUserForEdit.email}</p>
              <p className="text-xs text-purple-700 font-semibold mt-1">
                Current Role: <strong>{selectedUserForEdit.role}</strong> • Current XP: <strong>{selectedUserForEdit.xp}</strong>
              </p>
            </div>

            {/* Change Role Section */}
            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-700 block mb-2">Change User Role:</label>
              <div className="grid grid-cols-3 gap-2">
                {(["STUDENT", "MENTOR", "ADMIN"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setNewRole(r)}
                    className={`rounded-xl py-2 text-xs font-bold transition border ${
                      newRole === r
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={isUpdatingUser || newRole === selectedUserForEdit.role}
                onClick={() => handleUpdateUserRole(selectedUserForEdit.id, newRole)}
                className="mt-3 w-full rounded-xl bg-purple-600 hover:bg-purple-700 py-2.5 text-xs font-bold text-white transition disabled:opacity-50 shadow-xs cursor-pointer"
              >
                Confirm Role Change
              </button>
            </div>

            {/* Adjust XP Section */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block mb-2">Adjust User XP:</label>
              <div className="flex items-center gap-2">
                {[20, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAdjustXp(selectedUserForEdit.id, amount)}
                    disabled={isUpdatingUser}
                    className="flex-1 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 py-2 text-xs font-bold text-emerald-800 transition disabled:opacity-50 cursor-pointer"
                  >
                    +{amount} XP
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleAdjustXp(selectedUserForEdit.id, -20)}
                  disabled={isUpdatingUser}
                  className="rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 transition disabled:opacity-50 cursor-pointer"
                >
                  -20 XP
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUserForEdit(null)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
