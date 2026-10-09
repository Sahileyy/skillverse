"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { useAuth } from "@/components/auth/auth-context";

export type MentorDetail = {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  company: string;
  location: string;
  timezone: string;
  bio: string[];
  skills: string[];
  mentorLevel?: string;
  mentorScore?: number;
  experience: {
    role: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  stats: {
    rating: number;
    reviewCount: number;
    sessionsCompleted: number;
    responseTime: string;
    attendanceRate: string;
  };
  sessions: {
    id: string;
    title: string;
    description: string;
    duration: string;
    pricingType: "FREE" | "PAID";
    priceAmount: string | null;
    tag: string;
  }[];
  availableSlots: {
    date: string;
    day: string;
    slots: string[];
  }[];
  reviews: {
    id: string;
    author: string;
    authorRole: string;
    authorAvatar?: string;
    sessionTitle: string;
    rating: number;
    date: string;
    comment: string;
  }[];
};

export const MENTOR_PROFILES_DATABASE: Record<string, MentorDetail> = {
  "mentor-aarav": {
    id: "mentor-aarav",
    name: "Aarav Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    headline: "Senior Frontend Engineer • Ex-Amazon & FinTech Lead",
    company: "Stripe",
    location: "Bengaluru, India",
    timezone: "IST (UTC+5:30)",
    mentorLevel: "Senior Mentor",
    mentorScore: 88,
    bio: [
      "Hey! I'm Aarav, a frontend engineer with 6+ years of experience crafting large-scale React and Next.js web applications. I’ve mentored 140+ student developers and early-career software engineers.",
      "My mentorship focuses on cutting through tutorial hell: understanding React reconciliation, mastering modern state architecture (Zustand, React Query), writing clean TypeScript, and preparing for competitive frontend interviews.",
      "Whether you're building your first full-stack side project or debugging a tricky production memory leak, I'm here to guide you step-by-step.",
    ],
    skills: [
      "React",
      "TypeScript",
      "Next.js App Router",
      "Zustand / Redux",
      "Web Performance",
      "Tailwind CSS",
      "System Design (Frontend)",
      "Jest & RTL Testing",
    ],
    experience: [
      {
        role: "Senior Frontend Engineer",
        company: "Stripe",
        period: "2023 - Present",
        description: "Leading frontend infrastructure for merchant onboarding dashboards, reducing bundle size by 35% and improving Core Web Vitals.",
      },
      {
        role: "Frontend Software Engineer II",
        company: "Amazon",
        period: "2020 - 2023",
        description: "Built scalable payment checkout widgets serving millions of daily active users across global marketplaces.",
      },
      {
        role: "Junior Web Developer",
        company: "Innovate Labs",
        period: "2018 - 2020",
        description: "Created responsive single-page apps using React, Redux, and RESTful microservices.",
      },
    ],
    education: [
      {
        degree: "B.Tech in Computer Science & Engineering",
        institution: "National Institute of Technology",
        year: "2014 - 2018",
      },
    ],
    stats: {
      rating: 4.9,
      reviewCount: 52,
      sessionsCompleted: 140,
      responseTime: "< 15 mins",
      attendanceRate: "100%",
    },
    sessions: [
      {
        id: "sess-1",
        title: "1:1 Quick Mentorship & Career Q&A",
        description: "Ask anything about frontend careers, resume strategy, or breaking down your immediate coding roadblocks.",
        duration: "30 mins",
        pricingType: "FREE",
        priceAmount: null,
        tag: "Most Popular",
      },
      {
        id: "sess-2",
        title: "Deep-Dive React & Next.js Code Review",
        description: "Send your GitHub repo or PR. We'll screen share to review component modularity, state flow, hooks, and performance.",
        duration: "45 mins",
        pricingType: "PAID",
        priceAmount: "₹499",
        tag: "Code Audit",
      },
      {
        id: "sess-3",
        title: "Frontend Technical Mock Interview",
        description: "Live coding challenge + JavaScript / React conceptual questions + actionable feedback rubric.",
        duration: "60 mins",
        pricingType: "PAID",
        priceAmount: "₹799",
        tag: "Interview Prep",
      },
    ],
    availableSlots: [
      {
        date: "Tomorrow",
        day: "Sat, Oct 4",
        slots: ["10:00 AM", "11:30 AM", "02:00 PM", "05:00 PM"],
      },
      {
        date: "Sunday",
        day: "Sun, Oct 5",
        slots: ["09:00 AM", "01:30 PM", "04:00 PM", "07:30 PM"],
      },
      {
        date: "Next Week",
        day: "Wed, Oct 8",
        slots: ["06:00 PM", "07:30 PM", "09:00 PM"],
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Kavya Menon",
        authorRole: "CS Student @ Sreepathy",
        sessionTitle: "React State Management 1:1",
        rating: 5,
        date: "2 days ago",
        comment:
          "Aarav broke down complex React rendering cycles and Redux vs Zustand in 30 minutes. I walked away with a clear roadmap for my semester capstone.",
      },
      {
        id: "r2",
        author: "Tanmay Deshmukh",
        authorRole: "Early Career Frontend Dev",
        sessionTitle: "Deep-Dive React & Next.js Code Review",
        rating: 5,
        date: "1 week ago",
        comment:
          "Super valuable session! Aarav showed me how to refactor my custom hooks to eliminate 4 unnecessary re-renders. Will definitely book again.",
      },
      {
        id: "r3",
        author: "Sneha Pillai",
        authorRole: "Self-taught Developer",
        sessionTitle: "Frontend Technical Mock Interview",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "The mock interview was realistic and friendly. The feedback notes Aarav shared right after the call helped me ace my actual startup interview.",
      },
    ],
  },
  "mentor-maya": {
    id: "mentor-maya",
    name: "Dr. Maya Patel",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    headline: "AI Researcher & Applied Data Scientist",
    company: "NeuralGraph Labs",
    location: "Hyderabad, India",
    timezone: "IST (UTC+5:30)",
    mentorLevel: "Master Mentor",
    mentorScore: 94,
    bio: [
      "PhD in Machine Learning with extensive experience in Computer Vision, Natural Language Processing, and LLM fine-tuning.",
      "I help students bridge the gap between academic math and production Python / PyTorch coding.",
    ],
    skills: ["Python", "PyTorch", "NLP", "Computer Vision", "FastAPI", "MLOps", "Transformers"],
    experience: [
      {
        role: "Principal AI Scientist",
        company: "NeuralGraph Labs",
        period: "2021 - Present",
        description: "Leading generative AI applications and retrieval-augmented generation (RAG) models.",
      },
    ],
    education: [
      {
        degree: "Ph.D. in Computer Science (Artificial Intelligence)",
        institution: "IIT Madras",
        year: "2016 - 2021",
      },
    ],
    stats: {
      rating: 5.0,
      reviewCount: 38,
      sessionsCompleted: 95,
      responseTime: "< 30 mins",
      attendanceRate: "100%",
    },
    sessions: [
      {
        id: "sess-m1",
        title: "AI Project Guidance & Architecture Call",
        description: "Review your machine learning model architecture, dataset pipelines, and evaluation metrics.",
        duration: "45 mins",
        pricingType: "PAID",
        priceAmount: "₹499",
        tag: "Research & ML",
      },
      {
        id: "sess-m2",
        title: "Intro to AI / ML Career Pathway",
        description: "Discuss how to transition into Data Science and Machine Learning engineering roles.",
        duration: "30 mins",
        pricingType: "FREE",
        priceAmount: null,
        tag: "Career Guidance",
      },
    ],
    availableSlots: [
      {
        date: "Monday",
        day: "Mon, Oct 6",
        slots: ["06:00 PM", "07:30 PM", "09:00 PM"],
      },
      {
        date: "Wednesday",
        day: "Wed, Oct 8",
        slots: ["05:30 PM", "07:00 PM"],
      },
    ],
    reviews: [
      {
        id: "rm1",
        author: "Devika Shenoy",
        authorRole: "AI Student",
        sessionTitle: "AI Project Guidance Call",
        rating: 5,
        date: "4 days ago",
        comment: "Dr. Maya gave crystal-clear feedback on my RAG embedding pipeline. Incredible depth of knowledge.",
      },
    ],
  },
  "mentor-noah": {
    id: "mentor-noah",
    name: "Noah Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    headline: "Product Designer & Design Systems Lead",
    company: "DesignScale",
    location: "Singapore",
    timezone: "SGT (UTC+8:00)",
    mentorLevel: "Senior Mentor",
    mentorScore: 85,
    bio: [
      "Product designer passionate about accessibility, Figma design systems, and helping young designers build portfolio case studies that convert.",
    ],
    skills: ["UI/UX Design", "Figma", "Design Tokens", "User Research", "Prototyping", "Design Systems"],
    experience: [
      {
        role: "Lead Product Designer",
        company: "DesignScale",
        period: "2021 - Present",
        description: "Architected multi-brand token system used across 12 product lines.",
      },
    ],
    education: [
      {
        degree: "B.A. in Interaction Design",
        institution: "National University of Singapore",
        year: "2015 - 2019",
      },
    ],
    stats: {
      rating: 4.8,
      reviewCount: 44,
      sessionsCompleted: 110,
      responseTime: "< 10 mins",
      attendanceRate: "98%",
    },
    sessions: [
      {
        id: "sess-n1",
        title: "Portfolio & Case Study Review",
        description: "Direct critique of your Behance, Dribbble, or Figma case studies with typography and layout fixes.",
        duration: "30 mins",
        pricingType: "FREE",
        priceAmount: null,
        tag: "Design Review",
      },
      {
        id: "sess-n2",
        title: "Figma Component & Token Architecture",
        description: "Deep dive into auto-layout, component variants, and handoff best practices.",
        duration: "45 mins",
        pricingType: "PAID",
        priceAmount: "₹399",
        tag: "Figma Mastery",
      },
    ],
    availableSlots: [
      {
        date: "Tomorrow",
        day: "Sat, Oct 4",
        slots: ["11:00 AM", "03:00 PM", "06:00 PM"],
      },
    ],
    reviews: [
      {
        id: "rn1",
        author: "Aditi Nair",
        authorRole: "Self-taught Designer",
        sessionTitle: "Portfolio & Case Study Review",
        rating: 5,
        date: "5 days ago",
        comment: "Noah gave super direct, actionable feedback on my typography hierarchy and layout spacing. Best 45 minutes spent this week.",
      },
    ],
  },
};

// Fallback generator for other mentor IDs
function getMentorData(mentorId: string): MentorDetail {
  if (MENTOR_PROFILES_DATABASE[mentorId]) {
    return MENTOR_PROFILES_DATABASE[mentorId];
  }

  // Generic fallback mentor profile
  return {
    ...MENTOR_PROFILES_DATABASE["mentor-aarav"],
    id: mentorId,
    name: mentorId.replace("mentor-", "").replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  };
}

export default function MentorProfileView({ mentorId }: { mentorId: string }) {
  const mentor = getMentorData(mentorId);
  const openLoginModal = useLoginModal();
  const { user } = useAuth();

  const [selectedSession, setSelectedSession] = useState(mentor.sessions[0]?.id || "");
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const activeSessionObj = mentor.sessions.find((s) => s.id === selectedSession) || mentor.sessions[0];
  const currentDateSlots = mentor.availableSlots[selectedDateIndex] || mentor.availableSlots[0];

  const handleBookingSubmit = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (!selectedSlot) {
      alert("Please select a time slot first.");
      return;
    }
    setBookingConfirmed(true);
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
          <Link href="/search" className="hover:text-slate-900 transition-colors">
            Mentors
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{mentor.name}</span>
        </div>

        {/* TOP PROFILE HEADER BANNER (ADPList style) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Avatar + Details */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 shadow-sm sm:size-28">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="size-full object-cover"
                />
                <span
                  title="Online & Active"
                  className="absolute bottom-1 right-1 size-4 rounded-full border-2 border-white bg-emerald-500"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    {mentor.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    VERIFIED MENTOR
                  </span>
                  {mentor.mentorLevel && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-900 shadow-2xs">
                      <span>👑</span>
                      <span>AI-Certified: {mentor.mentorLevel} {mentor.mentorScore ? `(${mentor.mentorScore}%)` : ""}</span>
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-sm font-medium text-slate-700 sm:text-base">
                  {mentor.headline}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg className="size-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {mentor.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="size-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {mentor.timezone}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action / Direct Message */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/messages"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"
              >
                <svg className="size-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send Message
              </Link>
              <a
                href="#booking-widget"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-600"
              >
                Book a Session ↓
              </a>
            </div>
          </div>

          {/* Key Mentor Stats Strip (ADPList style) */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-100 pt-6 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50/70 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-base font-bold text-amber-500">
                <span>★ {mentor.stats.rating.toFixed(1)}</span>
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                {mentor.stats.reviewCount} Verified Reviews
              </p>
            </div>
            <div className="rounded-xl bg-slate-50/70 p-3 text-center">
              <p className="text-base font-bold text-slate-900">{mentor.stats.sessionsCompleted}+</p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">Sessions Completed</p>
            </div>
            <div className="rounded-xl bg-slate-50/70 p-3 text-center">
              <p className="text-base font-bold text-slate-900">{mentor.stats.responseTime}</p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">Avg Response Time</p>
            </div>
            <div className="rounded-xl bg-slate-50/70 p-3 text-center">
              <p className="text-base font-bold text-slate-900">{mentor.stats.attendanceRate}</p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">Attendance Rate</p>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN CONTENT GRID */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* LEFT 2 COLUMNS: About, Skills, Experience & Reviews */}
          <div className="space-y-8 lg:col-span-2">
            {/* 1. About Bio */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900">About Me & Mentorship Style</h2>
              <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {mentor.bio.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* 2. Skills & Domain Expertise */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900">Skills & Expertise</h2>
              <p className="mt-1 text-xs text-slate-500">
                Topics and technologies {mentor.name} actively mentors on:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mentor.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Work Experience & Education */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900">Experience & Background</h2>
              
              <div className="mt-6 space-y-6">
                {mentor.experience.map((exp, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-sm">
                      {exp.company[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                      <p className="text-xs font-semibold text-slate-500">
                        {exp.company} • <span className="text-slate-400 font-normal">{exp.period}</span>
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Education Sub-section */}
              {mentor.education.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Education</h3>
                  <div className="mt-3 space-y-3">
                    {mentor.education.map((edu, i) => (
                      <div key={i} className="text-xs">
                        <p className="font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-slate-500">{edu.institution} ({edu.year})</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. VERIFIED REVIEWS & RATINGS (ADPList style) */}
            <div id="reviews" className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Verified Peer Reviews</h2>
                  <p className="text-xs text-slate-500">
                    Feedback exclusively from learners following completed sessions.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
                  <span>★ {mentor.stats.rating.toFixed(1)}</span>
                  <span className="text-xs font-normal text-amber-600">({mentor.stats.reviewCount})</span>
                </div>
              </div>

              {/* Review List */}
              <div className="mt-6 space-y-5">
                {mentor.reviews.map((rev) => (
                  <div key={rev.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{rev.author}</p>
                        <p className="text-[11px] text-slate-500">{rev.authorRole}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                      <span>Verified Session:</span> {rev.sessionTitle}
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-700 italic">
                      &quot;{rev.comment}&quot;
                    </p>

                    <p className="mt-2 text-right text-[10px] text-slate-400">{rev.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: STICKY TOPMATE-STYLE SESSION MARKETPLACE & BOOKING WIDGET */}
          <div className="lg:col-span-1">
            <div id="booking-widget" className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Book a 1:1 Session</h2>
              <p className="mt-1 text-xs text-slate-500">
                Choose a session format and reserve your live video slot.
              </p>

              {/* 1. Session Format Selector */}
              <div className="mt-5 space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Format:
                </label>
                {mentor.sessions.map((sess) => (
                  <button
                    key={sess.id}
                    type="button"
                    onClick={() => setSelectedSession(sess.id)}
                    className={`flex w-full flex-col rounded-2xl border p-3.5 text-left transition-all ${
                      selectedSession === sess.id
                        ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{sess.title}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          sess.pricingType === "FREE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {sess.pricingType === "FREE" ? "FREE" : sess.priceAmount}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                      <span>⏱ {sess.duration}</span>
                      <span>•</span>
                      <span className="font-medium text-blue-600">{sess.tag}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* 2. Date Selector */}
              <div className="mt-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Date:
                </label>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {mentor.availableSlots.map((d, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedDateIndex(idx);
                        setSelectedSlot(null);
                      }}
                      className={`flex flex-col items-center rounded-xl border p-2 text-center transition-all ${
                        selectedDateIndex === idx
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-[11px] font-bold">{d.date}</span>
                      <span className="text-[9px] opacity-80">{d.day.split(",")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Time Slot Selector */}
              <div className="mt-5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Available Slots ({currentDateSlots?.day}):
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {currentDateSlots?.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                        selectedSlot === slot
                          ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-400"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Confirmation / Summary Box */}
              {bookingConfirmed ? (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm">
                    ✓
                  </div>
                  <h3 className="mt-2 text-xs font-bold text-emerald-900">Session Request Sent!</h3>
                  <p className="mt-1 text-[11px] text-emerald-700">
                    {mentor.name} will confirm your slot ({selectedSlot} on {currentDateSlots?.day}). Meeting link will be shared via chat.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookingConfirmed(false)}
                    className="mt-3 text-[11px] font-bold text-emerald-800 underline"
                  >
                    Book another slot
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  {/* Price Summary */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                    <span className="font-semibold text-slate-600">Total Price:</span>
                    <span className="text-sm font-bold text-slate-900">
                      {activeSessionObj.pricingType === "FREE" ? "Free ($0)" : activeSessionObj.priceAmount}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white shadow-sm transition hover:bg-blue-600"
                  >
                    {selectedSlot ? `Confirm Request for ${selectedSlot} →` : "Select a Time Slot to Continue"}
                  </button>

                  <div className="mt-4 space-y-1 text-center text-[10px] text-slate-400">
                    <p>Instant Google Meet link upon mentor confirmation</p>
                    <p>Secure booking • Free cancellation anytime</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
