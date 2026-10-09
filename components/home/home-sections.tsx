"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { TangleFooter } from "@/components/ui/tangle-footer";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mobile "View More" toggle states
  const [showAllMentorsMobile, setShowAllMentorsMobile] = useState(false);
  const [showAllProjectsMobile, setShowAllProjectsMobile] = useState(false);

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
                Find Mentor
              </button>
            </form>

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
              <p className="text-lg sm:text-2xl font-bold text-slate-900">4.9 ★</p>
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
                className={`rounded-lg px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all ${
                  selectedCategory === cat
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
              className={`group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-lg ${
                index >= 2 && !showAllMentorsMobile ? "hidden sm:flex" : "flex"
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
                      <span>★ {mentor.rating}</span>
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
                    className={`font-semibold rounded px-1.5 sm:px-2 py-0.5 ${
                      mentor.priceType === "FREE"
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
            onClick={openLoginModal}
            className="inline-flex h-9 sm:h-10 items-center justify-center rounded-lg sm:rounded-xl bg-slate-900 px-3.5 sm:px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            + Post Project Idea
          </button>
        </div>

        {/* Project Cards (Mobile View More Support) */}
        <div className="mt-6 sm:mt-10 grid gap-4 sm:gap-6 md:grid-cols-3">
          {COMMUNITY_PROJECTS.map((proj, index) => (
            <div
              key={proj.id}
              className={`flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs transition-all hover:border-slate-300 ${
                index >= 2 && !showAllProjectsMobile ? "hidden md:flex" : "flex"
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
                    openLoginModal();
                  }}
                  className="w-full rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 py-2 sm:py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-white"
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

      {/* 5. SKILL VERIFICATION & CAREER ROADMAP */}
      <section id="ai-tools" className="border-t border-slate-200/90 bg-[#f8fafc] px-4 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs mb-3">
              <span className="size-1.5 rounded-full bg-blue-600" />
              <span>Skill Verification & Career Pathways</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Benchmark Your Skills. Accelerate Your Career.
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              Validate technical depth through adaptive diagnostic assessments or generate milestone-driven progression roadmaps tailored to your career goals.
            </p>
          </div>

          <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Tool 1: AI Skill Assessment */}
            <div className="group flex flex-col justify-between rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_20px_48px_rgba(37,99,235,0.12)] hover:border-blue-300">
              <div>
                {/* Top Row: AI Icon + Feature Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105">
                    <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
                    <span className="inline-block size-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Adaptive Evaluation • +10 XP
                  </span>
                </div>

                {/* Metadata & Title */}
                <div className="mt-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] sm:text-sm font-bold text-blue-600">
                      Technical Competency Quiz
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      • 5 Adaptive Questions
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-lg sm:text-[22px] font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    Skill Assessment & Verification
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-slate-600">
                    Assess your engineering depth across <strong>Simple</strong>, <strong>Medium</strong>, and <strong>Hard</strong> tiers. Score 60%+ to earn an official verified badge visible to peers and mentors.
                  </p>

                  {/* Pill Tags */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-xl bg-blue-50/90 border border-blue-200/70 px-3 py-1.5 text-xs font-semibold text-blue-800">
                      3 Difficulty Tiers
                    </span>
                    <span className="rounded-xl bg-slate-100/90 px-3 py-1.5 text-xs font-medium text-slate-700">
                      Objective Scoring
                    </span>
                    <span className="rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                      Verified Skill Badge
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="mt-6">
                <div className="border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base sm:text-[17px] font-black text-slate-900">
                        5 Mins Quiz
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Instant Verification & XP
                      </div>
                    </div>

                    <Link
                      href="/assessment"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-blue-600 px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md"
                    >
                      <span>Start Assessment</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tool 2: AI Career Guidance */}
            <div className="group flex flex-col justify-between rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_20px_48px_rgba(99,102,241,0.12)] hover:border-indigo-300">
              <div>
                {/* Top Row: Compass Icon + Feature Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
                    <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25l-2.25 6.75-6.75 2.25 2.25-6.75 6.75-2.25z" />
                    </svg>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 px-3.5 py-1 text-xs font-bold text-indigo-700 shadow-2xs">
                    <span className="inline-block size-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Career Trajectory • +5 XP
                  </span>
                </div>

                {/* Metadata & Title */}
                <div className="mt-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] sm:text-sm font-bold text-indigo-600">
                      Career Pathway
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      • 5 Milestone Stages
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-lg sm:text-[22px] font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Career Pathway & Growth Roadmap
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-slate-600">
                    Calibrated directly from your quiz score. Identifies high-impact skill gaps, generates custom milestone stages, and connects you with verified mentors.
                  </p>

                  {/* Pill Tags */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-xl bg-indigo-50/90 border border-indigo-200/70 px-3 py-1.5 text-xs font-semibold text-indigo-800">
                      Skill Gap Diagnostics
                    </span>
                    <span className="rounded-xl bg-slate-100/90 px-3 py-1.5 text-xs font-medium text-slate-700">
                      Structured Waypoints
                    </span>
                    <span className="rounded-xl bg-purple-50 border border-purple-200/80 px-3 py-1.5 text-xs font-semibold text-purple-800">
                      Mentor Pairing
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="mt-6">
                <div className="border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base sm:text-[17px] font-black text-slate-900">
                        Active Roadmap
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Calibrated from Quiz Score
                      </div>
                    </div>

                    <Link
                      href="/roadmap"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-indigo-600 px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md"
                    >
                      <span>Explore Roadmap</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                      <span key={i} className="text-xs sm:text-sm">★</span>
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
            <button
              type="button"
              onClick={openLoginModal}
              className="w-full sm:w-auto h-11 sm:h-12 rounded-xl bg-white px-6 sm:px-7 text-xs sm:text-sm font-bold text-slate-950 transition hover:bg-slate-100 active:scale-95"
            >
              Get Started for Free →
            </button>
            <button
              type="button"
              onClick={openLoginModal}
              className="w-full sm:w-auto h-11 sm:h-12 rounded-xl border border-slate-700 px-6 sm:px-7 text-xs sm:text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white active:scale-95"
            >
              Become a Mentor
            </button>
          </div>
        </div>
      </section>
    </>
  );
}