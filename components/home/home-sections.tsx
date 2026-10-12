"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { useAuth } from "@/components/auth/auth-context";
import OrganicSphereLoader from "@/components/home/organic-sphere-loader";
import { TangleFooter } from "@/components/ui/tangle-footer";
import { Shield, Star, ArrowRight, Target, Compass, Check, Sparkles } from "@/components/ui/icons";
import { DarkGradientBg } from "@/components/ui/elegant-dark-pattern";


// Sample Curated Data for the UI Sections
const TRENDING_SKILLS = [
  "React",
  "Python",
  "System Design",
  "UI/UX Design",
  "Next.js",
  "Data Structures",
  "Machine Learning",
  "Cloud & DevOps",
];

const FEATURED_MENTORS = [
  {
    id: "mentor-1",
    name: "Aarav Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    headline: "Senior Frontend Engineer • Ex-Amazon",
    skills: ["React", "TypeScript", "Next.js", "Performance"],
    rating: 4.9,
    reviewCount: 52,
    sessionsCompleted: 140,
    priceType: "FREE",
    priceAmount: null,
    availability: "Available Weekends",
    bio: "Passionate about helping junior devs master React patterns, state management, and modern frontend architecture.",
  },
  {
    id: "mentor-2",
    name: "Dr. Maya Patel",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    headline: "AI Researcher & Data Scientist",
    skills: ["Python", "Machine Learning", "PyTorch", "NLP"],
    rating: 5.0,
    reviewCount: 38,
    sessionsCompleted: 95,
    priceType: "PAID",
    priceAmount: "₹499",
    availability: "Mon, Wed & Sat",
    bio: "Guiding learners through applied deep learning, LLMs, and real-world ML deployment pipelines.",
  },
  {
    id: "mentor-3",
    name: "Noah Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    headline: "Product Designer & Design Systems Lead",
    skills: ["UI/UX Design", "Figma", "Design Systems", "User Research"],
    rating: 4.8,
    reviewCount: 44,
    sessionsCompleted: 110,
    priceType: "FREE",
    priceAmount: null,
    availability: "Available Tomorrow",
    bio: "Helping designers transition from beginner wireframes to production-grade design systems and portfolios.",
  },
  {
    id: "mentor-4",
    name: "Priya Sundaram",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",
    headline: "Backend Architect • Distributed Systems",
    skills: ["Go", "PostgreSQL", "System Design", "Docker"],
    rating: 4.9,
    reviewCount: 61,
    sessionsCompleted: 175,
    priceType: "PAID",
    priceAmount: "₹699",
    availability: "Tue & Thu Evenings",
    bio: "Specializing in microservices, database optimizations, concurrency models, and backend interview prep.",
  },
];

const COMMUNITY_PROJECTS = [
  {
    id: "proj-1",
    title: "SkillVerse Mobile App (React Native)",
    lead: "Rohan Kumar",
    leadRole: "Team Head",
    skills: ["React Native", "Expo", "TypeScript", "Tailwind"],
    description: "Building an open-source cross-platform mobile app for real-time peer session reminders and chat.",
    membersJoined: 3,
    totalSlots: 5,
    tag: "Open Source",
  },
  {
    id: "proj-2",
    title: "AI Knowledge Base & RAG Engine",
    lead: "Ananya Roy",
    leadRole: "Team Head",
    skills: ["Python", "FastAPI", "LangChain", "Vector DB"],
    description: "Collaborative research project creating an interactive semantic document search tool for college curricula.",
    membersJoined: 2,
    totalSlots: 4,
    tag: "AI Research",
  },
  {
    id: "proj-3",
    title: "Clean Design System UI Kit",
    lead: "Sarah Jenkins",
    leadRole: "Team Head",
    skills: ["Figma", "Design Tokens", "Accessibility", "Storybook"],
    description: "Crafting a scalable, accessible component library and token system for student developer projects.",
    membersJoined: 1,
    totalSlots: 3,
    tag: "Design",
  },
];

