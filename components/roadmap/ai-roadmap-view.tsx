"use client";

import React, { useState } from "react";
import Link from "next/link";
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

export type CareerPathway = {
  id: string;
  title: string;
  icon: string;
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
    icon: "💻",
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
        title: "🎯 Target Role Achieved: Full-Stack Engineer",
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
    icon: "🤖",
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
        title: "🎯 Target Role Achieved: AI / ML Engineer",
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
    icon: "🎨",
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
        title: "🎯 Target Role Achieved: Product Designer",
        description: "Ready for product design critiques, whiteboard design challenges, and portfolio reviews.",
        skills: ["Design Critique", "Portfolio Review"],
        resources: ["Product Design Interview Handbook"],
        isCompleted: false,
      },
    ],
  },
};

export default function AIRoadmapView() {
  const openLoginModal = useLoginModal();
  const { user } = useAuth();

  const [selectedPathwayKey, setSelectedPathwayKey] = useState<string>("fullstack");
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    "m-1": true,
    "m-ai-1": true,
    "m-ui-1": true,
  });

  const activePathway = CAREER_PATHWAYS[selectedPathwayKey] || CAREER_PATHWAYS.fullstack;

  const toggleMilestone = (id: string) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Progress metrics
  const totalMilestones = activePathway.milestones.length;
  const finishedCount = activePathway.milestones.filter(
    (m) => completedMilestones[m.id] || m.isCompleted
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

        {/* Header Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
            <span>🗺️ Visual Progression Pathway (roadmap.sh UX)</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            AI Career Roadmap & Skill Gap Analyzer
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Map your learning path: Current Baseline Skills → Identified Gaps → Recommended Mentors → Target Position.
          </p>
        </div>

        {/* 1. CAREER PATHWAY SELECTOR */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {Object.values(CAREER_PATHWAYS).map((path) => (
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
              <span className="text-2xl">{path.icon}</span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 sm:text-sm">{path.title}</h3>
                <p className="text-[11px] text-slate-500">{path.estimatedMonths}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Pathway Summary Card */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activePathway.icon}</span>
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

        {/* 2. VISUAL NODE PROGRESSION GRAPH (roadmap.sh inspired layout) */}
        <div className="mt-10 space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Path Progression Nodes:
          </div>

          <div className="relative border-l-2 border-indigo-200 ml-4 pl-6 space-y-8">
            {activePathway.milestones.map((node, index) => {
              const isNodeDone = completedMilestones[node.id] || node.isCompleted;

              return (
                <div key={node.id} className="relative group">
                  {/* Node Circle Indicator */}
                  <button
                    type="button"
                    onClick={() => toggleMilestone(node.id)}
                    title={isNodeDone ? "Mark as in-progress" : "Mark as completed"}
                    className={`absolute -left-[35px] top-1.5 flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isNodeDone
                        ? "bg-emerald-600 text-white shadow-xs"
                        : node.stage === "SKILL_GAP"
                        ? "bg-amber-500 text-white ring-4 ring-amber-100"
                        : "border-2 border-indigo-500 bg-white text-indigo-600"
                    }`}
                  >
                    {isNodeDone ? "✓" : index + 1}
                  </button>

                  {/* Milestone Card */}
                  <div
                    className={`rounded-3xl border p-6 transition-all ${
                      isNodeDone
                        ? "border-emerald-200 bg-emerald-50/20"
                        : node.stage === "SKILL_GAP"
                        ? "border-amber-200 bg-white shadow-md ring-1 ring-amber-100"
                        : node.stage === "TARGET"
                        ? "border-indigo-300 bg-gradient-to-r from-indigo-50/60 to-white shadow-sm"
                        : "border-slate-200 bg-white shadow-xs"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        {/* Stage Badges */}
                        <div className="flex items-center gap-2">
                          {node.stage === "BASELINE" && (
                            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              Current Baseline
                            </span>
                          )}
                          {node.stage === "SKILL_GAP" && (
                            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                              ⚠️ Identified Skill Gap
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
                        onClick={() => toggleMilestone(node.id)}
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          isNodeDone
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{isNodeDone ? "Completed" : "Mark as Done"}</span>
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
