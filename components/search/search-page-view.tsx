"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLoginModal } from "@/components/auth/login-modal-provider";

export type MentorPost = {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorHeadline: string;
  skillName: string;
  category: "Frontend" | "Backend" | "Mobile" | "UI/UX Design" | "AI / ML" | "DevOps & Cloud";
  title: string;
  description: string;
  pricingType: "FREE" | "PAID";
  priceAmount: string | null;
  availability: string;
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  tags: string[];
};

export const MENTOR_POSTS_DATA: MentorPost[] = [
  {
    id: "post-1",
    mentorId: "mentor-aarav",
    mentorName: "Aarav Sharma",
    mentorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "Senior Frontend Engineer • Ex-Amazon",
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
    mentorHeadline: "Full-Stack Engineer • Open Source Contributor",
    skillName: "Next.js",
    category: "Frontend",
    title: "Next.js App Router & Server Action Deep Dive",
    description: "Practical mentoring on Server Components, streaming SSR, route handlers, authentication cookies, and deployment best practices on Vercel.",
    pricingType: "FREE",
    priceAmount: null,
    availability: "Weekends All Day",
    rating: 4.9,
    reviewCount: 29,
    sessionsCompleted: 82,
    tags: ["Next.js", "React", "TypeScript", "Tailwind"],
  },
  {
    id: "post-6",
    mentorId: "mentor-anita",
    mentorName: "Anita Joseph",
    mentorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "Competitive Programmer • ICPC Regionalist",
    skillName: "Data Structures",
    category: "Backend",
    title: "Data Structures & Algorithms Problem Solving",
    description: "Master Graphs, Dynamic Programming, and Binary Trees. Learn intuitive pattern recognition techniques for technical coding interviews.",
    pricingType: "FREE",
    priceAmount: null,
    availability: "Daily 7 PM - 9 PM",
    rating: 5.0,
    reviewCount: 73,
    sessionsCompleted: 210,
    tags: ["Data Structures", "Algorithms", "C++", "Python", "DSA"],
  },
  {
    id: "post-7",
    mentorId: "mentor-devon",
    mentorName: "Devon Vance",
    mentorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    mentorHeadline: "Mobile Engineer • Flutter & iOS",
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

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [pricingFilter, setPricingFilter] = useState<"ALL" | "FREE" | "PAID">("ALL");
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "sessions">("rating");
  
  const openLoginModal = useLoginModal();

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  // Simple direct substring filtering (strictly following the rule: Keep matching simple. No mathematical or AI matching.)
  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return MENTOR_POSTS_DATA.filter((post) => {
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

      return matchesQuery && matchesCategory && matchesPricing;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      if (sortBy === "sessions") return b.sessionsCompleted - a.sessionsCompleted;
      return 0;
    });
  }, [query, selectedCategory, pricingFilter, sortBy]);

  const handleClearFilters = () => {
    setQuery("");
    setSelectedCategory("All Categories");
    setPricingFilter("ALL");
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
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Explore Skills & Mentors
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Browse published 1-on-1 skill sharing sessions from experienced peer mentors.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            <span>{filteredPosts.length} session offers available</span>
          </div>
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
                placeholder="Search by skill, topic, or mentor name (e.g. React, Python, UI Design, DSA)..."
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
                All
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
        {(query || selectedCategory !== "All Categories" || pricingFilter !== "ALL") && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-blue-50/60 px-4 py-2 text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Filtered by:</span>
              {query && <span className="rounded bg-blue-100 px-2 py-0.5">&quot;{query}&quot;</span>}
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

        {/* RESULTS GRID: MENTOR POST CARDS (ADPList + GrowthMentor style) */}
        <div className="mt-8">
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100"
                >
                  <div>
                    {/* Mentor Header: Photo, Name, Headline & Verified Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-slate-200">
                          <img
                            src={post.mentorAvatar}
                            alt={post.mentorName}
                            className="size-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">{post.mentorName}</h3>
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                              MENTOR
                            </span>
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
                          {post.sessionsCompleted} sessions
                        </p>
                      </div>
                    </div>

                    {/* Skill Badge & Session Title */}
                    <div className="mt-5">
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
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
                      <Link
                        href={`/mentor/${post.mentorId}#booking-widget`}
                        className="flex h-10 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white transition hover:bg-blue-600"
                      >
                        Book Session →
                      </Link>
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
              <h3 className="mt-4 text-lg font-bold text-slate-900">No mentor posts found</h3>
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
      </div>
    </div>
  );
}
