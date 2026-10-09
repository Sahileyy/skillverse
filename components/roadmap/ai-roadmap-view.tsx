"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { useAuth } from "@/components/auth/auth-context";

export type RoadmapMilestone = {
  id: string;
  stage: "BASELINE" | "SKILL_GAP" | "RECOMMENDED" | "CAPSTONE" | "TARGET";
  title: string;
  description: string;
  skills: string[];
  recommendedMentor?: {
    name: string;
    id: string;
    avatar: string;
    headline: string;
  };
  resources: string[];
  isCompleted?: boolean;
};

function PathwayIcon({ id, className = "size-5" }: { id: string; className?: string }) {
  if (id === "aiml") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
  if (id === "uiux") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

export type CareerPathway = {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  estimatedMonths: string;
  marketDemand: string;
  milestones: RoadmapMilestone[];
};

export const CAREER_PATHWAYS: Record<string, CareerPathway> = {
  "fullstack": {
    id: "fullstack",
    title: "Full-Stack Software Engineer",
    description: "From client-side UI to database modeling, authentication security, and scalable cloud deployment.",
    targetRole: "Full-Stack Engineer (React + Next.js + PostgreSQL)",
    estimatedMonths: "3 - 5 Months",
    marketDemand: "High Demand (95% hiring index)",
    milestones: [
      {
        id: "m-1",
        stage: "BASELINE",
        title: "1. Core Frontend Fundamentals",
        description: "Semantic HTML5, CSS Grid/Flexbox, JavaScript ES6+ (Promises, async/await, closures), and Git version control.",
        skills: ["HTML5", "CSS3", "JavaScript ES6", "Git"],
        resources: ["MDN Web Docs", "Modern JS Handbook"],
        isCompleted: true,
      },
      {
        id: "m-2",
        stage: "SKILL_GAP",
        title: "2. React Architecture & Next.js App Router",
        description: "Component composition, custom hooks, Server Components (RSC), Streaming SSR, and routing patterns.",
        skills: ["React 19", "Next.js App Router", "TypeScript", "Tailwind CSS"],
        recommendedMentor: {
          id: "mentor-aarav",
          name: "Aarav Sharma",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          headline: "Senior Frontend Engineer @ Stripe",
        },
        resources: ["Next.js Documentation", "React Reconciliation Deep Dive"],
        isCompleted: false,
      },
      {
        id: "m-3",
        stage: "SKILL_GAP",
        title: "3. Database Modeling & Backend APIs",
        description: "PostgreSQL relational schemas, Prisma ORM queries, JWT cookie authentication, and REST/Server Action endpoints.",
        skills: ["PostgreSQL", "Prisma ORM", "NextAuth / Jose JWT", "Zod Validation"],
        recommendedMentor: {
          id: "mentor-priya",
          name: "Priya Sundaram",
          avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
          headline: "Backend Architect • Distributed Systems",
        },
        resources: ["PostgreSQL Indexing Guide", "Prisma Schema Modeling"],
        isCompleted: false,
      },
      {
        id: "m-4",
        stage: "RECOMMENDED",
        title: "4. State Management & API Performance",
        description: "Zustand state store, TanStack Query (React Query) caching, optimistic UI updates, and Core Web Vitals profiling.",
        skills: ["Zustand", "TanStack Query", "Web Vitals", "Lighthouse"],
        resources: ["Frontend Performance Playbook", "Optimistic Mutations"],
        isCompleted: false,
      },
      {
        id: "m-5",
        stage: "CAPSTONE",
        title: "5. Production Capstone & Peer Review",
        description: "Build, test, and deploy a production SaaS application with user authentication, database persistence, and a peer code review session.",
        skills: ["Vercel CI/CD", "Docker", "Jest / Playwright"],
        resources: ["Production Deployment Checklist"],
        isCompleted: false,
      },
      {
        id: "m-6",
        stage: "TARGET",
        title: "Target Role: Full-Stack Engineer",
        description: "Ready for technical portfolio evaluations, take-home challenges, and system design interviews.",
        skills: ["System Design", "Technical Interviews", "Portfolio Projects"],
        resources: ["System Design Primer", "Mock Interview Rubric"],
        isCompleted: false,
      },
    ],
  },
  "aiml": {
    id: "aiml",
    title: "AI & Machine Learning Engineer",
    description: "Master modern Python, deep learning with PyTorch, vector databases, and RAG application deployment.",
    targetRole: "Applied Machine Learning Engineer",
    estimatedMonths: "4 - 6 Months",
    marketDemand: "Exceptional Demand (98% hiring index)",
    milestones: [
      {
        id: "m-ai-1",
        stage: "BASELINE",
        title: "1. Python Foundations & Mathematics",
        description: "Object-oriented Python, Linear Algebra, Multivariable Calculus, and Probability basics.",
        skills: ["Python", "NumPy", "Pandas", "Linear Algebra"],
        resources: ["3Blue1Brown Linear Algebra", "Python for Data Analysis"],
        isCompleted: true,
      },
      {
        id: "m-ai-2",
        stage: "SKILL_GAP",
        title: "2. Deep Learning with PyTorch",
        description: "Building neural networks, backpropagation, CNNs for computer vision, and Transformer architectures.",
        skills: ["PyTorch", "Transformers", "Hugging Face", "CUDA"],
        recommendedMentor: {
          id: "mentor-maya",
          name: "Dr. Maya Patel",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
          headline: "AI Researcher & Applied Data Scientist",
        },
        resources: ["PyTorch Official Tutorials", "Attention Is All You Need"],
        isCompleted: false,
      },
      {
        id: "m-ai-3",
        stage: "RECOMMENDED",
        title: "3. RAG Architecture & Vector DBs",
        description: "Document chunking strategies, embeddings, ChromaDB / Pinecone, and LLM orchestration with LangChain.",
        skills: ["LangChain", "Vector DB", "Embeddings", "FastAPI"],
        resources: ["RAG Engineering Playbook"],
        isCompleted: false,
      },
      {
        id: "m-ai-4",
        stage: "CAPSTONE",
        title: "4. Production ML Deployment (MLOps)",
        description: "Containerize ML APIs using Docker, optimize inference latency with ONNX, and deploy scalable endpoints.",
        skills: ["Docker", "FastAPI", "ONNX", "MLflow"],
        resources: ["Full Stack Deep Learning Course"],
        isCompleted: false,
      },
      {
        id: "m-ai-5",
        stage: "TARGET",
        title: "Target Role: AI / ML Engineer",
        description: "Equipped to develop enterprise LLM applications, model fine-tuning pipelines, and data systems.",
        skills: ["Model Fine-tuning", "Evaluation Benchmarks"],
        resources: ["ML Interview Guide"],
        isCompleted: false,
      },
    ],
  },
  "uiux": {
    id: "uiux",
    title: "Product Designer & Design Systems",
    description: "From user research and Figma component architecture to design tokens, wireframing, and design-dev handoff.",
    targetRole: "Product Designer (UI/UX & Design Systems)",
    estimatedMonths: "3 - 4 Months",
    marketDemand: "Steady Demand (88% hiring index)",
    milestones: [
      {
        id: "m-ui-1",
        stage: "BASELINE",
        title: "1. Visual & Interaction Design Basics",
        description: "Color theory, typography scale, visual hierarchy, and basic wireframing in Figma.",
        skills: ["Figma Basics", "Typography", "Color Theory", "Grid Layouts"],
        resources: ["Refactoring UI", "Material Design Guidelines"],
        isCompleted: true,
      },
      {
        id: "m-ui-2",
        stage: "SKILL_GAP",
        title: "2. Scalable Design Systems & Tokens",
        description: "Auto-layout components, variant properties, multi-mode variables (light/dark theme), and token naming schemas.",
        skills: ["Design Tokens", "Auto Layout", "Component Sets", "Figma Variables"],
        recommendedMentor: {
          id: "mentor-noah",
          name: "Noah Chen",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
          headline: "Product Designer & Design Systems Lead",
        },
        resources: ["Design Systems Handbook", "Figma Auto Layout Deep Dive"],
        isCompleted: false,
      },
      {
        id: "m-ui-3",
        stage: "RECOMMENDED",
        title: "3. User Research & Usability Testing",
        description: "Conducting user interviews, journey mapping, low-to-high fidelity interactive prototyping, and usability audits.",
        skills: ["User Research", "Usability Testing", "Prototyping", "WCAG Accessibility"],
        resources: ["Don't Make Me Think", "UX Research Field Guide"],
        isCompleted: false,
      },
      {
        id: "m-ui-4",
        stage: "CAPSTONE",
        title: "4. End-to-End Case Study Portfolio",
        description: "Publish 2 in-depth case studies solving a real-world problem with verified peer mentor feedback.",
        skills: ["Portfolio Case Studies", "Design Presentation"],
        resources: ["Case Study Framework"],
        isCompleted: false,
      },
      {
        id: "m-ui-5",
        stage: "TARGET",
        title: "Target Role: Product Designer",
        description: "Ready for product design critiques, whiteboard design challenges, and portfolio reviews.",
        skills: ["Design Critique", "Portfolio Review"],
        resources: ["Product Design Interview Handbook"],
        isCompleted: false,
      },
    ],
  },
};

export default function AIRoadmapView() {
  const searchParams = useSearchParams();
  const openLoginModal = useLoginModal();
  const { user, refreshUser } = useAuth();

  const fromAssessment = searchParams.get("fromAssessment") === "1";
  const assessmentQuiz = searchParams.get("quiz");
  const assessmentScoreRaw = searchParams.get("score");
  const assessmentScore = assessmentScoreRaw !== null ? parseInt(assessmentScoreRaw, 10) : null;
  const assessmentSkill = searchParams.get("skill") || "Technical Assessment";
  const assessmentLevel = searchParams.get("level") || "Proficient Practitioner";
  const assessmentVerified = searchParams.get("verified") === "1";
  const paramCareer = searchParams.get("career");

  const [dismissAssessmentBanner, setDismissAssessmentBanner] = useState(false);

  // Initial pathway
  const initialPathwayKey = React.useMemo(() => {
    if (paramCareer && CAREER_PATHWAYS[paramCareer]) return paramCareer;
    if (assessmentQuiz === "python" || assessmentSkill.toLowerCase().includes("python")) return "aiml";
    if (assessmentQuiz === "react" || assessmentQuiz === "dsa") return "fullstack";
    return "fullstack";
  }, [paramCareer, assessmentQuiz, assessmentSkill]);

  const [selectedPathwayKey, setSelectedPathwayKey] = useState<string>(initialPathwayKey);

  // Calibrate starting waypoint based on assessment score
  const calibratedWaypointIndex = React.useMemo(() => {
    if (assessmentScore !== null) {
      if (assessmentScore >= 80) return 2; // Jump to Milestone 3 (Advanced/Expert)
      if (assessmentScore >= 60) return 1; // Jump to Milestone 2 (Proficient)
      return 0; // Milestone 1 (Foundational)
    }
    return 1;
  }, [assessmentScore]);

  const [activeWaypointIndex, setActiveWaypointIndex] = useState<number>(calibratedWaypointIndex);

  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      "m-1": true,
      "m-ai-1": true,
      "m-ui-1": true,
    };
    if (assessmentScore !== null && assessmentScore >= 80) {
      initial["m-2"] = true;
      initial["m-ai-2"] = true;
    }
    return initial;
  });

  const [xpAlert, setXpAlert] = useState<{ message: string; amount: number } | null>(null);
  const [goalMessage, setGoalMessage] = useState<string | null>(null);
  const [isSavingGoal, setIsSavingGoal] = useState(false);

  // Custom Groq AI Generated Pathways
  const [customPathways, setCustomPathways] = useState<Record<string, CareerPathway>>({});
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [generateRoadmapError, setGenerateRoadmapError] = useState<string | null>(null);

  const allPathways = React.useMemo(() => ({
    ...CAREER_PATHWAYS,
    ...customPathways,
  }), [customPathways]);

  const activePathway = allPathways[selectedPathwayKey] || CAREER_PATHWAYS.fullstack;

  const handleGenerateCustomRoadmap = async () => {
    if (!customRoleInput.trim()) return;
    try {
      setIsGeneratingRoadmap(true);
      setGenerateRoadmapError(null);
      const res = await fetch("/api/ai/career-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: customRoleInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.guidance) {
        setGenerateRoadmapError(data.error || "Failed to generate roadmap.");
        return;
      }

      type ApiMilestone = {
        id: string;
        stage: "BASELINE" | "SKILL_GAP" | "RECOMMENDED" | "CAPSTONE" | "TARGET";
        title: string;
        description: string;
        skills: string[];
        resources: string[];
        recommendedMentorRole?: string;
      };

      const g = data.guidance;
      const key = `custom-${Date.now()}`;
      const newPathway: CareerPathway = {
        id: key,
        title: g.targetRole,
        description: g.careerSummary,
        targetRole: g.targetRole,
        estimatedMonths: g.estimatedMonths,
        marketDemand: g.marketDemand,
        milestones: (g.milestones as ApiMilestone[]).map((m, idx) => ({
          id: `${key}-m-${idx}`,
          stage: m.stage,
          title: m.title,
          description: m.description,
          skills: m.skills,
          resources: m.resources,
          recommendedMentor: {
            id: "mentor-aarav",
            name: m.recommendedMentorRole || "Domain Specialist Mentor",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            headline: `${m.recommendedMentorRole || "Domain Specialist"} • SkillVerse Mentor`,
          },
          isCompleted: idx === 0,
        })),
      };

      setCustomPathways((prev) => ({ ...prev, [key]: newPathway }));
      setSelectedPathwayKey(key);
      setActiveWaypointIndex(1);
      setCompletedMilestones((prev) => ({ ...prev, [`${key}-m-0`]: true }));
      setCustomRoleInput("");
    } catch {
      setGenerateRoadmapError("Network error while generating career guidance.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Sync pathway based on user's profile career goal when not directly from assessment
  const userGoal = user?.profile?.careerGoal;
  const [prevUserGoal, setPrevUserGoal] = useState(userGoal);
  if (!fromAssessment && prevUserGoal !== userGoal) {
    setPrevUserGoal(userGoal);
    if (userGoal) {
      const goalLower = userGoal.toLowerCase();
      if (goalLower.includes("ai") || goalLower.includes("machine") || goalLower.includes("data")) {
        setSelectedPathwayKey("aiml");
      } else if (goalLower.includes("design") || goalLower.includes("ui") || goalLower.includes("ux")) {
        setSelectedPathwayKey("uiux");
      } else if (goalLower.includes("full") || goalLower.includes("web") || goalLower.includes("frontend") || goalLower.includes("backend")) {
        setSelectedPathwayKey("fullstack");
      }
    }
  }

  // Skill gap analysis
  const userSkills = user?.profile?.skills || [];
  const pathwaySkills = React.useMemo(() => {
    return Array.from(new Set(activePathway.milestones.flatMap((m) => m.skills)));
  }, [activePathway]);

  const recommendedSkills = React.useMemo(() => {
    const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());
    return pathwaySkills.filter(
      (skill) => !normalizedUserSkills.includes(skill.toLowerCase().trim())
    );
  }, [pathwaySkills, userSkills]);

  const toggleMilestone = async (nodeId: string, nodeTitle: string) => {
    const currentCompleted = Boolean(
      completedMilestones[nodeId] ||
      user?.completedActivities?.includes(`milestone:${selectedPathwayKey}:${nodeId}`)
    );

    setCompletedMilestones((prev) => ({
      ...prev,
      [nodeId]: !currentCompleted,
    }));

    if (user) {
      try {
        const res = await fetch("/api/roadmap/milestone-toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pathwayId: selectedPathwayKey,
            milestoneId: nodeId,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          if (data.xpAwarded && data.xpAwarded > 0) {
            setXpAlert({
              amount: data.xpAwarded,
              message: `Completed "${nodeTitle}"!`,
            });
          }
          await refreshUser();
        }
      } catch (err) {
        console.error("Failed to toggle milestone:", err);
      }
    }
  };

  const handleSaveGoalToProfile = async () => {
    if (!user) {
      openLoginModal();
      return;
    }
    setIsSavingGoal(true);
    setGoalMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          education: user.profile?.education || null,
          headline: user.profile?.headline || null,
          bio: user.profile?.bio || null,
          skills: user.profile?.skills || [],
          interests: user.profile?.interests || [],
          careerGoal: activePathway.title,
          image: user.image || null,
          githubUrl: user.profile?.githubUrl || null,
          linkedinUrl: user.profile?.linkedinUrl || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGoalMessage(`Target career goal set to "${activePathway.title}" on your profile!`);
        await refreshUser();
      }
    } catch {
      setGoalMessage("Failed to update goal. Please try again.");
    } finally {
      setIsSavingGoal(false);
    }
  };

  // Progress metrics
  const totalMilestones = activePathway.milestones.length;
  const finishedCount = activePathway.milestones.filter((m) =>
    Boolean(
      completedMilestones[m.id] ||
      m.isCompleted ||
      user?.completedActivities?.includes(`milestone:${selectedPathwayKey}:${m.id}`)
    )
  ).length;
  const progressPercent = Math.round((finishedCount / totalMilestones) * 100);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-5 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">AI Career Guidance</span>
        </div>

        {/* Mentor Advisory Banner */}
        {user?.role === "MENTOR" && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👑</span>
              <div>
                <p className="font-bold">You are signed in as a Verified Mentor</p>
                <p className="text-[11px] text-amber-800">
                  Career Roadmaps are student-facing progression paths. You can publish skill ads in Mentor Studio or evaluate your own competency level.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/mentor/dashboard"
                className="rounded-xl bg-slate-900 px-3.5 py-1.5 font-bold text-white hover:bg-slate-800 text-xs"
              >
                Mentor Studio →
              </Link>
              <Link
                href="/assessment?quiz=mentor_accreditation"
                className="rounded-xl border border-amber-300 bg-white px-3 py-1.5 font-bold text-amber-900 hover:bg-amber-100 text-xs"
              >
                Accreditation Test →
              </Link>
            </div>
          </div>
        )}

        {/* Header Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            AI Career Roadmap & Skill Gap Analyzer
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Map your learning path: Current Baseline Skills → Identified Gaps → Recommended Mentors → Target Position.
          </p>
        </div>

        {/* ASSESSMENT CALIBRATION BANNER */}
        {fromAssessment && !dismissAssessmentBanner && (
          <div className="mt-8 rounded-3xl border border-indigo-300 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 p-6 sm:p-7 text-white shadow-lg animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white text-2xl shadow-md">
                  🎯
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Assessment Result Applied
                    </span>
                    <span className="text-xs text-indigo-200">
                      Skill: {assessmentSkill}
                    </span>
                    {assessmentVerified && (
                      <span className="rounded-full bg-indigo-500/30 border border-indigo-400/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-100">
                        ✓ AI-Verified Status
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-xl font-extrabold text-white">
                    Direct Career Path Navigation Calibrated
                  </h3>
                  <p className="mt-1.5 text-xs text-indigo-100 leading-relaxed max-w-2xl">
                    You scored <strong className="text-white">{assessmentScore}% ({assessmentLevel})</strong>. Your career roadmap has been calibrated directly according to this result:
                    {assessmentScore !== null && assessmentScore >= 80 ? (
                      <span className="ml-1 text-emerald-300 font-medium">Foundational hurdles bypassed. Active route starts at <strong>Stop 3: Database Modeling & Advanced Architecture</strong>.</span>
                    ) : assessmentScore !== null && assessmentScore >= 60 ? (
                      <span className="ml-1 text-indigo-200 font-medium">Core fundamentals validated. Active route focused on <strong>Stop 2: Architecture & Next.js Mastery</strong>.</span>
                    ) : (
                      <span className="ml-1 text-amber-200 font-medium">Core gaps identified. Route initiates at <strong>Stop 1: Fundamentals</strong> for essential prerequisite reinforcement.</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Link
                  href="/assessment"
                  className="rounded-xl border border-indigo-400/40 bg-indigo-900/60 hover:bg-indigo-900 px-4 py-2 text-xs font-bold text-white transition"
                >
                  Review Quiz
                </Link>
                <button
                  type="button"
                  onClick={() => setDismissAssessmentBanner(true)}
                  className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-semibold text-indigo-200 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Groq AI Career Pathway Generator */}
        <div className="mt-8 rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-white p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-xl shadow-xs">
                🧭
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                    Groq Career Guidance
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Personalized AI Roadmap</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  Targeting a Specific Dream Role? Generate a Custom AI Pathway
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customRoleInput}
              onChange={(e) => setCustomRoleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customRoleInput.trim() && !isGeneratingRoadmap) {
                  e.preventDefault();
                  handleGenerateCustomRoadmap();
                }
              }}
              placeholder="Enter your target role: e.g. Cloud Security Architect, AI Systems Engineer, Quant Developer..."
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            <button
              type="button"
              onClick={handleGenerateCustomRoadmap}
              disabled={isGeneratingRoadmap || !customRoleInput.trim()}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
            >
              {isGeneratingRoadmap ? (
                <>
                  <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Analyzing with Groq...</span>
                </>
              ) : (
                <>
                  <span>⚡ Generate AI Roadmap</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
          {generateRoadmapError && (
            <p className="mt-2 text-xs font-medium text-red-600">{generateRoadmapError}</p>
          )}
        </div>

        {/* 1. CAREER PATHWAY SELECTOR */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {Object.values(allPathways).map((path) => (
            <button
              key={path.id}
              type="button"
              onClick={() => setSelectedPathwayKey(path.id)}
              className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                selectedPathwayKey === path.id
                  ? "border-indigo-600 bg-white shadow-md ring-2 ring-indigo-100"
                  : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <PathwayIcon id={path.id} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 sm:text-sm">{path.title}</h3>
                <p className="text-[11px] text-slate-500">{path.estimatedMonths}</p>
              </div>
            </button>
          ))}
        </div>

        {/* XP Celebration Banner */}
        {xpAlert && (
          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black text-lg">
                ⚡
              </span>
              <div>
                <p className="font-bold text-sm">+{xpAlert.amount} XP Earned!</p>
                <p className="text-xs text-amber-800">{xpAlert.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setXpAlert(null)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {goalMessage && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
            {goalMessage}
          </div>
        )}

        {/* Pathway Summary Card */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <PathwayIcon id={activePathway.id} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{activePathway.targetRole}</h2>
              </div>
              <p className="mt-1 text-xs text-slate-600 max-w-xl">
                {activePathway.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 sm:border-l sm:border-slate-100 sm:pl-6">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Estimated Time</p>
                <p className="text-slate-900 font-bold">{activePathway.estimatedMonths}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Demand Level</p>
                <p className="text-emerald-600 font-bold">{activePathway.marketDemand}</p>
              </div>
            </div>
          </div>

          {/* Overall Roadmap Completion Progress */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Roadmap Progress:</span>
              <span className="font-bold text-indigo-700">
                {finishedCount} of {totalMilestones} Milestones Completed ({progressPercent}%)
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skill Gap Analysis Box */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Target Career Goal</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-extrabold text-slate-900">
                  {user?.profile?.careerGoal || activePathway.title}
                </span>
                {user?.profile?.careerGoal === activePathway.title && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Active Goal
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveGoalToProfile}
              disabled={isSavingGoal || user?.profile?.careerGoal === activePathway.title}
              className="h-9 px-4 rounded-xl bg-slate-900 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-40"
            >
              {isSavingGoal ? "Saving..." : user?.profile?.careerGoal === activePathway.title ? "✓ Saved on Profile" : "Set as My Career Goal"}
            </button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Current Skills (from Profile)</h4>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {userSkills.length > 0 ? (
                  userSkills.map((skill) => (
                    <span key={skill} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No profile skills yet. Add skills in your <Link href="/profile" className="text-blue-600 underline">Profile</Link>.</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider">Recommended Skills to Acquire</h4>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {recommendedSkills.length > 0 ? (
                  recommendedSkills.slice(0, 8).map((skill) => (
                    <span key={skill} className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      + {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-emerald-600 font-semibold">✓ You already cover all core skills in this roadmap!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Demo Transparency Note */}
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs text-indigo-900 flex items-center gap-3">
          <span className="text-base">💡</span>
          <div>
            <span className="font-bold">College Demo Career Roadmap:</span>
            <span className="ml-1 text-indigo-800">
              Deterministic milestone progression matching student profile skills and target career positions. Complete milestones to earn +5 XP each!
            </span>
          </div>
        </div>

        {/* INTERACTIVE GPS ROUTE NAVIGATION COCKPIT */}
        {(() => {
          const safeWaypointIndex = Math.min(activeWaypointIndex, activePathway.milestones.length - 1);
          const currentWaypoint = activePathway.milestones[safeWaypointIndex] || activePathway.milestones[0];
          const isCurrentWaypointDone = Boolean(
            completedMilestones[currentWaypoint.id] ||
            currentWaypoint.isCompleted ||
            user?.completedActivities?.includes(`milestone:${selectedPathwayKey}:${currentWaypoint.id}`)
          );

          const scrollToMilestone = (nodeId: string, idx: number) => {
            setActiveWaypointIndex(idx);
            const el = document.getElementById(`milestone-${nodeId}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          };

          return (
            <div className="mt-10 overflow-hidden rounded-3xl border border-indigo-200 bg-white shadow-md">
              {/* Cockpit Status Bar */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 p-5 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-xl font-bold">
                      🧭
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                          Live Navigation Active
                        </span>
                        {fromAssessment && (
                          <span className="rounded-full bg-indigo-400/20 border border-indigo-400/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-200">
                            Calibrated to Assessment
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 text-base font-extrabold text-white sm:text-lg">
                        Route: {activePathway.targetRole}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-indigo-100 sm:border-l sm:border-indigo-800/80 sm:pl-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-indigo-300">Active Waypoint</p>
                      <p className="text-white font-bold">Stop {safeWaypointIndex + 1} of {activePathway.milestones.length}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-indigo-300">Route ETA</p>
                      <p className="text-white font-bold">{activePathway.estimatedMonths}</p>
                    </div>
                  </div>
                </div>

                {/* Turn-by-Turn Waypoint Rails (Interactive Stepper) */}
                <div className="mt-6 border-t border-indigo-800/60 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-3">
                    Turn-by-Turn Waypoints (Click to inspect stop):
                  </p>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {activePathway.milestones.map((m, idx) => {
                      const isDone = Boolean(
                        completedMilestones[m.id] ||
                        m.isCompleted ||
                        user?.completedActivities?.includes(`milestone:${selectedPathwayKey}:${m.id}`)
                      );
                      const isActive = idx === safeWaypointIndex;

                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => scrollToMilestone(m.id, idx)}
                          className={`group flex items-center gap-2 rounded-xl px-3 py-2 text-left transition shrink-0 ${
                            isActive
                              ? "bg-white text-slate-900 shadow-md ring-2 ring-indigo-400 font-bold"
                              : isDone
                              ? "bg-indigo-900/50 hover:bg-indigo-900/80 text-emerald-300 border border-emerald-500/30"
                              : "bg-indigo-950/60 hover:bg-indigo-900/40 text-indigo-200 border border-indigo-800/40"
                          }`}
                        >
                          <span
                            className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                              isActive
                                ? "bg-indigo-600 text-white"
                                : isDone
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {isDone ? "✓" : isActive ? "📍" : idx + 1}
                          </span>
                          <div className="max-w-[130px] truncate text-[11px]">
                            <p className="truncate font-semibold">{m.title.replace(/^[0-9]+\.\s*/, "")}</p>
                            <p className={`text-[9px] uppercase tracking-wider font-bold ${
                              isActive ? "text-indigo-600" : isDone ? "text-emerald-400" : "text-indigo-300/70"
                            }`}>
                              {isActive ? "Current Stop" : isDone ? "Cleared" : `Stop ${idx + 1}`}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Active Waypoint HUD Card ("Turn-by-Turn Directions") */}
              <div className="p-6 sm:p-7 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                        🧭 Turn-by-Turn GPS Focus
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Waypoint {safeWaypointIndex + 1} of {activePathway.milestones.length}
                      </span>
                      {isCurrentWaypointDone && (
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          ✓ Waypoint Cleared
                        </span>
                      )}
                    </div>

                    <h4 className="mt-2 text-lg font-bold text-slate-900">
                      {currentWaypoint.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 max-w-2xl">
                      {currentWaypoint.description}
                    </p>

                    {/* Contextual assessment guidance */}
                    {fromAssessment && assessmentScore !== null && (
                      <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 text-xs text-indigo-900 max-w-2xl">
                        <span className="font-bold">GPS Route Calibration:</span>{" "}
                        {assessmentScore >= 80 ? (
                          <span>With an <strong>Expert score ({assessmentScore}%)</strong> in {assessmentSkill}, you have bypassed early foundational stops. Focus here on mastering scalable architecture and data modeling.</span>
                        ) : assessmentScore >= 60 ? (
                          <span>With a <strong>Proficient score ({assessmentScore}%)</strong> in {assessmentSkill}, your foundations are verified. This waypoint bridges advanced component patterns and system gotchas.</span>
                        ) : (
                          <span>Based on your <strong>Foundational score ({assessmentScore}%)</strong> in {assessmentSkill}, this waypoint strengthens prerequisite concepts before tackling full-scale production modules.</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Waypoint Stepper Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (safeWaypointIndex > 0) {
                          const prevIdx = safeWaypointIndex - 1;
                          scrollToMilestone(activePathway.milestones[prevIdx].id, prevIdx);
                        }
                      }}
                      disabled={safeWaypointIndex === 0}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
                    >
                      ← Previous Stop
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await toggleMilestone(currentWaypoint.id, currentWaypoint.title);
                        if (safeWaypointIndex < activePathway.milestones.length - 1) {
                          const nextIdx = safeWaypointIndex + 1;
                          scrollToMilestone(activePathway.milestones[nextIdx].id, nextIdx);
                        }
                      }}
                      className={`rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition ${
                        isCurrentWaypointDone
                          ? "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {isCurrentWaypointDone ? "✓ Waypoint Cleared" : "Mark Cleared & Proceed → (+5 XP)"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (safeWaypointIndex < activePathway.milestones.length - 1) {
                          const nextIdx = safeWaypointIndex + 1;
                          scrollToMilestone(activePathway.milestones[nextIdx].id, nextIdx);
                        }
                      }}
                      disabled={safeWaypointIndex === activePathway.milestones.length - 1}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
                    >
                      Next Stop →
                    </button>
                  </div>
                </div>

                {/* Skills required at this waypoint */}
                <div className="mt-4 pt-4 border-t border-slate-200/60 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Required Skills:</span>
                  {currentWaypoint.skills.map((s) => (
                    <span key={s} className="rounded-md border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* 2. VISUAL NODE PROGRESSION GRAPH (roadmap.sh inspired layout) */}
        <div className="mt-10 space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Path Progression Nodes:
          </div>

          <div className="relative border-l-2 border-indigo-200 ml-4 pl-6 space-y-8">
            {activePathway.milestones.map((node, index) => {
              const isNodeDone = completedMilestones[node.id] || node.isCompleted;
              const safeWaypointIndex = Math.min(activeWaypointIndex, activePathway.milestones.length - 1);
              const isActiveWaypoint = index === safeWaypointIndex;

              return (
                <div key={node.id} id={`milestone-${node.id}`} className="relative group scroll-mt-24">
                  {/* Node Circle Indicator */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWaypointIndex(index);
                      toggleMilestone(node.id, node.title);
                    }}
                    title={isNodeDone ? "Mark as in-progress" : "Mark as completed (+5 XP)"}
                    className={`absolute -left-[35px] top-1.5 flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isNodeDone
                        ? "bg-emerald-600 text-white shadow-xs"
                        : isActiveWaypoint
                        ? "bg-indigo-600 text-white ring-4 ring-indigo-200 animate-pulse"
                        : node.stage === "SKILL_GAP"
                        ? "bg-amber-500 text-white ring-4 ring-amber-100"
                        : "border-2 border-indigo-500 bg-white text-indigo-600"
                    }`}
                  >
                    {isNodeDone ? "✓" : isActiveWaypoint ? "📍" : index + 1}
                  </button>

                  {/* Milestone Card */}
                  <div
                    onClick={() => setActiveWaypointIndex(index)}
                    className={`rounded-3xl border p-6 transition-all cursor-pointer ${
                      isActiveWaypoint
                        ? "border-indigo-500 bg-indigo-50/30 ring-2 ring-indigo-400 shadow-md"
                        : isNodeDone
                        ? "border-emerald-200 bg-emerald-50/20"
                        : node.stage === "SKILL_GAP"
                        ? "border-amber-200 bg-white shadow-md ring-1 ring-amber-100"
                        : node.stage === "TARGET"
                        ? "border-indigo-300 bg-gradient-to-r from-indigo-50/60 to-white shadow-sm"
                        : "border-slate-200 bg-white shadow-xs hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        {/* Stage Badges */}
                        <div className="flex items-center gap-2">
                          {isActiveWaypoint && (
                            <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                              📍 Current Navigation Waypoint
                            </span>
                          )}
                          {node.stage === "BASELINE" && (
                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              Current Baseline
                            </span>
                          )}
                          {node.stage === "SKILL_GAP" && (
                            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                              Identified Skill Gap
                            </span>
                          )}
                          {node.stage === "RECOMMENDED" && (
                            <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                              Recommended Step
                            </span>
                          )}
                          {node.stage === "CAPSTONE" && (
                            <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800">
                              Capstone Project
                            </span>
                          )}
                          {node.stage === "TARGET" && (
                            <span className="rounded bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                              Career Milestone
                            </span>
                          )}

                          {isNodeDone && (
                            <span className="text-[10px] font-semibold text-emerald-700">
                              (Completed)
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 text-base font-bold text-slate-900 sm:text-lg">
                          {node.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                          {node.description}
                        </p>
                      </div>

                      {/* Complete Checkbox Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleMilestone(node.id, node.title)}
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          isNodeDone
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                      >
                        <span>{isNodeDone ? "✓ Completed" : "Mark Done (+5 XP)"}</span>
                      </button>
                    </div>

                    {/* Skill Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {node.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Recommended Mentor Spotlight (Bridging the Gap) */}
                    {node.recommendedMentor && (
                      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5 sm:p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={node.recommendedMentor.avatar}
                              alt={node.recommendedMentor.name}
                              className="size-10 rounded-full object-cover border-2 border-white shadow-xs"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">
                                  {node.recommendedMentor.name}
                                </span>
                                <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-800">
                                  Top Mentor
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                {node.recommendedMentor.headline}
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/mentor/${node.recommendedMentor.id}`}
                            className="inline-flex h-9 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-bold text-white shadow-xs transition hover:bg-blue-600"
                          >
                            Book 1:1 Gap Session →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA to Explore Search / Mentors */}
        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <h3 className="text-xl font-bold text-slate-900">
            Ready to Bridge Your Skill Gaps?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-xs text-slate-600">
            SkillVerse peer mentors are ready to walk you through each node of your career roadmap.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/search"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-600"
            >
              Search All Mentors →
            </Link>
            <Link
              href="/assessment"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Take AI Skill Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
