"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { useAuth } from "@/components/auth/auth-context";
import { getBadgeForXp } from "@/lib/badges";

export type MentorPost = {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorHeadline: string;
  creatorRole: "STUDENT" | "MENTOR";
  creatorXp?: number;
  badgeName?: string;
  badgeIcon?: string;
  skillName: string;
  category: string;
  title: string;
  description: string;
  pricingType: "FREE" | "PAID";
  priceAmount: string | null;
  availability: string;
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  tags: string[];
  isVerifiedPeer?: boolean;
};

export const MENTOR_POSTS_DATA: MentorPost[] = [
  {
    id: "post-1",
    mentorId: "mentor-aarav",
    mentorName: "Aarav Sharma",
    mentorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "Senior Frontend Engineer • Ex-Amazon",
    creatorRole: "MENTOR",
    badgeName: "Senior Mentor",
    badgeIcon: "👑",
    skillName: "React",
    category: "Frontend",
    title: "1-on-1 React Component Patterns & State Optimization",
    description: "Deep-dive into clean component composition, hooks architecture, Zustand vs Redux, and diagnosing unnecessary re-renders in production applications.",
    pricingType: "FREE",
    priceAmount: null,
    availability: "Weekends 10 AM - 2 PM",
    rating: 4.9,
    reviewCount: 52,
    sessionsCompleted: 140,
    tags: ["React", "TypeScript", "Next.js", "Performance"],
  },
  {
    id: "post-2",
    mentorId: "mentor-maya",
    mentorName: "Dr. Maya Patel",
    mentorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "AI Researcher & Data Scientist",
    creatorRole: "MENTOR",
    badgeName: "Master Mentor",
    badgeIcon: "👑",
    skillName: "Python",
    category: "AI / ML",
    title: "Applied Machine Learning & PyTorch Model Training",
    description: "Hands-on guidance on dataset preprocessing, neural network debugging in PyTorch, and deploying models using FastAPI and Docker.",
    pricingType: "PAID",
    priceAmount: "₹499",
    availability: "Mon, Wed & Sat Evenings",
    rating: 5.0,
    reviewCount: 38,
    sessionsCompleted: 95,
    tags: ["Python", "PyTorch", "NLP", "Machine Learning"],
  },
  {
    id: "post-3",
    mentorId: "mentor-noah",
    mentorName: "Noah Chen",
    mentorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "Product Designer & Design Systems Lead",
    creatorRole: "MENTOR",
    badgeName: "Senior Mentor",
    badgeIcon: "👑",
    skillName: "UI/UX Design",
    category: "UI/UX Design",
    title: "Production Design Systems & Figma Architecture",
    description: "Learn how to build scalable design tokens, auto-layout components, interactive prototypes, and prepare crisp handoffs for frontend engineering teams.",
    pricingType: "FREE",
    priceAmount: null,
    availability: "Weekdays 6 PM - 9 PM",
    rating: 4.8,
    reviewCount: 44,
    sessionsCompleted: 110,
    tags: ["UI/UX Design", "Figma", "Design Tokens", "Accessibility"],
  },
  {
    id: "post-4",
    mentorId: "mentor-priya",
    mentorName: "Priya Sundaram",
    mentorAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "Backend Architect • Distributed Systems",
    creatorRole: "MENTOR",
    badgeName: "Senior Mentor",
    badgeIcon: "👑",
    skillName: "PostgreSQL",
    category: "Backend",
    title: "Database Schema Design & Query Optimization",
    description: "Master indexing strategies, query execution plans, connection pooling, and relational modeling for high-scale backend services.",
    pricingType: "PAID",
    priceAmount: "₹699",
    availability: "Tue & Thu Evenings",
    rating: 4.9,
    reviewCount: 61,
    sessionsCompleted: 175,
    tags: ["PostgreSQL", "Go", "Prisma", "Database Tuning"],
  },
  {
    id: "post-5",
    mentorId: "mentor-karthik",
    mentorName: "Karthik Rajan",
    mentorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "CS Student & Web Peer • Silver Explorer",
    creatorRole: "STUDENT",
    creatorXp: 180,
    badgeName: "Silver Explorer",
    badgeIcon: "🥈",
    skillName: "Next.js",
    category: "Frontend",
    title: "Peer-to-Peer Next.js App Router Practice & Code Pairing",
    description: "Hey! Let's practice Next.js App Router together. We can pair on Server Components, layout nesting, Tailwind styling, and deploying personal projects.",
    pricingType: "FREE",
    priceAmount: null,
    availability: "Weekends All Day",
    rating: 4.9,
    reviewCount: 29,
    sessionsCompleted: 82,
    tags: ["Next.js", "React", "TypeScript", "Tailwind", "Peer Learning"],
    isVerifiedPeer: true,
  },
  {
    id: "post-6",
    mentorId: "mentor-anita",
    mentorName: "Anita Joseph",
    mentorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "Student Competitive Programmer • Gold Scholar",
    creatorRole: "STUDENT",
    creatorXp: 340,
    badgeName: "Gold Practitioner",
    badgeIcon: "🥇",
    skillName: "Data Structures",
    category: "Backend",
    title: "Peer DSA Problem Solving & LeetCode Pattern Practice",
    description: "Study buddy session! Let's work through Binary Trees, Dynamic Programming, and Two-Pointer patterns together. No stress, collaborative peer review.",
    pricingType: "FREE",
    priceAmount: null,
    availability: "Daily 7 PM - 9 PM",
    rating: 5.0,
    reviewCount: 73,
    sessionsCompleted: 210,
    tags: ["Data Structures", "Algorithms", "C++", "Python", "DSA", "Peer Study"],
    isVerifiedPeer: true,
  },
  {
    id: "post-7",
    mentorId: "mentor-devon",
    mentorName: "Devon Vance",
    mentorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "Mobile Engineer • Flutter & iOS",
    creatorRole: "MENTOR",
    badgeName: "Associate Mentor",
    badgeIcon: "👑",
    skillName: "Flutter",
    category: "Mobile",
    title: "Cross-Platform Mobile App Development in Flutter",
    description: "From beginner widgets to BLoC state management, native device APIs, and preparing iOS / Android builds for store submission.",
    pricingType: "PAID",
    priceAmount: "₹399",
    availability: "Fri & Sat Evenings",
    rating: 4.7,
    reviewCount: 21,
    sessionsCompleted: 54,
    tags: ["Flutter", "Dart", "iOS", "Mobile App"],
  },
  {
    id: "post-8",
    mentorId: "mentor-zain",
    mentorName: "Zainab Al-Mansoor",
    mentorAvatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "Cloud Solutions Architect • AWS Certified",
    creatorRole: "MENTOR",
    badgeName: "Senior Mentor",
    badgeIcon: "👑",
    skillName: "Cloud & DevOps",
    category: "DevOps & Cloud",
    title: "CI/CD Pipelines, Docker & AWS Cloud Infrastructure",
    description: "Learn how to containerize apps with Docker, write GitHub Actions CI/CD workflows, and provision secure AWS infrastructure (ECS, S3, RDS).",
    pricingType: "PAID",
    priceAmount: "₹599",
    availability: "Weekends 11 AM - 3 PM",
    rating: 4.9,
    reviewCount: 35,
    sessionsCompleted: 88,
    tags: ["AWS", "Docker", "CI/CD", "DevOps", "Kubernetes"],
  },
  {
    id: "post-9",
    mentorId: "mentor-rohan",
    mentorName: "Rohan Verma",
    mentorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "CS Sophomore • Peer Code Practice & Review",
    creatorRole: "STUDENT",
    creatorXp: 140,
    badgeName: "Silver Explorer",
    badgeIcon: "🥈",
    skillName: "Python",
    category: "AI / ML",
    title: "Peer-to-Peer Python OOP & Beginner Scripting Help",
    description: "Let's code together! We can review Python OOP basics, write small automation scripts, and debug coursework assignments with zero pressure.",
    pricingType: "FREE",
    priceAmount: null,
    availability: "Weekdays 5 PM - 8 PM",
    rating: 4.8,
    reviewCount: 16,
    sessionsCompleted: 38,
    tags: ["Python", "OOP", "Beginner", "Peer Learning", "Study Buddy"],
    isVerifiedPeer: true,
  },
];

