"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { CATEGORY_OPTIONS } from "@/lib/validations/post";

export type MentorPostItem = {
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
  bookings?: {
    id: string;
    status: string;
    scheduledAt: string | null;
    student: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
  }[];
};

const POPULAR_SKILLS = [
  "React",
  "Next.js",
  "Python",
  "Data Structures",
  "PostgreSQL",
  "UI/UX Design",
  "Machine Learning",
  "DevOps & Cloud",
];

export default function MentorDashboardView() {
  const { user, isLoading: isAuthLoading, refreshUser } = useAuth();
  const openLoginModal = useLoginModal();

  // Posts state
  const [posts, setPosts] = useState<MentorPostItem[] | null>(null);
  const isLoadingPosts = user ? posts === null : false;
  const postList = posts || [];
  const [activeTab, setActiveTab] = useState<"ads" | "create" | "inquiries">("ads");

  // Form state
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState<string>("Frontend");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricingType, setPricingType] = useState<"FREE" | "PAID">("FREE");
  const [priceAmount, setPriceAmount] = useState<string>("499");
  const [availability, setAvailability] = useState("Weekends 10 AM - 2 PM");

  // Status feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [xpCelebration, setXpCelebration] = useState<number | null>(null);

  // Switch to mentor role state
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  // Manual refresh callback
  const refreshMentorPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/mentor/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Error fetching mentor posts:", err);
    }
  }, []);

  // Initial load effect
  useEffect(() => {
    let ignore = false;
    async function initLoad() {
      try {
        const res = await fetch("/api/mentor/posts");
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setPosts(data.posts || []);
          }
        }
      } catch (err) {
        console.error("Error fetching mentor posts:", err);
      }
    }

    if (user) {
      initLoad();
    }
    return () => {
      ignore = true;
    };
  }, [user]);

  // Handle Role Switch for Students who want to become Mentors
  const handleUpgradeToMentor = async () => {
    if (!user) return;
    try {
      setIsSwitchingRole(true);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          bio: user.profile?.bio || "Experienced developer passionate about guiding students.",
          education: user.profile?.education || "Tech Specialist",
          skills: user.profile?.skills || ["Programming"],
          interests: user.profile?.interests || ["Mentorship"],
          headline: "Peer Mentor",
        }),
      });

      if (res.ok) {
        await refreshUser();
        setSuccessMessage("Mentor role unlocked! You can now create ads and offer sessions.");
      }
    } catch {
      setErrorMessage("Could not update account role. Please try again.");
    } finally {
      setIsSwitchingRole(false);
    }
  };

  // Handle Post Creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!skillName.trim() || !title.trim() || !description.trim() || !availability.trim()) {
      setErrorMessage("Please complete all required fields before publishing.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/mentor/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillName: skillName.trim(),
          category,
          title: title.trim(),
          description: description.trim(),
          pricingType,
          priceAmount: pricingType === "PAID" ? parseFloat(priceAmount) || 0 : null,
          availability: availability.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to publish skill ad");
        return;
      }

      if (data.xpAwarded && data.xpAwarded > 0) {
        setXpCelebration(data.xpAwarded);
      }
      await refreshUser();

      setSuccessMessage("Skill offering published successfully! Students can now find you in Search.");
      // Reset form
      setSkillName("");
      setTitle("");
      setDescription("");
      setPricingType("FREE");
      // Switch back to ads list
      setActiveTab("ads");
      // Refresh list
      refreshMentorPosts();
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error while publishing post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Post Status (ACTIVE / PAUSED)
  const handleToggleStatus = async (post: MentorPostItem) => {
    const nextStatus = post.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      const res = await fetch("/api/mentor/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, status: nextStatus }),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev ? prev.map((p) => (p.id === post.id ? { ...p, status: nextStatus } : p)) : null
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Delete Post
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to remove this skill ad?")) return;
    try {
      const res = await fetch(`/api/mentor/posts?id=${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts((prev) => (prev ? prev.filter((p) => p.id !== postId) : null));
        setSuccessMessage("Skill ad removed.");
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  // Total bookings received
  const totalBookings = postList.reduce((acc, p) => acc + (p.bookings?.length || 0), 0);
  const activePostsCount = postList.filter((p) => p.status === "ACTIVE").length;

  // Unauthenticated Guard
  if (!isAuthLoading && !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50/50 px-5 py-16">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 mb-4 font-bold">
            🎓
          </div>
          <h1 className="text-xl font-bold text-slate-900">Mentor Studio Login Required</h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Sign in with your mentor account to publish skill offerings, manage availability, and connect with students eager to learn.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={openLoginModal}
              className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition hover:bg-slate-800 shadow-xs"
            >
              Sign In to SkillVerse
            </button>
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Student Account View with Quick Role Switch CTA
  if (user && user.role === "STUDENT") {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 px-5 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-white to-blue-50/40 p-8 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-xl">
                ✦
              </span>
              <div>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                  Role Notice
                </span>
                <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                  Activate Mentor Mode
                </h1>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              You are currently registered with a <span className="font-bold text-slate-900">Student</span> profile.
              The Mentor Studio is where experienced peers publish skill ads, set their session pricing, and offer 1-on-1 mentorship.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <span className="text-lg">📢</span>
                <h3 className="font-bold text-xs text-slate-900 mt-2">Post Skill Offerings</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  List skills like React, Python, or UI Design so students can discover and book sessions with you.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <span className="text-lg">👑</span>
                <h3 className="font-bold text-xs text-slate-900 mt-2">AI Level Accreditation</h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Verify your technical competence and earn an official Tier 1–3 mentor certificate.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleUpgradeToMentor}
                disabled={isSwitchingRole}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs font-bold text-white shadow-xs transition disabled:opacity-50"
              >
                {isSwitchingRole ? "Activating..." : "Enable Mentor Features Now →"}
              </button>
              <Link
                href="/search"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Browse Mentors as Student instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Mentor Studio</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
            >
              <span>Explore Student Directory</span>
              <span>↗</span>
            </Link>
          </div>
        </div>

        {/* Feedback Messages */}
        {xpCelebration && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black text-lg">
                ⚡
              </span>
              <div>
                <p className="font-bold text-sm">+{xpCelebration} XP Earned!</p>
                <p className="text-xs text-amber-800">
                  Congratulations on publishing your skill offering ad!
                </p>
              </div>
            </div>
            <button
              onClick={() => setXpCelebration(null)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800">
            {errorMessage}
          </div>
        )}

        {/* 1. MENTOR HERO & ACCREDITATION BANNER */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start sm:items-center gap-4">
              <div className="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-xl sm:text-2xl font-bold text-white shadow-xs">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user?.name || "Mentor"} className="size-full rounded-2xl object-cover" />
                ) : (
                  user?.name ? user.name.slice(0, 2).toUpperCase() : "ME"
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {user?.name || "Mentor"}
                  </h1>
                  <svg className="size-4 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-label="Verified Mentor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {user?.profile?.mentorLevel && (
                    <span className="text-xs font-medium text-slate-500">
                      • {user.profile.mentorLevel}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {user?.profile?.headline || "Peer Mentor & Technical Advisor"} • {user?.email}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span>⚡ {user?.xp || 0} XP</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-600">Accepting inquiries</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("create")}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:scale-[1.02] flex items-center gap-2"
              >
                <span>+ Post New Skill Ad</span>
              </button>
              <Link
                href="/profile"
                className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition"
              >
                Edit Bio & Profile
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Active Skill Ads
              </span>
              <p className="mt-1 text-2xl font-black text-slate-900">{activePostsCount}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Live in student search</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Inquiries
              </span>
              <p className="mt-1 text-2xl font-black text-blue-600">{totalBookings}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Student booking requests</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Accreditation
              </span>
              <p className="mt-1 text-sm font-extrabold text-slate-900 truncate">
                {user?.profile?.mentorLevel || "Not Certified"}
              </p>
              <Link
                href="/assessment?quiz=mentor_accreditation"
                className="text-[10px] font-semibold text-blue-600 hover:underline mt-0.5 block"
              >
                {user?.profile?.mentorLevel ? "Retake AI Test →" : "Take AI Test (+15 XP) →"}
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Public Visibility
              </span>
              <p className="mt-1 text-2xl font-black text-emerald-600">100%</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Indexed on explore page</p>
            </div>
          </div>
        </div>

        {/* 2. TAB CONTROLS */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("ads")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "ads"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            My Published Ads ({postList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "create"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            + Post New Skill Ad
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === "inquiries"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Student Inquiries & Bookings ({totalBookings})
          </button>
        </div>

        {/* 3. TAB CONTENT: CREATE POST / SKILL AD */}
        {activeTab === "create" && (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleCreatePost}
                className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Publish a New Skill Offering Ad
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    This ad will be featured in the Student Search Directory so students looking for your technical expertise can find and book sessions with you.
                  </p>
                </div>

                {/* Skill Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Skill or Topic Being Offered *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="e.g. React, Python DSA, Machine Learning, UI/UX"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Quick select:</span>
                    {POPULAR_SKILLS.map((sk) => (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => setSkillName(sk)}
                        className="rounded-md bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 transition"
                      >
                        +{sk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ad Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Ad Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 1-on-1 React Component Patterns & State Optimization"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Session Description & Curriculum *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what you will cover, prerequisites, what problems you will help the student solve, and how the 1-on-1 session will be structured..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Pricing Type & Amount */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">Session Model *</label>
                    <div className="mt-1.5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPricingType("FREE")}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition border ${
                          pricingType === "FREE"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Free Peer Session
                      </button>
                      <button
                        type="button"
                        onClick={() => setPricingType("PAID")}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition border ${
                          pricingType === "PAID"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Paid Mentorship
                      </button>
                    </div>
                  </div>

                  {pricingType === "PAID" ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700">
                        Price (₹ INR / session) *
                      </label>
                      <div className="relative mt-1.5">
                        <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={priceAmount}
                          onChange={(e) => setPriceAmount(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 pl-8 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                          placeholder="499"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center pt-5">
                      <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                        ✓ Free sessions earn high peer reviews and boost your visibility in search!
                      </p>
                    </div>
                  )}
                </div>

                {/* Availability Window */}
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Availability / Time Slot *
                  </label>
                  <input
                    type="text"
                    required
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="e.g. Weekends 10 AM - 2 PM, Mon & Wed Evenings 7-9 PM"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab("ads")}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isSubmitting ? "Publishing Ad..." : "Publish Skill Ad (+15 XP)"}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Student Preview Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Live Preview: How Students See Your Ad
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  This is the actual card students will browse when searching on SkillVerse.
                </p>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full overflow-hidden border border-slate-200 bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                        {user?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.image} alt={user?.name || "Mentor"} className="size-full object-cover" />
                        ) : (
                          user?.name?.slice(0, 2).toUpperCase() || "ME"
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900">{user?.name || "Your Name"}</h4>
                          <svg className="size-3.5 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-label="Verified Mentor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {user?.profile?.mentorLevel || user?.profile?.headline || "Experienced Peer Mentor"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skill Badge & Title */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                      <span>Skill:</span>
                      <span className="underline">{skillName || "Skill Name"}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-slate-900 leading-snug">
                      {title || "Ad Title & Headline will appear here"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {description || "Provide an engaging description so students understand the value of your 1-on-1 mentoring session."}
                    </p>
                  </div>

                  {/* Pricing & Availability footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Pricing</span>
                      <span className="font-extrabold text-slate-900">
                        {pricingType === "FREE" ? "Free Session" : `₹${priceAmount || "499"}`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Availability</span>
                      <span className="font-semibold text-slate-700 text-[11px]">
                        {availability || "Flexible"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white opacity-80"
                    >
                      Book 1-on-1 Session (Student View)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. TAB CONTENT: MY PUBLISHED ADS LIST */}
        {activeTab === "ads" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">My Published Skill Offerings</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage your active ads, pause visibility when busy, or test search discovery.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("create")}
                className="rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
              >
                + Create New Ad
              </button>
            </div>

            {isLoadingPosts ? (
              <div className="flex min-h-[30vh] items-center justify-center">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="size-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  <span>Loading your skill ads...</span>
                </div>
              </div>
            ) : postList.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 mb-3">
                  📢
                </div>
                <h3 className="text-base font-bold text-slate-900">No Skill Ads Published Yet</h3>
                <p className="mt-1 max-w-md mx-auto text-xs text-slate-500">
                  You haven&apos;t posted any skill ads yet. Create your first offering so students can search for you by skill and book 1-on-1 mentorship sessions.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("create")}
                  className="mt-5 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition"
                >
                  + Create Your First Skill Ad (+15 XP)
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {postList.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition"
                  >
                    <div>
                      {/* Top Badges & Status */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                            {post.skillName}
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {post.category}
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            post.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          ● {post.status}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="mt-4 text-base font-bold text-slate-900 leading-snug">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                        {post.description}
                      </p>

                      {/* Details row */}
                      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Model:
                          </span>
                          <span className="font-extrabold text-slate-900">
                            {post.pricingType === "FREE" ? "Free Session" : `₹${post.priceAmount}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Availability:
                          </span>
                          <span className="font-medium text-slate-700 text-[11px]">
                            {post.availability || "Flexible"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Bookings:
                          </span>
                          <span className="font-bold text-blue-600">
                            {post.bookings?.length || 0} students
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(post)}
                          className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition"
                        >
                          {post.status === "ACTIVE" ? "Pause Ad" : "Activate Ad"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          className="rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition"
                        >
                          Remove
                        </button>
                      </div>

                      <Link
                        href={`/search?q=${encodeURIComponent(post.skillName)}`}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <span>Preview in Search</span>
                        <span>↗</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. TAB CONTENT: STUDENT INQUIRIES & SESSIONS */}
        {activeTab === "inquiries" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">Student Booking Requests</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sessions requested by students for your published offerings.
            </p>

            {totalBookings === 0 ? (
              <div className="mt-8 text-center py-10">
                <span className="text-3xl">📬</span>
                <p className="mt-2 text-sm font-bold text-slate-800">No session requests yet</p>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  As students search for skills and discover your ads, their session requests and 1-on-1 bookings will appear here.
                </p>
                <Link
                  href="/messages"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Open Messages Direct Chat →
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {postList.flatMap((p) => p.bookings || []).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-700">
                        {booking.student.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={booking.student.image} alt={booking.student.name} className="size-full object-cover" />
                        ) : (
                          booking.student.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{booking.student.name}</h4>
                        <p className="text-[11px] text-slate-500">{booking.student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                        {booking.status}
                      </span>
                      <Link
                        href="/messages"
                        className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white"
                      >
                        Message Student
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
