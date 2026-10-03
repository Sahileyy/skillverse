"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { useAuth } from "@/components/auth/auth-context";
import OrganicSphereLoader from "@/components/home/organic-sphere-loader";

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
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeProjectTab, setActiveProjectTab] = useState<string | null>(null);

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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/60 to-white px-5 pt-16 pb-20 sm:px-8 sm:pt-20 lg:pt-24">
        {/* Subtle grid background pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        />

        {/* Decorative Background Organic Kinetic Orbit (Shifted left for subtle overlap behind text) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[5%] sm:right-[12%] lg:right-[18%] xl:right-[22%] top-1/2 -translate-y-1/2 z-0 opacity-30 sm:opacity-45 lg:opacity-55 scale-80 sm:scale-95 lg:scale-110 select-none"
        >
          <OrganicSphereLoader />
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Top ecosystem badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-800 backdrop-blur-xs">
            <span className="flex size-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Peer-to-Peer Skill Sharing & Mentorship Ecosystem</span>
          </div>

          {/* Hero Headline */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl lg:leading-[1.12]">
            Master Any Skill with Peers & Mentors{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Who&apos;ve Walked the Path
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Direct 1-on-1 mentorship sessions, hands-on community projects, and AI-powered skill verification.
            Built for learners and mentors who value real practical growth.
          </p>

          {/* PRIMARY SKILL SEARCH BAR (MentorCruise + µLearn inspired) */}
          <div className="mx-auto mt-10 max-w-2xl">
            <form
              onSubmit={handleSearchSubmit}
              className="group relative flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
            >
              <div className="flex items-center pl-3 text-slate-400">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What skill do you want to learn? (e.g. React, Python, UI Design, DSA)..."
                className="w-full border-0 bg-transparent px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />

              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition-all hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Find Mentor
              </button>
            </form>

            {/* Trending Skill Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Popular:</span>
              {TRENDING_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillClick(skill)}
                  className="rounded-lg border border-slate-200 bg-white/80 px-3 py-1 font-medium text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Social Proof / Stats Strip */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 border-t border-slate-200/80 pt-8 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">500+</p>
              <p className="text-xs font-medium text-slate-500">Active Mentors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">1,200+</p>
              <p className="text-xs font-medium text-slate-500">Sessions Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">4.9 ★</p>
              <p className="text-xs font-medium text-slate-500">Verified Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-xs font-medium text-slate-500">Peer Direct Exchange</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MENTOR DISCOVERY SECTION (ADPList style cards) */}
      <section id="mentors" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <span>🌟 Top Rated Mentors</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Meet Mentors Ready to Help
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Connect 1-on-1 for personalized guidance, code reviews, and career direction.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {["All", "Engineering", "Design", "Data Science"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
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

        {/* Mentor Cards Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_MENTORS.map((mentor) => (
            <div
              key={mentor.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100"
            >
              <div>
                {/* Header: Avatar, Name, Verified Rating */}
                <div className="flex items-center gap-3.5">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-slate-100">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                    <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{mentor.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold">
                      <span>★ {mentor.rating}</span>
                      <span className="text-slate-400 font-normal">({mentor.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <p className="mt-3.5 text-xs font-medium text-slate-600 line-clamp-2 leading-relaxed">
                  {mentor.headline}
                </p>

                {/* Bio snippet */}
                <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                  {mentor.bio}
                </p>

                {/* Skill Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {mentor.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Pricing & Book CTA */}
              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`font-semibold rounded px-2 py-0.5 ${
                      mentor.priceType === "FREE"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {mentor.priceType === "FREE" ? "Free 1:1 Session" : `${mentor.priceAmount} / session`}
                  </span>
                  <span className="text-[11px] text-slate-400">{mentor.availability}</span>
                </div>

                <Link
                  href={`/mentor/${mentor.id}`}
                  className="mt-3 flex w-full items-center justify-center rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  Book Session →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SESSION FORMATS SPOTLIGHT (Topmate style session options) */}
      <section id="sessions" className="border-y border-slate-200/80 bg-slate-50/60 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Flexible Ways to Connect & Learn
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
              Whether you need a quick 15-minute doubt clearance or a structured multi-week project roadmap.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Format 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">1:1 Mentorship Call</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Direct live video conversation. Get unstuck on coding problems, architecture decisions, or career strategy.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-600">
                <span>Free & Paid options</span>
                <span>•</span>
                <span>30-45 mins</span>
              </div>
            </div>

            {/* Format 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Code & PR Review</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Submit your repository or Pull Request for thorough inspection on architecture, best practices, and performance.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <span>Async & Live</span>
                <span>•</span>
                <span>Detailed Notes</span>
              </div>
            </div>

            {/* Format 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs">
              <div className="flex size-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">Portfolio & Resume Audit</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Constructive feedback on your GitHub, resume, and UI case studies to stand out in technical interviews.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-purple-600">
                <span>Actionable feedback</span>
                <span>•</span>
                <span>Interview Prep</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMMUNITY PROJECT COLLABORATION (Teachfloor style) */}
      <section id="community" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              <span>🚀 Community Projects</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Build Real Projects with Peers
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Join active collaboration teams, contribute your skills, and build portfolio-worthy software together.
            </p>
          </div>

          <button
            type="button"
            onClick={openLoginModal}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            + Post Project Idea
          </button>
        </div>

        {/* Project Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {COMMUNITY_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                    {proj.tag}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {proj.membersJoined}/{proj.totalSlots} Members
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">{proj.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                  {proj.description}
                </p>

                {/* Team Lead */}
                <div className="mt-4 flex items-center gap-2 border-y border-slate-100 py-2.5">
                  <div className="flex size-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {proj.lead[0]}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800">{proj.lead}</span>
                    <span className="ml-1 text-slate-400">({proj.leadRole})</span>
                  </div>
                </div>

                {/* Skills Needed */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Looking for:</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {proj.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProjectTab(proj.id);
                    openLoginModal();
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-white"
                >
                  Request to Join Team
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/community"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-xs font-bold text-slate-800 shadow-xs transition hover:bg-slate-50 hover:border-slate-400"
          >
            Explore All Community Projects & Post an Idea →
          </Link>
        </div>
      </section>

      {/* 5. AI SUITE: Skill Assessment & Career Roadmap (PupilNetwork + roadmap.sh inspired) */}
      <section id="ai-tools" className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-50/80 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              <span>✨ Intelligent Learning Tools</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Supercharge Your Growth with AI
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
              Validate your technical skills with adaptive quizzes or map your personalized career progression path.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Tool 1: AI Skill Assessment (PupilNetwork style) */}
            <div className="flex flex-col justify-between rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50/40 via-white to-white p-8 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                    AI Skill Quiz
                  </span>
                  <span className="text-xs font-medium text-blue-600">5 Adaptive Questions</span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  AI-Verified Skill Assessment
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Take a 5-minute technical evaluation on Python, React, DSA, or System Design. Earn a verified skill badge directly on your SkillVerse profile.
                </p>

                {/* Interactive Assessment Preview Box */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Question 3 of 5</span>
                    <span className="text-emerald-600 font-bold">● Live Evaluation</span>
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-800">
                    &quot;How does the JavaScript event loop handle microtasks vs macrotasks during execution?&quot;
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-2.5 text-[11px] font-medium text-blue-900">
                      A. Microtasks (Promises) run before the next macrotask (setTimeout)
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-[11px] text-slate-600">
                      B. Both queues execute simultaneously using web workers
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/assessment"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                Start Skill Assessment →
              </Link>
            </div>

            {/* Tool 2: AI Career Guidance (roadmap.sh style) */}
            <div className="flex flex-col justify-between rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/40 via-white to-white p-8 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                    Career Roadmap
                  </span>
                  <span className="text-xs font-medium text-indigo-600">Target Role Mapping</span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  AI Career Pathway Generator
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Input your current skills and target position (e.g., Full-Stack Engineer). SkillVerse identifies your gaps and suggests curated mentor sessions.
                </p>

                {/* Visual Roadmap Progression Nodes */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                    <span className="font-semibold text-slate-800">Full-Stack Developer Roadmap</span>
                    <span className="text-xs text-indigo-600 font-bold">4 Milestones</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">✓</span>
                      <div className="text-xs">
                        <span className="font-bold text-slate-800">Current:</span> HTML, CSS, JavaScript Basics
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span>
                      <div className="text-xs">
                        <span className="font-bold text-slate-800">Skill Gap:</span> React Hooks & Next.js App Router
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">3</span>
                      <div className="text-xs text-slate-500">
                        <span className="font-bold">Next:</span> PostgreSQL & Prisma ORM Modeling
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/roadmap"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-xs font-semibold text-white transition hover:bg-indigo-700"
              >
                Generate My Career Roadmap →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GENUINE REVIEWS & TRUST (ADPList style session-linked feedback) */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <span>💬 Verified Feedback</span>
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Real Stories from Real Sessions
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Every review is written exclusively by peers following a completed 1-on-1 mentorship or code review session.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {RECENT_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>

                <p className="mt-4 text-xs italic leading-relaxed text-slate-700">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{rev.author}</p>
                    <p className="text-[11px] text-slate-500">{rev.role}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <p className="mt-2 rounded bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
                  Mentored by <span className="font-semibold text-slate-800">{rev.mentor}</span> • {rev.session}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION (µLearn vibe) */}
      <section className="bg-slate-950 px-5 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Ready to Share Your Skills or Learn Something New?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-slate-400 sm:text-base">
            Join a thriving peer ecosystem of student engineers, product designers, and senior mentors.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={openLoginModal}
              className="h-12 rounded-xl bg-white px-7 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
            >
              Get Started for Free →
            </button>
            <button
              type="button"
              onClick={openLoginModal}
              className="h-12 rounded-xl border border-slate-700 px-7 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Become a Mentor
            </button>
          </div>
        </div>
      </section>
    </>
  );
}