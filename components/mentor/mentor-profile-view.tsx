"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { useAuth } from "@/components/auth/auth-context";
import { calculateXpDiscount, getBadgeForXp } from "@/lib/badges";

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
  "mentor-karthik": {
    id: "mentor-karthik",
    name: "Karthik Rajan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    headline: "CS Student & Web Peer • Silver Explorer",
    company: "Campus Tech Collective",
    location: "Chennai, India",
    timezone: "IST (UTC+5:30)",
    mentorLevel: "Student Peer • Silver Explorer",
    mentorScore: 78,
    bio: [
      "Hey! I'm Karthik, an undergraduate computer science student passionate about full-stack web development. I love building with React, Next.js, and TypeScript.",
      "As a peer creator, I host 1-on-1 peer coding sessions where we can build components together, debug Next.js App Router code, and discuss coursework projects.",
      "All sessions are 100% free peer exchanges aimed at helping each other grow, earn XP, and level up our skills together!",
    ],
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "JavaScript", "Git"],
    experience: [
      {
        role: "Student Lead",
        company: "Campus Open Source Club",
        period: "2023 - Present",
        description: "Organizing weekly peer code reviews and hackathon preparation groups for fellow students.",
      },
    ],
    education: [
      {
        degree: "B.Tech in Computer Science",
        institution: "Anna University",
        year: "2022 - Present",
      },
    ],
    stats: {
      rating: 4.9,
      reviewCount: 29,
      sessionsCompleted: 82,
      responseTime: "< 5 mins",
      attendanceRate: "100%",
    },
    sessions: [
      {
        id: "sess-k1",
        title: "Peer-to-Peer Next.js App Router Practice & Code Pairing",
        description: "Hands-on collaborative coding: layout nesting, server actions, and deploying on Vercel.",
        duration: "30 mins",
        pricingType: "FREE",
        priceAmount: null,
        tag: "Peer Learning",
      },
    ],
    availableSlots: [
      {
        date: "Tomorrow",
        day: "Sat, Oct 12",
        slots: ["10:00 AM", "02:00 PM", "05:00 PM"],
      },
      {
        date: "Sunday",
        day: "Sun, Oct 13",
        slots: ["11:00 AM", "04:00 PM"],
      },
    ],
    reviews: [
      {
        id: "rk1",
        author: "Meera Krishnan",
        authorRole: "CS Junior",
        sessionTitle: "Next.js App Router Practice",
        rating: 5,
        date: "2 days ago",
        comment: "Karthik was super friendly and helped me fix a tricky SSR hydration error in my final year project. Awesome peer session!",
      },
    ],
  },
  "mentor-anita": {
    id: "mentor-anita",
    name: "Anita Joseph",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    headline: "Student Competitive Programmer • Gold Scholar",
    company: "Competitive Coding Guild",
    location: "Kochi, India",
    timezone: "IST (UTC+5:30)",
    mentorLevel: "Student Peer • Gold Scholar",
    mentorScore: 89,
    bio: [
      "Competitive programmer and computer engineering student. ICPC Regionalist and passionate about data structures, binary trees, and graph algorithms.",
      "I host free peer problem-solving sessions to help fellow students prepare for coding interviews and conquer LeetCode anxiety.",
    ],
    skills: ["Data Structures", "Algorithms", "C++", "Python", "Problem Solving", "Binary Trees"],
    experience: [
      {
        role: "Competitive Coding Mentor",
        company: "Student Dev Community",
        period: "2023 - Present",
        description: "Mentoring peers on problem pattern recognition and algorithmic time complexity analysis.",
      },
    ],
    education: [
      {
        degree: "B.Tech in Computer Engineering",
        institution: "Model Engineering College",
        year: "2021 - Present",
      },
    ],
    stats: {
      rating: 5.0,
      reviewCount: 73,
      sessionsCompleted: 210,
      responseTime: "< 5 mins",
      attendanceRate: "99%",
    },
    sessions: [
      {
        id: "sess-a1",
        title: "Peer DSA Problem Solving & LeetCode Pattern Practice",
        description: "Collaborative two-pointer, recursion, and dynamic programming problem solving.",
        duration: "30 mins",
        pricingType: "FREE",
        priceAmount: null,
        tag: "DSA Practice",
      },
    ],
    availableSlots: [
      {
        date: "Daily",
        day: "Today",
        slots: ["07:00 PM", "08:30 PM"],
      },
    ],
    reviews: [
      {
        id: "ra1",
        author: "Siddharth Rao",
        authorRole: "Engineering Student",
        sessionTitle: "Peer DSA Problem Solving",
        rating: 5,
        date: "Yesterday",
        comment: "Anita broke down binary tree recursion patterns so clearly. Learning with a peer who just tackled these problems feels so relatable!",
      },
    ],
  },
  "mentor-rohan": {
    id: "mentor-rohan",
    name: "Rohan Verma",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    headline: "CS Sophomore • Peer Code Practice & Review",
    company: "Student Hackers",
    location: "Pune, India",
    timezone: "IST (UTC+5:30)",
    mentorLevel: "Student Peer • Silver Explorer",
    mentorScore: 74,
    bio: [
      "Second year CS undergrad who loves Python scripting and automation. Always down to hop on a call to debug scripts, talk through OOP concepts, and share study tips.",
      "Completely free peer learning. We both earn XP and level up our badges together!",
    ],
    skills: ["Python", "OOP", "Beginner Programming", "Linux", "Scripting"],
    experience: [
      {
        role: "Python Peer Tutor",
        company: "Freshmen Study Circle",
        period: "2024 - Present",
        description: "Helping first-year students navigate Python syntax, loops, and OOP classes.",
      },
    ],
    education: [
      {
        degree: "B.Sc in Computer Science",
        institution: "Pune University",
        year: "2023 - Present",
      },
    ],
    stats: {
      rating: 4.8,
      reviewCount: 16,
      sessionsCompleted: 38,
      responseTime: "< 10 mins",
      attendanceRate: "100%",
    },
    sessions: [
      {
        id: "sess-r1",
        title: "Peer-to-Peer Python OOP & Beginner Scripting Help",
        description: "Zero pressure Python coding buddy session: classes, inheritance, and debugging.",
        duration: "30 mins",
        pricingType: "FREE",
        priceAmount: null,
        tag: "Python Buddy",
      },
    ],
    availableSlots: [
      {
        date: "Tomorrow",
        day: "Sat, Oct 12",
        slots: ["05:00 PM", "07:00 PM"],
      },
    ],
    reviews: [
      {
        id: "rr1",
        author: "Tanya Sen",
        authorRole: "CS Freshman",
        sessionTitle: "Python OOP Help",
        rating: 5,
        date: "3 days ago",
        comment: "Rohan was patient and helped me understand self, __init__, and inheritance in Python. Great peer mentor!",
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

function computeFutureDateIso(daysOffset: number): string {
  const target = new Date();
  target.setDate(target.getDate() + daysOffset);
  return target.toISOString();
}

function createFallbackBookingId(): string {
  return `bkg-${Date.now()}`;
}

export default function MentorProfileView({ mentorId }: { mentorId: string }) {
  const mentor = getMentorData(mentorId);
  const openLoginModal = useLoginModal();
  const { user, refreshUser } = useAuth();

  const [selectedSession, setSelectedSession] = useState(mentor.sessions[0]?.id || "");
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [redeemXp, setRedeemXp] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBookingData, setConfirmedBookingData] = useState<{
    id: string;
    meetingUrl?: string | null;
    discountApplied?: {
      badgeName: string;
      discountAmount: number;
      finalPrice: number;
      xpRedeemed: number;
    } | null;
  } | null>(null);

  const activeSessionObj = mentor.sessions.find((s) => s.id === selectedSession) || mentor.sessions[0];
  const currentDateSlots = mentor.availableSlots[selectedDateIndex] || mentor.availableSlots[0];

  const isPaid = activeSessionObj.pricingType === "PAID";
  const numericPrice = isPaid ? (parseFloat(activeSessionObj.priceAmount?.replace(/[^0-9.]/g, "") || "0") || 0) : 0;
  const studentXp = user?.xp || 0;
  const currentBadge = getBadgeForXp(studentXp);
  const xpDiscount = isPaid && numericPrice > 0 ? calculateXpDiscount(studentXp, numericPrice) : null;
  const effectivePrice = isPaid && redeemXp && xpDiscount?.canApply ? `₹${xpDiscount.finalPrice}` : (isPaid ? activeSessionObj.priceAmount : "Free ($0)");

  const handleBookingSubmit = async () => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (!selectedSlot) {
      alert("Please select a time slot first.");
      return;
    }

    setIsSubmittingBooking(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId,
          sessionTitle: activeSessionObj.title,
          pricingType: activeSessionObj.pricingType,
          rawPrice: isPaid ? numericPrice : undefined,
          redeemXp: isPaid && redeemXp,
          slotTime: selectedSlot,
          scheduledAt: computeFutureDateIso(selectedDateIndex + 1),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.error || "Failed to confirm booking.");
        return;
      }

      setConfirmedBookingData({
        id: data.booking?.id || createFallbackBookingId(),
        meetingUrl: data.booking?.meetingUrl,
        discountApplied: data.discountApplied,
      });
      setBookingConfirmed(true);
      await refreshUser();
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Failed to book mentorship session.");
    } finally {
      setIsSubmittingBooking(false);
    }
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
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    {mentor.name}
                  </h1>
                  {mentor.mentorLevel?.includes("Student Peer") ? (
                    <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      🌱 Student Peer Creator
                    </span>
                  ) : (
                    <svg className="size-5 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-label="Verified Mentor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-xs sm:text-sm font-medium text-slate-500">
                    • {mentor.mentorLevel || "Verified Member"}
                  </span>
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
              {user && (user.id === mentorId || user.name === mentor.name) ? (
                <Link
                  href="/mentor/dashboard"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
                >
                  Manage in Studio ⚙
                </Link>
              ) : (
                <>
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
                    {user?.role === "MENTOR" ? "View Slots ↓" : "Book a Session ↓"}
                  </a>
                </>
              )}
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
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center animate-fade-in">
                  <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-base shadow-xs">
                    ✓
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-emerald-950">Mentorship Session Confirmed!</h3>
                  <p className="mt-1 text-xs text-emerald-800">
                    Your 1-on-1 peer session with <strong>{mentor.name}</strong> is scheduled for <strong>{selectedSlot}</strong> ({currentDateSlots?.day}).
                  </p>

                  {/* Google Meet Link */}
                  {confirmedBookingData?.meetingUrl && (
                    <div className="mt-3.5 rounded-xl border border-emerald-300 bg-white p-3 text-left shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900">
                        <span>📹 Google Meet Link Ready:</span>
                      </div>
                      <a
                        href={confirmedBookingData.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block truncate text-xs font-semibold text-blue-600 underline hover:text-blue-800"
                      >
                        {confirmedBookingData.meetingUrl}
                      </a>
                    </div>
                  )}

                  {/* XP Discount Applied Callout */}
                  {confirmedBookingData?.discountApplied && (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
                      ⚡ <strong>{confirmedBookingData.discountApplied.badgeName} Perk:</strong> Redeemed {confirmedBookingData.discountApplied.xpRedeemed} XP for a ₹{confirmedBookingData.discountApplied.discountAmount} discount! (Paid: ₹{confirmedBookingData.discountApplied.finalPrice})
                    </div>
                  )}

                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href="/roadmap"
                      className="inline-flex h-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white transition hover:bg-emerald-700"
                    >
                      View Career Roadmap Progress →
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingConfirmed(false);
                        setConfirmedBookingData(null);
                      }}
                      className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
                    >
                      Book another slot
                    </button>
                  </div>
                </div>
              ) : user && (user.id === mentorId || user.name === mentor.name) ? (
                <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 text-center">
                  <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs">
                    ⚙
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-blue-900">This is Your Public Mentor Profile</h3>
                  <p className="mt-1 text-xs text-blue-700">
                    Students discover and book your sessions through this page. You cannot book sessions with yourself.
                  </p>
                  <Link
                    href="/mentor/dashboard"
                    className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white transition hover:bg-blue-700 shadow-xs"
                  >
                    Open Mentor Studio to Manage Offerings →
                  </Link>
                </div>
              ) : (
                <div className="mt-6">
                  {/* Fellow Mentor Collaboration Callout */}
                  {user?.role === "MENTOR" && (
                    <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50/80 p-3 text-center">
                      <p className="text-xs font-semibold text-indigo-900">
                        Peer Mentor View
                      </p>
                      <p className="mt-0.5 text-[11px] text-indigo-700">
                        Want to sync or collaborate with {mentor.name.split(" ")[0]}?
                      </p>
                      <Link
                        href="/messages"
                        className="mt-2 inline-flex h-8 w-full items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white transition hover:bg-indigo-700"
                      >
                        Send Peer Message 💬
                      </Link>
                    </div>
                  )}

                  {/* Student XP Badge Discount Card (For Paid Sessions) */}
                  {isPaid && user && (
                    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{currentBadge.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">{currentBadge.name}</span>
                              <span className="rounded bg-amber-200 px-1.5 py-0.2 text-[10px] font-bold text-amber-900">
                                {studentXp} XP
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600">
                              {xpDiscount?.canApply
                                ? `Unlock ${xpDiscount.badge.discountPercent}% off (Save ₹${xpDiscount.discountAmount})`
                                : `Earn ${xpDiscount?.badge.redeemXpCost || 50} XP to unlock discount`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {xpDiscount?.canApply && (
                        <label className="mt-2.5 flex items-center gap-2 cursor-pointer pt-2 border-t border-amber-200">
                          <input
                            type="checkbox"
                            checked={redeemXp}
                            onChange={(e) => setRedeemXp(e.target.checked)}
                            className="size-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-xs font-bold text-amber-950">
                            Apply {xpDiscount.badge.discountPercent}% XP Badge Discount (-₹{xpDiscount.discountAmount})
                          </span>
                        </label>
                      )}
                    </div>
                  )}

                  {/* Price Summary */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                    <span className="font-semibold text-slate-600">Total Price:</span>
                    <div className="text-right">
                      {isPaid && redeemXp && xpDiscount?.canApply ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-slate-400 line-through">
                            {activeSessionObj.priceAmount}
                          </span>
                          <span className="text-sm font-bold text-emerald-600">
                            {effectivePrice}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-900">
                          {activeSessionObj.pricingType === "FREE" ? "Free ($0)" : activeSessionObj.priceAmount}
                        </span>
                      )}
                    </div>
                  </div>

                  {bookingError && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-700">
                      {bookingError}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isSubmittingBooking}
                    onClick={handleBookingSubmit}
                    className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white shadow-sm transition hover:bg-blue-600 disabled:opacity-60"
                  >
                    {isSubmittingBooking
                      ? "Securing Session..."
                      : selectedSlot
                      ? `Confirm Request for ${selectedSlot} (${effectivePrice}) →`
                      : "Select a Time Slot to Continue"}
                  </button>

                  <div className="mt-4 space-y-1 text-center text-[10px] text-slate-400">
                    <p>Instant Google Meet link generated upon booking</p>
                    <p>Milestone verification automatically unlocks in Roadmap</p>
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