const RECENT_REVIEWS = [
  {
    id: "rev-1",
    author: "Kavya Menon",
    role: "Computer Science Student",
    mentor: "Aarav Sharma",
    session: "React State Management 1:1",
    rating: 5,
    comment:
      "Aarav broke down complex React rendering cycles and Redux vs Zustand in 30 minutes. I walked away with a clear roadmap for my semester capstone.",
    date: "2 days ago",
  },
  {
    id: "rev-2",
    author: "Rahul V.",
    role: "Aspiring Backend Dev",
    mentor: "Priya Sundaram",
    session: "PostgreSQL Query Optimization",
    rating: 5,
    comment:
      "The code review session was incredible. Priya identified N+1 query bottlenecks in my API that I had spent three days troubleshooting.",
    date: "3 days ago",
  },
  {
    id: "rev-3",
    author: "Aditi Nair",
    role: "Self-taught Designer",
    mentor: "Noah Chen",
    session: "Portfolio & Case Study Review",
    rating: 5,
    comment:
      "Noah gave super direct, actionable feedback on my typography hierarchy and layout spacing. Best 45 minutes spent this week.",
    date: "5 days ago",
  },
];

export default function HomeSections() {
  const router = useRouter();
  const openLoginModal = useLoginModal();
  const { user, isLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mobile "View More" toggle states
  const [showAllMentorsMobile, setShowAllMentorsMobile] = useState(false);
  const [showAllProjectsMobile, setShowAllProjectsMobile] = useState(false);

  // When admin is logged in, redirect them directly to the admin command center so they don't see the consumer home dashboard
  useEffect(() => {
    if (!isLoading && user?.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [user, isLoading, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const handleSkillClick = (skill: string) => {
    router.push(`/search?q=${encodeURIComponent(skill)}`);
  };

  if (!isLoading && user?.role === "ADMIN") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50/50 px-4 py-20 text-center font-sans">
        <div className="size-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 ring-4 ring-purple-100 shadow-xs">
          <Shield className="size-7 text-purple-600" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Admin Session Active</h2>
        <p className="mt-2 text-xs text-slate-500 max-w-sm">
          Redirecting to the SkillVerse Admin Command Center to manage users and platform moderation...
        </p>
        <Link
          href="/admin"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition"
        >
          <span>Open Admin Command Center</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* 1. HERO SECTION: Direct Search & Value Proposition */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/60 to-white px-4 pt-12 pb-14 sm:px-8 sm:pt-20 sm:pb-20 lg:pt-24">
        {/* Subtle studio background ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.07),rgba(255,255,255,0))] select-none"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-60"
        />

        {/* Decorative Background Organic Kinetic Orbit (Optimized for mobile) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[2%] sm:right-[12%] lg:right-[18%] xl:right-[22%] top-1/2 -translate-y-1/2 z-0 opacity-15 sm:opacity-45 lg:opacity-55 scale-60 sm:scale-95 lg:scale-110 select-none"
        >
          <OrganicSphereLoader />
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Hero Social Proof Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-sm">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Over 1,200 Verified Peer Mentorship Sessions</span>
          </div>
          {/* Hero Headline */}
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl sm:leading-tight lg:leading-[1.12]">
            Master Any Skill with Peers & Mentors{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Who&apos;ve Walked the Path
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-base sm:leading-relaxed">
            Direct 1-on-1 mentorship sessions, hands-on community projects, and AI-powered skill verification. Built for practical growth.
          </p>

          {/* PRIMARY SKILL SEARCH BAR */}
          <div className="mx-auto mt-6 sm:mt-10 max-w-2xl">
            <form
              onSubmit={handleSearchSubmit}
              className="group relative flex items-center rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-1.5 sm:p-2 shadow-lg sm:shadow-xl shadow-slate-200/50 transition-all focus-within:border-blue-500 focus-within:ring-2 sm:focus-within:ring-4 focus-within:ring-blue-100"
            >
              <div className="flex items-center pl-2.5 sm:pl-3 text-slate-400">
                <svg className="size-4 sm:size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What skill do you want to learn? (React, Python, DSA...)"
                className="w-full border-0 bg-transparent px-2.5 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />

              <button
                type="submit"
                className="inline-flex h-9 sm:h-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-slate-900 px-3.5 sm:px-6 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-slate-800"
              >
                {user?.role === "MENTOR" ? "Search Catalog" : "Find Mentor"}
              </button>
            </form>

            {/* Mentor Studio shortcut for logged in Mentors */}
            {user?.role === "MENTOR" && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-2 text-xs font-semibold text-blue-800 shadow-2xs">
                <span>Welcome, Mentor {user.name.split(" ")[0]}!</span>
                <Link
                  href="/mentor/dashboard"
                  className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  Open Mentor Studio →
                </Link>
              </div>
            )}

            {/* Trending Skill Pills */}
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
              <span className="font-semibold text-slate-500 hidden xs:inline">Popular:</span>
              {TRENDING_SKILLS.slice(0, 6).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillClick(skill)}
                  className="rounded-md sm:rounded-lg border border-slate-200 bg-white/90 px-2.5 py-0.5 sm:px-3 sm:py-1 font-medium text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 active:scale-95"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Social Proof / Stats Strip (Hidden on mobile) */}
          <div className="mx-auto mt-8 sm:mt-12 hidden sm:grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 border-t border-slate-200/80 pt-6 sm:pt-8 sm:grid-cols-4">
            <div className="text-center rounded-lg bg-white/50 p-2 sm:bg-transparent sm:p-0">
              <p className="text-lg sm:text-2xl font-bold text-slate-900">500+</p>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500">Active Mentors</p>
            </div>
            <div className="text-center rounded-lg bg-white/50 p-2 sm:bg-transparent sm:p-0">
              <p className="text-lg sm:text-2xl font-bold text-slate-900">1,200+</p>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500">Sessions Completed</p>
            </div>
            <div className="text-center rounded-lg bg-white/50 p-2 sm:bg-transparent sm:p-0">
              <p className="text-lg sm:text-2xl font-bold text-slate-900">4.9 / 5.0</p>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500">Verified Rating</p>
            </div>
            <div className="text-center rounded-lg bg-white/50 p-2 sm:bg-transparent sm:p-0">
              <p className="text-lg sm:text-2xl font-bold text-slate-900">100%</p>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500">Peer Direct Exchange</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MENTOR DISCOVERY SECTION */}
      <section id="mentors" className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Meet Mentors Ready to Help
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600">
              Connect 1-on-1 for personalized guidance, code reviews, and career direction.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {["All", "Engineering", "Design", "Data Science"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all ${selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mentor Cards Grid (Mobile View More Support: exactly 2 on mobile) */}
        <div className="mt-6 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_MENTORS.map((mentor, index) => (
            <div
              key={mentor.id}
              className={`group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-lg ${index >= 2 && !showAllMentorsMobile ? "hidden sm:flex" : "flex"
                }`}
            >
              <div>
                {/* Header: Avatar, Name, Verified Rating */}
                <div className="flex items-center gap-3">
                  <div className="relative size-11 sm:size-14 shrink-0 overflow-hidden rounded-full border-2 border-slate-100">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                    <span className="absolute bottom-0 right-0 size-2.5 sm:size-3 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{mentor.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-500 font-semibold">
                      <Star className="size-3.5 fill-amber-400 text-amber-400 inline" />
                      <span>{mentor.rating}</span>
                      <span className="text-slate-400 font-normal">({mentor.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <p className="mt-2.5 sm:mt-3.5 text-[11px] sm:text-xs font-medium text-slate-600 line-clamp-2 leading-relaxed">
                  {mentor.headline}
                </p>

                {/* Bio snippet */}
                <p className="mt-1.5 text-[11px] sm:text-xs text-slate-500 line-clamp-2">
                  {mentor.bio}
                </p>

                {/* Skill Tags */}
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-1">
                  {mentor.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Pricing & Book CTA */}
              <div className="mt-4 sm:mt-6 border-t border-slate-100 pt-3 sm:pt-4">
                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                  <span
                    className={`font-semibold rounded px-1.5 sm:px-2 py-0.5 ${mentor.priceType === "FREE"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-blue-50 text-blue-700"
                      }`}
                  >
                    {mentor.priceType === "FREE" ? "Free 1:1 Session" : `${mentor.priceAmount} / session`}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400">{mentor.availability}</span>
                </div>

                <Link
                  href={`/mentor/${mentor.id}`}
                  className="mt-2.5 sm:mt-3 flex w-full items-center justify-center rounded-lg sm:rounded-xl bg-slate-900 py-2 sm:py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-600 active:scale-95"
                >
                  Book Session →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Minimal "View More" Indicator */}
        <div className="mt-4 sm:hidden flex justify-center">
          <button
            type="button"
            onClick={() => setShowAllMentorsMobile(!showAllMentorsMobile)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
          >
            <span>{showAllMentorsMobile ? "Show less" : "View more mentors (+2)"}</span>
            <svg
              className={`size-3 text-slate-500 transition-transform duration-200 ${showAllMentorsMobile ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* 3. SESSION FORMATS SPOTLIGHT */}
      <section id="sessions" className="border-y border-slate-200/80 bg-slate-50/60 px-4 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Flexible Ways to Connect & Learn
            </h2>
            <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm text-slate-600">
              Whether you need a quick 15-minute doubt clearance or a structured multi-week project roadmap.
            </p>
          </div>

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 md:grid-cols-3">
            {/* Format 1 */}
            <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 text-blue-600">
                <svg className="size-5 sm:size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold text-slate-900">1:1 Mentorship Call</h3>
              <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-slate-600">
                Direct live video conversation. Get unstuck on coding problems, architecture decisions, or career strategy.
              </p>
              <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs font-semibold text-blue-600">
                <span>Free & Paid options</span>
                <span>•</span>
                <span>30-45 mins</span>
              </div>
            </div>

            {/* Format 2 */}
            <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600">
                <svg className="size-5 sm:size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold text-slate-900">Code & PR Review</h3>
              <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-slate-600">
                Submit your repository or Pull Request for thorough inspection on architecture, best practices, and performance.
              </p>
              <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <span>Async & Live</span>
                <span>•</span>
                <span>Detailed Notes</span>
              </div>
            </div>

            {/* Format 3 */}
            <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
              <div className="flex size-10 sm:size-12 items-center justify-center rounded-lg sm:rounded-xl bg-purple-50 text-purple-600">
                <svg className="size-5 sm:size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold text-slate-900">Portfolio & Resume Audit</h3>
              <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-slate-600">
                Constructive feedback on your GitHub, resume, and UI case studies to stand out in technical interviews.
              </p>
              <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs font-semibold text-purple-600">
                <span>Actionable feedback</span>
                <span>•</span>
                <span>Interview Prep</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMMUNITY PROJECT COLLABORATION */}
      <section id="community" className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Build Real Projects with Peers
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600">
              Join active collaboration teams, contribute your skills, and build portfolio-worthy software together.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (user) {
                router.push("/community");
              } else {
                openLoginModal();
              }
            }}
            className="inline-flex h-9 sm:h-10 items-center justify-center rounded-lg sm:rounded-xl bg-slate-900 px-3.5 sm:px-4 text-xs font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
          >
            + Post Project Idea
          </button>
        </div>

        {/* Project Cards (Mobile View More Support) */}
        <div className="mt-6 sm:mt-10 grid gap-4 sm:gap-6 md:grid-cols-3">
          {COMMUNITY_PROJECTS.map((proj, index) => (
            <div
              key={proj.id}
              className={`flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs transition-all hover:border-slate-300 ${index >= 2 && !showAllProjectsMobile ? "hidden md:flex" : "flex"
                }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-700">
                    {proj.tag}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-500">
                    {proj.membersJoined}/{proj.totalSlots} Members
                  </span>
                </div>

                <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-bold text-slate-900">{proj.title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2 sm:line-clamp-3">
                  {proj.description}
                </p>

                {/* Team Lead */}
                <div className="mt-3 sm:mt-4 flex items-center gap-2 border-y border-slate-100 py-2 sm:py-2.5">
                  <div className="flex size-5 sm:size-6 items-center justify-center rounded-full bg-blue-600 text-[9px] sm:text-[10px] font-bold text-white">
                    {proj.lead[0]}
                  </div>
                  <div className="text-[11px] sm:text-xs">
                    <span className="font-semibold text-slate-800">{proj.lead}</span>
                    <span className="ml-1 text-slate-400">({proj.leadRole})</span>
                  </div>
                </div>

                {/* Skills Needed */}
                <div className="mt-2.5 sm:mt-3">
                  <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Looking for:</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {proj.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-indigo-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (user) {
                      router.push("/community");
                    } else {
                      openLoginModal();
                    }
                  }}
                  className="w-full rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 py-2 sm:py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-white cursor-pointer"
                >
                  Request to Join Team
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View More Toggle */}
        <div className="mt-4 md:hidden text-center">
          <button
            type="button"
            onClick={() => setShowAllProjectsMobile(!showAllProjectsMobile)}
            className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            {showAllProjectsMobile ? "Show Less Projects ↑" : "View More Projects (3) ↓"}
          </button>
        </div>

        <div className="mt-6 sm:mt-10 text-center">
          <Link
            href="/community"
            className="inline-flex h-10 sm:h-11 items-center justify-center gap-1.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white px-4 sm:px-6 text-xs font-bold text-slate-800 shadow-xs transition hover:bg-slate-50"
          >
            Explore All Community Projects →
          </Link>
        </div>
      </section>

      {/* 5. SKILL VERIFICATION & CAREER ROADMAP (BENCHMARK YOUR SKILLS) */}
      <section id="ai-tools" className="scroll-mt-24 sm:scroll-mt-28 border-t border-slate-200/90 bg-[#f8fafc] px-3 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <DarkGradientBg className="rounded-[32px] sm:rounded-[44px] border border-white/10 shadow-2xl">
            <div className="relative z-10 px-5 pt-16 pb-16 sm:px-10 sm:pt-20 sm:pb-20 md:px-16 text-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase mb-5 shadow-sm">
                <Sparkles className="size-3.5 text-cyan-400" />
                <span>AI SKILL TEST & CAREER ROADMAP</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-[1.12]">
                READY TO SCALE YOUR <br className="hidden sm:inline" />
                <span className="inline-block pr-2 italic font-serif sm:font-sans bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-100 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
                  SKILLS
                </span>
              </h2>

              {/* Subtitle - High Visibility */}
              <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed font-normal">
                Take the diagnostic skill test to benchmark your abilities, or generate your custom step-by-step career roadmap.
              </p>

              {/* Two Minimal Pathway Cards */}
              <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto text-left">
                {/* Option 1: AI Skill Assessment Test */}
                <Link
                  href="/assessment"
                  className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <div>
                    {/* Header: Label / Index */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold">
                        01 // Diagnostic Test
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        +10 XP
                      </span>
                    </div>

                    {/* Icon + Title */}
                    <div className="mt-5 flex items-center gap-3.5">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors group-hover:border-white/40 group-hover:bg-white/20">
                        <Target className="size-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                          AI Skill Assessment Test
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 font-medium">
                          5-Minute Adaptive Benchmark Test
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      Evaluate your real engineering abilities with 5 dynamic, adaptive test questions calibrated to industry expectations.
                    </p>

                    {/* Feature List */}
                    <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-slate-200">
                      <li className="flex items-center gap-2.5">
                        <Check className="size-4 text-emerald-400 shrink-0" />
                        <span>5 Adaptive Diagnostic Questions</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="size-4 text-emerald-400 shrink-0" />
                        <span>Precision Radar & Instant Skill Gap Analysis</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="size-4 text-emerald-400 shrink-0" />
                        <span>Official Verified Skill Badge on Completion</span>
                      </li>
                    </ul>
                  </div>

                  {/* Clean Minimal Button */}
                  <div className="mt-8 pt-5 border-t border-white/15">
                    <div className="flex items-center justify-between rounded-xl bg-white text-slate-950 px-5 py-3.5 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all group-hover:bg-slate-100 shadow-md">
                      <span>Take Skill Test</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>

                {/* Option 2: AI Career Roadmap */}
                <Link
                  href="/roadmap"
                  className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <div>
                    {/* Header: Label / Index */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold">
                        02 // Career Roadmap
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                        +5 XP
                      </span>
                    </div>

                    {/* Icon + Title */}
                    <div className="mt-5 flex items-center gap-3.5">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors group-hover:border-white/40 group-hover:bg-white/20">
                        <Compass className="size-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                          AI Career Roadmap
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 font-medium">
                          Waypoints, Milestones & Mentors
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      Generate an end-to-end, customized roadmap tailored to your target tech role, complete with curated resources and mentor pairing.
                    </p>

                    {/* Feature List */}
                    <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-slate-200">
                      <li className="flex items-center gap-2.5">
                        <Check className="size-4 text-cyan-400 shrink-0" />
                        <span>Step-by-Step Milestone Waypoints</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="size-4 text-cyan-400 shrink-0" />
                        <span>Curated High-Value Resources & Projects</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="size-4 text-cyan-400 shrink-0" />
                        <span>Direct Pairing with Senior Mentors</span>
                      </li>
                    </ul>
                  </div>

                  {/* Clean Minimal Button */}
                  <div className="mt-8 pt-5 border-t border-white/15">
                    <div className="flex items-center justify-between rounded-xl bg-white text-slate-950 px-5 py-3.5 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all group-hover:bg-slate-100 shadow-md">
                      <span>Generate Roadmap</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Minimal Trust & Guarantee indicators below */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-slate-300" />
                  <span>100% Free & Open to All Learners</span>
                </div>
                <span className="hidden sm:inline text-slate-600">•</span>
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-amber-400 fill-amber-400" />
                  <span>Calibrated by Top Tech Mentors</span>
                </div>
                <span className="hidden sm:inline text-slate-600">•</span>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time AI Personalization</span>
                </div>
              </div>
            </div>
          </DarkGradientBg>
        </div>
      </section>

      {/* 6. GENUINE REVIEWS & TRUST */}
      <section className="relative w-full overflow-hidden py-12 sm:py-20">
        {/* Decorative Background Tangle Text Ribbon at extreme left edge (compact on mobile, visible on all screens) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 sm:-left-36 lg:-left-44 top-[93%] sm:top-[74%] -translate-y-1/2 z-0 opacity-25 sm:opacity-35 lg:opacity-45 select-none rotate-90 origin-center scale-50 sm:scale-95 lg:scale-110 w-[240px] sm:w-[460px] lg:w-[520px]"
        >
          <TangleFooter
            background="transparent"
            ribbon="rgba(15, 23, 42, 0.08)"
            textColor="#0f172a"
            lines={[
              "Master Full-Stack • AI Engineering • System Design • UI/UX Architecture",
              "Direct 1-on-1 Peer Mentorship • Open Source Collaboration • Verified Skills",
              "Build Production Projects • Accelerate Career Paths • SkillVerse Ecosystem",
              "Code Reviews • Mock Interviews • Real-World Portfolios • Learn by Doing",
            ]}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Real Stories from Real Sessions
            </h2>
            <p className="mx-auto mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm text-slate-600">
              Every review is written exclusively by peers following a completed mentorship session.
            </p>
          </div>

          {/* Real Stories: Mobile Swipeable Slides / Desktop Grid */}
          <div className="mt-8 sm:mt-12 flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-3 pt-1 px-4 -mx-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {RECENT_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col justify-between shrink-0 w-[82vw] max-w-[320px] md:w-auto snap-center rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-7 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-400 text-amber-400 inline" />
                    ))}
                  </div>

                  <p className="mt-3 sm:mt-4 text-xs italic leading-relaxed text-slate-700">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 border-t border-slate-100 pt-3 sm:pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{rev.author}</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500">{rev.role}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                  <p className="mt-2 rounded bg-slate-50 px-2 py-1 text-[10px] sm:text-[11px] font-medium text-slate-600">
                    Mentored by <span className="font-semibold text-slate-800">{rev.mentor}</span> • {rev.session}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile swipe indicator dots */}
          <div className="mt-2 flex md:hidden items-center justify-center gap-1.5 text-slate-400">
            <span className="size-1.5 rounded-full bg-blue-600" />
            <span className="size-1.5 rounded-full bg-slate-300" />
            <span className="size-1.5 rounded-full bg-slate-300" />
            <span className="ml-1 text-[10px] font-medium text-slate-400">Swipe stories →</span>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="bg-slate-950 px-4 py-14 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-5xl">
            Ready to Share Your Skills or Learn Something New?
          </h2>
          <p className="mx-auto mt-3 sm:mt-5 max-w-2xl text-xs sm:text-base text-slate-400">
            Join a thriving peer ecosystem of student engineers, product designers, and senior mentors.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {user?.role === "MENTOR" ? (
              <>
                <Link
                  href="/mentor/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center h-11 sm:h-12 rounded-xl bg-blue-600 px-6 sm:px-7 text-xs sm:text-sm font-bold text-white transition hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-950/40"
                >
                  Go to Mentor Studio →
                </Link>
                <Link
                  href="/community"
                  className="w-full sm:w-auto inline-flex items-center justify-center h-11 sm:h-12 rounded-xl border border-slate-700 px-6 sm:px-7 text-xs sm:text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white active:scale-95"
                >
                  Explore Community Projects
                </Link>
              </>
            ) : user?.role === "ADMIN" ? (
              <>
                <Link
                  href="/admin"
                  className="w-full sm:w-auto inline-flex items-center justify-center h-11 sm:h-12 rounded-xl bg-purple-600 px-6 sm:px-7 text-xs sm:text-sm font-bold text-white transition hover:bg-purple-500 active:scale-95 shadow-lg shadow-purple-500/20"
                >
                  Admin Command Center →
                </Link>
              </>
            ) : user ? (
              <>
                <Link
                  href="/search"
                  className="w-full sm:w-auto inline-flex items-center justify-center h-11 sm:h-12 rounded-xl bg-white px-6 sm:px-7 text-xs sm:text-sm font-bold text-slate-950 transition hover:bg-slate-100 active:scale-95"
                >
                  Find a Mentor →
                </Link>
                <Link
                  href="/mentor/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center h-11 sm:h-12 rounded-xl border border-slate-700 px-6 sm:px-7 text-xs sm:text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white active:scale-95"
                >
                  Become a Mentor
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="w-full sm:w-auto h-11 sm:h-12 rounded-xl bg-white px-6 sm:px-7 text-xs sm:text-sm font-bold text-slate-950 transition hover:bg-slate-100 active:scale-95 cursor-pointer"
                >
                  Get Started for Free →
                </button>
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="w-full sm:w-auto h-11 sm:h-12 rounded-xl border border-slate-700 px-6 sm:px-7 text-xs sm:text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white active:scale-95 cursor-pointer"
                >
                  Become a Mentor
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}