const CATEGORIES = [
  "All Categories",
  "Frontend",
  "Backend",
  "Mobile",
  "UI/UX Design",
  "AI / ML",
  "DevOps & Cloud",
];

export default function SearchPageView() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "All Categories";
  const initialRole = (searchParams.get("role")?.toUpperCase() as "ALL" | "MENTOR" | "STUDENT") || "ALL";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [pricingFilter, setPricingFilter] = useState<"ALL" | "FREE" | "PAID">("ALL");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "MENTOR" | "STUDENT">(initialRole);
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "sessions">("rating");
  
  const openLoginModal = useLoginModal();
  const { user, refreshUser } = useAuth();

  // Peer-to-peer ad modal state
  const [isPeerModalOpen, setIsPeerModalOpen] = useState(false);
  const [peerSkill, setPeerSkill] = useState("");
  const [peerCategory, setPeerCategory] = useState("Frontend");
  const [peerTitle, setPeerTitle] = useState("");
  const [peerDescription, setPeerDescription] = useState("");
  const [peerAvailability, setPeerAvailability] = useState("Weekdays 6 PM - 9 PM");
  const [isSubmittingPeerAd, setIsSubmittingPeerAd] = useState(false);
  const [peerAdError, setPeerAdError] = useState<string | null>(null);
  const [peerAdSuccess, setPeerAdSuccess] = useState<{ message: string; xp: number; badgeName: string } | null>(null);

  const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
  if (prevInitialQuery !== initialQuery) {
    setPrevInitialQuery(initialQuery);
    setQuery(initialQuery);
  }

  // Live posts fetched from PostgreSQL database
  const [dbPosts, setDbPosts] = useState<MentorPost[]>([]);

  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        if (res.ok && !ignore) {
          const data = await res.json();
          if (Array.isArray(data.posts)) {
            type ApiPost = {
              id: string;
              userId: string;
              skillName: string;
              category: string;
              title: string;
              description: string;
              pricingType: "FREE" | "PAID";
              priceAmount: number | null;
              availability: string | null;
              user?: {
                id: string;
                name: string;
                email: string;
                image: string | null;
                role: string;
                xp: number;
                profile?: {
                  headline: string | null;
                  mentorLevel: string | null;
                  mentorScore: number | null;
                  skills: string[];
                } | null;
                reviewsRecv?: { rating: number }[];
                _count?: { recvBookings: number };
              };
            };

            const mapped: MentorPost[] = data.posts.map((p: ApiPost) => {
              const mentorName = p.user?.name || "Peer Creator";
              const avatar =
                p.user?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=0f172a&color=fff`;

              const isStudent = p.user?.role === "STUDENT";
              const creatorRole: "STUDENT" | "MENTOR" = isStudent ? "STUDENT" : "MENTOR";
              const userXp = p.user?.xp || 0;
              const badge = getBadgeForXp(userXp);

              const headline =
                p.user?.profile?.headline ||
                (isStudent
                  ? `Student Peer Learner • ${badge.name}`
                  : (p.user?.profile?.mentorLevel
                    ? `${p.user.profile.mentorLevel} • Verified Mentor`
                    : "Verified Peer Mentor"));

              const revs = p.user?.reviewsRecv || [];
              const avgRating =
                revs.length > 0
                  ? revs.reduce((acc, r) => acc + r.rating, 0) / revs.length
                  : 5.0;

              return {
                id: p.id,
                mentorId: p.userId,
                mentorName,
                mentorAvatar: avatar,
                mentorHeadline: headline,
                creatorRole,
                creatorXp: userXp,
                badgeName: isStudent ? badge.name : (p.user?.profile?.mentorLevel || "Verified Mentor"),
                badgeIcon: isStudent ? badge.icon : "👑",
                skillName: p.skillName,
                category: p.category,
                title: p.title,
                description: p.description,
                pricingType: isStudent ? "FREE" : p.pricingType,
                priceAmount: isStudent ? null : (p.pricingType === "PAID" && p.priceAmount ? `₹${p.priceAmount}` : null),
                availability: p.availability || "Weekends & Evenings",
                rating: avgRating,
                reviewCount: revs.length || 1,
                sessionsCompleted: (p.user?._count?.recvBookings || 0) + 1,
                tags: [p.skillName, p.category, ...(p.user?.profile?.skills || [])],
                isVerifiedPeer: true,
              };
            });

            if (!ignore) {
              setDbPosts(mapped);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load live database posts:", err);
      }
    }

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, [refreshCount]);

  // Handle student peer ad publication
  const handleCreatePeerAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openLoginModal();
      return;
    }
    if (!peerSkill.trim() || !peerTitle.trim() || !peerDescription.trim() || !peerAvailability.trim()) {
      setPeerAdError("Please fill out all fields before publishing.");
      return;
    }

    try {
      setIsSubmittingPeerAd(true);
      setPeerAdError(null);

      const res = await fetch("/api/mentor/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillName: peerSkill.trim(),
          category: peerCategory,
          title: peerTitle.trim(),
          description: peerDescription.trim(),
          pricingType: "FREE",
          priceAmount: null,
          availability: peerAvailability.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPeerAdError(data.error || "Failed to publish peer ad.");
        return;
      }

      setPeerAdSuccess({
        message: data.message || "Peer skill ad published! You earned +20 XP.",
        xp: data.xpAwarded || 20,
        badgeName: data.badge?.name || "Scholar",
      });

      setPeerSkill("");
      setPeerTitle("");
      setPeerDescription("");

      await refreshUser();
      setRefreshCount((prev) => prev + 1);

      setTimeout(() => {
        setIsPeerModalOpen(false);
        setPeerAdSuccess(null);
      }, 2500);
    } catch {
      setPeerAdError("Network error. Please try again.");
    } finally {
      setIsSubmittingPeerAd(false);
    }
  };

  // Merge live database posts with established peer listings
  const allPosts = useMemo(() => {
    return [...dbPosts, ...MENTOR_POSTS_DATA];
  }, [dbPosts]);

  // Direct substring and role-based filtering
  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return allPosts.filter((post) => {
      // 1. Text Query Match (Skill, Title, Description, Mentor Name, or Tags)
      const matchesQuery =
        !normalizedQuery ||
        post.skillName.toLowerCase().includes(normalizedQuery) ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.description.toLowerCase().includes(normalizedQuery) ||
        post.mentorName.toLowerCase().includes(normalizedQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      // 2. Category Match
      const matchesCategory =
        selectedCategory === "All Categories" || post.category === selectedCategory;

      // 3. Pricing Match
      const matchesPricing =
        pricingFilter === "ALL" || post.pricingType === pricingFilter;

      // 4. Role Match (Mentors vs Student Peers)
      const matchesRole =
        roleFilter === "ALL" || post.creatorRole === roleFilter;

      return matchesQuery && matchesCategory && matchesPricing && matchesRole;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      if (sortBy === "sessions") return b.sessionsCompleted - a.sessionsCompleted;
      return 0;
    });
  }, [allPosts, query, selectedCategory, pricingFilter, roleFilter, sortBy]);

  const handleClearFilters = () => {
    setQuery("");
    setSelectedCategory("All Categories");
    setPricingFilter("ALL");
    setRoleFilter("ALL");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Skill Search & Mentors</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Explore Skills & Mentors
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Browse published 1-on-1 skill sharing sessions from experienced peer mentors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.role === "MENTOR" ? (
              <Link
                href="/mentor/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:scale-[1.02]"
              >
                <span>👑 Manage Mentor Studio</span>
                <span>→</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    openLoginModal();
                  } else {
                    setIsPeerModalOpen(true);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:scale-[1.02]"
              >
                <span>🌱 Post Peer-to-Peer Ad</span>
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black tracking-wide">+20 XP</span>
              </button>
            )}

            <Link
              href="/mentor/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition"
            >
              <span>{user?.role === "MENTOR" ? "Mentor Studio" : "Are you a Mentor? Post an Ad"}</span>
              <span>→</span>
            </Link>

            <div className="text-xs font-semibold text-slate-500">
              <span>{filteredPosts.length} session offers available</span>
            </div>
          </div>
        </div>

        {/* Peer-to-Peer Community Banner */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-200/90 bg-emerald-50/70 p-4 text-emerald-950 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-sm shadow-xs">
              🌱
            </span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-900">
                Peer-to-Peer Skill Sharing & Mentorship
              </p>
              <p className="text-[11px] sm:text-xs text-emerald-700">
                Students can create <strong>100% free peer ads</strong> to collaborate, review code, earn <strong>+20 XP</strong>, and unlock higher scholar badge tiers!
              </p>
            </div>
          </div>
          {user?.role !== "MENTOR" && (
            <button
              type="button"
              onClick={() => {
                if (!user) openLoginModal();
                else setIsPeerModalOpen(true);
              }}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
            >
              + Post Peer Ad (+20 XP)
            </button>
          )}
        </div>

        {/* SEARCH & CONTROLS BAR (MentorCruise / GrowthMentor inspired) */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          {/* Main Input Row */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by skill, topic, or creator name (e.g. React, Python, UI Design, DSA)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Role Filter Pills (Mentors vs Student Peers) */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/70 p-1">
              <button
                type="button"
                onClick={() => setRoleFilter("ALL")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  roleFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Listings
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter("MENTOR")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  roleFilter === "MENTOR"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                👑 Mentors
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter("STUDENT")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  roleFilter === "STUDENT"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🌱 Student Peers
              </button>
            </div>

            {/* Pricing Filter Pills */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/70 p-1">
              <button
                type="button"
                onClick={() => setPricingFilter("ALL")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  pricingFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Price
              </button>
              <button
                type="button"
                onClick={() => setPricingFilter("FREE")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  pricingFilter === "FREE"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Free Only
              </button>
              <button
                type="button"
                onClick={() => setPricingFilter("PAID")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  pricingFilter === "PAID"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Paid
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 whitespace-nowrap">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "reviews" | "sessions")}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="rating">Highest Rated (5.0 ★)</option>
                <option value="reviews">Most Reviews</option>
                <option value="sessions">Most Completed Sessions</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
            <span className="mr-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter summary */}
        {(query || selectedCategory !== "All Categories" || pricingFilter !== "ALL" || roleFilter !== "ALL") && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-blue-50/60 px-4 py-2 text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Filtered by:</span>
              {query && <span className="rounded bg-blue-100 px-2 py-0.5">&quot;{query}&quot;</span>}
              {roleFilter !== "ALL" && (
                <span className="rounded bg-blue-100 px-2 py-0.5 font-bold">
                  {roleFilter === "MENTOR" ? "👑 Mentors Only" : "🌱 Student Peers Only"}
                </span>
              )}
              {selectedCategory !== "All Categories" && (
                <span className="rounded bg-blue-100 px-2 py-0.5">{selectedCategory}</span>
              )}
              {pricingFilter !== "ALL" && (
                <span className="rounded bg-blue-100 px-2 py-0.5">
                  {pricingFilter === "FREE" ? "Free Sessions" : "Paid Sessions"}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="font-bold text-blue-700 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* RESULTS GRID: MENTOR & PEER POST CARDS */}
        <div className="mt-8">
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className={`flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-xs transition-all hover:shadow-xl ${
                    post.creatorRole === "STUDENT"
                      ? "border-emerald-200/90 hover:border-emerald-400 hover:shadow-emerald-100/50"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-slate-100"
                  }`}
                >
                  <div>
                    {/* Role Indication Header Ribbon */}
                    <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                      {post.creatorRole === "STUDENT" ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
                          <span className="text-sm">🌱</span>
                          <span>Student Peer Ad</span>
                          <span className="text-emerald-300">•</span>
                          <span className="font-semibold text-emerald-700">{post.badgeIcon || "🎓"} {post.badgeName || "Scholar"}</span>
                          <span className="rounded-full bg-emerald-200/70 px-1.5 py-0.5 text-[10px] font-black text-emerald-950">+20 XP Exchange</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 shadow-2xs">
                          <span className="text-sm">👑</span>
                          <span>Industry Mentor</span>
                          <span className="text-blue-300">•</span>
                          <span className="font-semibold text-blue-700">{post.badgeName || "Verified Pro"}</span>
                        </div>
                      )}

                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {post.creatorRole === "STUDENT" ? "Peer-to-Peer" : "1-on-1 Mentorship"}
                      </span>
                    </div>

                    {/* Creator Header: Photo, Name, Headline & Verified Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-slate-200">
                          <img
                            src={post.mentorAvatar}
                            alt={post.mentorName}
                            className="size-full object-cover"
                          />
                          <span
                            className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${
                              post.creatorRole === "STUDENT" ? "bg-emerald-500" : "bg-blue-600"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-slate-900">{post.mentorName}</h3>
                            {post.creatorRole === "STUDENT" ? (
                              <span className="text-xs" title="Student Peer Learner">🎓</span>
                            ) : (
                              <svg className="size-3.5 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-label="Verified Mentor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-500">{post.mentorHeadline}</p>
                        </div>
                      </div>

                      {/* Rating & Sessions Stats */}
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-xs font-bold text-amber-500">
                          <span>★ {post.rating.toFixed(1)}</span>
                          <span className="text-slate-400 font-normal">({post.reviewCount})</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {post.sessionsCompleted} {post.creatorRole === "STUDENT" ? "peer sessions" : "sessions"}
                        </p>
                      </div>
                    </div>

                    {/* Skill Badge & Session Title */}
                    <div className="mt-5">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ${
                          post.creatorRole === "STUDENT"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        <span>Skill:</span>
                        <span className="underline">{post.skillName}</span>
                      </div>
                      <h4 className="mt-2 text-base font-bold text-slate-900 leading-snug">
                        {post.title}
                      </h4>
                    </div>

                    {/* Session Description */}
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600 line-clamp-3">
                      {post.description}
                    </p>

                    {/* Topic Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Strip: Pricing, Availability & Actions */}
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {post.creatorRole === "STUDENT" ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                            <span>🎁 Free Peer Session (Earns XP & Badges)</span>
                          </span>
                        ) : (
                          <span
                            className={`inline-block rounded-md px-2.5 py-1 text-xs font-bold ${
                              post.pricingType === "FREE"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {post.pricingType === "FREE"
                              ? "Free 1:1 Session (30m)"
                              : `${post.priceAmount} / session (45m)`}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <svg className="size-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{post.availability}</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <Link
                        href={`/mentor/${post.mentorId}`}
                        className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 transition hover:bg-slate-50"
                      >
                        View Profile
                      </Link>
                      {user && (post.mentorId === user.id || post.mentorName === user.name) ? (
                        <Link
                          href="/mentor/dashboard"
                          className="flex h-10 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white transition hover:bg-blue-700"
                        >
                          Manage Ad ⚙
                        </Link>
                      ) : user?.role === "MENTOR" ? (
                        <Link
                          href={`/messages`}
                          className="flex h-10 items-center justify-center rounded-xl bg-indigo-600 text-xs font-semibold text-white transition hover:bg-indigo-700"
                        >
                          Peer Message 💬
                        </Link>
                      ) : post.creatorRole === "STUDENT" ? (
                        <Link
                          href={`/mentor/${post.mentorId}#booking-widget`}
                          className="flex h-10 items-center justify-center rounded-xl bg-emerald-600 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-xs"
                        >
                          Connect with Peer →
                        </Link>
                      ) : (
                        <Link
                          href={`/mentor/${post.mentorId}#booking-widget`}
                          className="flex h-10 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white transition hover:bg-blue-600"
                        >
                          Book Mentor Session →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE WITH POPULAR SKILL SUGGESTIONS */
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">No session posts found</h3>
              <p className="mx-auto mt-2 max-w-md text-xs text-slate-500">
                We couldn&apos;t find any skill posts matching &quot;{query}&quot;. Try exploring other popular skills or clear your filters.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Try searching:</span>
                {["React", "Python", "UI/UX Design", "Data Structures", "Next.js", "PostgreSQL"].map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      setQuery(skill);
                      setSelectedCategory("All Categories");
                    }}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* POST PEER-TO-PEER AD MODAL (FOR STUDENTS) */}
        {isPeerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
            <div className="relative w-full max-w-lg rounded-3xl border border-emerald-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  setIsPeerModalOpen(false);
                  setPeerAdError(null);
                  setPeerAdSuccess(null);
                }}
                className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>

              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-800">
                  🌱
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Post Peer-to-Peer Ad</h3>
                  <p className="text-xs text-slate-500">
                    Share your knowledge with fellow students & earn <strong>+20 XP</strong>!
                  </p>
                </div>
              </div>

              {/* Scholar Badge Notice */}
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-900">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Your Status:</span>
                  <span className="rounded-full bg-emerald-200/80 px-2 py-0.5 font-bold text-emerald-900">
                    {getBadgeForXp(user?.xp || 0).icon} {getBadgeForXp(user?.xp || 0).name} ({user?.xp || 0} XP)
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-800">
                  🎁 Peer-to-peer ads are 100% free community sessions. You cannot charge monetary fees, but every ad published boosts your reputation, earns <strong>+20 XP</strong>, and helps unlock higher scholar badges!
                </p>
              </div>

              {peerAdSuccess && (
                <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-100 p-3 text-xs font-bold text-emerald-900">
                  ✓ {peerAdSuccess.message}
                </div>
              )}

              {peerAdError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-800">
                  ⚠ {peerAdError}
                </div>
              )}

              <form onSubmit={handleCreatePeerAd} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Skill / Topic to Share *</label>
                  <input
                    type="text"
                    required
                    value={peerSkill}
                    onChange={(e) => setPeerSkill(e.target.value)}
                    placeholder="e.g. React Hooks, Python DSA, Figma Basics, CSS Grid"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {["React", "Python", "Data Structures", "Next.js", "Figma", "Tailwind"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPeerSkill(s)}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-200"
                      >
                        +{s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Category *</label>
                  <select
                    value={peerCategory}
                    onChange={(e) => setPeerCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Ad Title *</label>
                  <input
                    type="text"
                    required
                    value={peerTitle}
                    onChange={(e) => setPeerTitle(e.target.value)}
                    placeholder="e.g. Peer Coding: Let's practice React Hooks & build a project"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Session Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={peerDescription}
                    onChange={(e) => setPeerDescription(e.target.value)}
                    placeholder="What will you help your peer learn, debug, or practice? Describe your approach..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Your Availability *</label>
                  <input
                    type="text"
                    required
                    value={peerAvailability}
                    onChange={(e) => setPeerAvailability(e.target.value)}
                    placeholder="e.g. Weekdays 6 PM - 9 PM IST, Weekends anytime"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                {/* Locked Pricing Notice */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Pricing Model:</span>
                    <span className="text-emerald-700 font-extrabold">100% Free Peer Exchange</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    No money involved. You receive <strong>+20 XP</strong> immediately upon publishing!
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPeerModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPeerAd}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-xs transition hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isSubmittingPeerAd ? "Publishing..." : "Publish Peer Ad (+20 XP) 🚀"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

