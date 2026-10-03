"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { useAuth } from "@/components/auth/auth-context";

export type CommunityProject = {
  id: string;
  title: string;
  category: "Open Source" | "AI & Data" | "Web & Mobile" | "Design Systems" | "Research";
  status: "RECRUITING" | "IN_PROGRESS" | "COMPLETED";
  description: string;
  fullDetails: string;
  skillsNeeded: string[];
  teamHead: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  currentMembers: {
    name: string;
    role: string;
    avatar: string;
  }[];
  totalSlots: number;
  contactInfo: string;
  githubRepo?: string;
  postedDate: string;
};

export const INITIAL_PROJECTS_DATA: CommunityProject[] = [
  {
    id: "proj-mobile-app",
    title: "SkillVerse Mobile App (React Native & Expo)",
    category: "Web & Mobile",
    status: "RECRUITING",
    description: "Building an open-source cross-platform mobile app for real-time peer session reminders, meeting link launch, and 1-on-1 text chat.",
    fullDetails: "We are developing the companion mobile app for SkillVerse. The stack is React Native, Expo SDK 52, TypeScript, and NativeWind (Tailwind). We need 2 more frontend developers comfortable with navigation stacks and responsive mobile layouts.",
    skillsNeeded: ["React Native", "Expo", "TypeScript", "Tailwind CSS", "Mobile Navigation"],
    teamHead: {
      id: "head-rohan",
      name: "Rohan Kumar",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      role: "Lead Mobile Architect",
    },
    currentMembers: [
      {
        name: "Rohan Kumar",
        role: "Team Head",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Sneha Nair",
        role: "Frontend Dev",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Devon Vance",
        role: "Mobile Mentor",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
      },
    ],
    totalSlots: 5,
    contactInfo: "discord: @rohank_dev",
    githubRepo: "github.com/skillverse/mobile-app",
    postedDate: "2 days ago",
  },
  {
    id: "proj-rag-ai",
    title: "AI Knowledge Base & Semantic Search Engine",
    category: "AI & Data",
    status: "RECRUITING",
    description: "Collaborative research project creating an interactive semantic document search and question-answering tool for college curricula.",
    fullDetails: "Using FastAPI, LangChain, ChromaDB vector database, and Ollama/OpenAI embeddings to build a high-accuracy document retriever with source citation highlights. Looking for Python developers to build chunking pipelines and API endpoints.",
    skillsNeeded: ["Python", "FastAPI", "LangChain", "Vector DB", "Embeddings"],
    teamHead: {
      id: "head-ananya",
      name: "Ananya Roy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "AI Research Lead",
    },
    currentMembers: [
      {
        name: "Ananya Roy",
        role: "Team Head",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Varun George",
        role: "Data Engineer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      },
    ],
    totalSlots: 4,
    contactInfo: "email: ananya.roy@research.dev",
    githubRepo: "github.com/skillverse/rag-engine",
    postedDate: "3 days ago",
  },
  {
    id: "proj-design-system",
    title: "Clean Design System & Token UI Kit",
    category: "Design Systems",
    status: "RECRUITING",
    description: "Crafting a scalable, accessible component library and token architecture for student developer side projects.",
    fullDetails: "We are designing and documenting an accessible design system in Figma and Storybook. Focusing on WCAG 2.1 AA compliance, theme switching (dark/light mode), and reusable React compound components.",
    skillsNeeded: ["Figma", "Design Tokens", "Accessibility", "Storybook", "React"],
    teamHead: {
      id: "head-sarah",
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      role: "Design Lead",
    },
    currentMembers: [
      {
        name: "Sarah Jenkins",
        role: "Team Head",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      },
    ],
    totalSlots: 3,
    contactInfo: "figma: @sarah_ui",
    postedDate: "5 days ago",
  },
  {
    id: "proj-algos-visualizer",
    title: "Interactive Algorithm & Data Structure Visualizer",
    category: "Open Source",
    status: "RECRUITING",
    description: "Building an educational web tool that visualizes Graph traversals (Dijkstra, BFS/DFS) and Dynamic Programming state transitions in step-by-step 3D animations.",
    fullDetails: "Built with Next.js, Canvas/Three.js, and Tailwind CSS. The aim is to help students visually grasp algorithmic recurrence relations. Need 2 developers passionate about DSA and interactive web animations.",
    skillsNeeded: ["TypeScript", "Canvas / Three.js", "Algorithms", "DSA", "React"],
    teamHead: {
      id: "head-karthik",
      name: "Karthik Rajan",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      role: "Algorithm Contributor",
    },
    currentMembers: [
      {
        name: "Karthik Rajan",
        role: "Team Head",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Aditya Verma",
        role: "Frontend Dev",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
      },
    ],
    totalSlots: 4,
    contactInfo: "github: @karthik-algo",
    githubRepo: "github.com/skillverse/algo-visualizer",
    postedDate: "1 week ago",
  },
  {
    id: "proj-distributed-kv",
    title: "Lightweight Distributed Key-Value Store",
    category: "Research",
    status: "RECRUITING",
    description: "Implementing the Raft consensus algorithm in Go with gRPC communication, persistent write-ahead logging (WAL), and snapshotting.",
    fullDetails: "An educational systems project to implement consensus protocols from scratch. Perfect for students wanting to gain real systems programming and distributed systems experience.",
    skillsNeeded: ["Go", "gRPC", "Distributed Systems", "Raft", "Concurrency"],
    teamHead: {
      id: "head-priya",
      name: "Priya Sundaram",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
      role: "Backend Architect",
    },
    currentMembers: [
      {
        name: "Priya Sundaram",
        role: "Team Head",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Harish S.",
        role: "Systems Dev",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
      },
    ],
    totalSlots: 4,
    contactInfo: "email: priya@systems.dev",
    postedDate: "1 week ago",
  },
];

const CATEGORIES = [
  "All Projects",
  "Open Source",
  "AI & Data",
  "Web & Mobile",
  "Design Systems",
  "Research",
];

export default function CommunityProjectsView() {
  const openLoginModal = useLoginModal();
  const { user } = useAuth();

  const [projects, setProjects] = useState<CommunityProject[]>(INITIAL_PROJECTS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Projects");
  
  // Modals state
  const [selectedProjectForJoin, setSelectedProjectForJoin] = useState<CommunityProject | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [joinSkillSelected, setJoinSkillSelected] = useState("");
  const [joinRequestSent, setJoinRequestSent] = useState(false);

  // New project modal
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<CommunityProject["category"]>("Web & Mobile");
  const [newDescription, setNewDescription] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [newSlots, setNewSlots] = useState(4);
  const [newContact, setNewContact] = useState("");

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return projects.filter((proj) => {
      const matchesSearch =
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.description.toLowerCase().includes(q) ||
        proj.skillsNeeded.some((s) => s.toLowerCase().includes(q)) ||
        proj.teamHead.name.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === "All Projects" || proj.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [projects, searchQuery, selectedCategory]);

  const handleOpenJoinModal = (project: CommunityProject) => {
    if (!user) {
      openLoginModal();
      return;
    }
    setSelectedProjectForJoin(project);
    setJoinMessage("");
    setJoinSkillSelected(project.skillsNeeded[0] || "");
    setJoinRequestSent(false);
  };

  const handleSendJoinRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinRequestSent(true);
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openLoginModal();
      return;
    }

    const skillsArray = newSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const createdProject: CommunityProject = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      status: "RECRUITING",
      description: newDescription.trim(),
      fullDetails: newDescription.trim(),
      skillsNeeded: skillsArray.length > 0 ? skillsArray : ["React", "TypeScript"],
      teamHead: {
        id: user.id,
        name: user.name,
        avatar: user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: user.role === "MENTOR" ? "Mentor Lead" : "Project Lead",
      },
      currentMembers: [
        {
          name: user.name,
          role: "Team Head",
          avatar: user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        },
      ],
      totalSlots: Number(newSlots) || 4,
      contactInfo: newContact.trim() || user.email,
      postedDate: "Just now",
    };

    setProjects([createdProject, ...projects]);
    setIsCreatingProject(false);
    setNewTitle("");
    setNewDescription("");
    setNewSkills("");
    setNewContact("");
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
          <span className="text-slate-900 font-semibold">Community Projects</span>
        </div>

        {/* Header Title & Post CTA */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
              <span>🚀 Collaborative Peer Projects</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Community Project Board
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Find active team projects, contribute your technical skills, and build portfolio-ready software with peers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!user) openLoginModal();
              else setIsCreatingProject(true);
            }}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-600"
          >
            <span>+ Post a Project Idea</span>
          </button>
        </div>

        {/* SEARCH & CATEGORY BAR (Teachfloor style) */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by title, required skill, or team lead (e.g. React Native, Go, PyTorch)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
            <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Domain:
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

        {/* PROJECTS GRID */}
        <div className="mt-8">
          {filteredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const filledSlots = project.currentMembers.length;
                const progressPct = Math.min(100, Math.round((filledSlots / project.totalSlots) * 100));

                return (
                  <div
                    key={project.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                          {project.category}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                          Recruiting
                        </span>
                      </div>

                      {/* Project Title */}
                      <h3 className="mt-4 text-lg font-bold text-slate-900 leading-snug">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-600 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Team Head Bar */}
                      <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={project.teamHead.avatar}
                            alt={project.teamHead.name}
                            className="size-9 rounded-full object-cover border border-white shadow-xs"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{project.teamHead.name}</p>
                            <p className="text-[10px] font-medium text-slate-500">{project.teamHead.role}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">Team Head</span>
                      </div>

                      {/* Required Skills */}
                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Required Tech Stack:
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {project.skillsNeeded.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Team Slots Progress */}
                      <div className="mt-5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">Team Slots</span>
                          <span className="font-bold text-indigo-700">
                            {filledSlots} / {project.totalSlots} Filled
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>

                        {/* Member Avatars */}
                        <div className="mt-3 flex items-center gap-1.5">
                          {project.currentMembers.map((member, i) => (
                            <img
                              key={i}
                              src={member.avatar}
                              alt={member.name}
                              title={`${member.name} (${member.role})`}
                              className="size-6 rounded-full border-2 border-white object-cover shadow-xs"
                            />
                          ))}
                          {project.totalSlots - filledSlots > 0 && (
                            <span className="flex size-6 items-center justify-center rounded-full border border-dashed border-slate-300 text-[10px] font-bold text-slate-400">
                              +{project.totalSlots - filledSlots}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Posted {project.postedDate}</span>
                        {project.githubRepo && (
                          <span className="font-mono text-slate-600">{project.githubRepo}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenJoinModal(project)}
                        className="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white transition hover:bg-indigo-600"
                      >
                        Request to Join Team →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-base font-bold text-slate-900">No community projects found</p>
              <p className="mt-1 text-xs text-slate-500">
                Try searching with different keywords or post your own project idea!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* JOIN REQUEST MODAL (Requires Team Head Approval) */}
      {selectedProjectForJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Team Collaboration Request
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Join &quot;{selectedProjectForJoin.title}&quot;
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProjectForJoin(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {joinRequestSent ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg">
                  ✓
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">Join Request Submitted!</h3>
                <p className="mx-auto mt-2 max-w-sm text-xs text-slate-600 leading-relaxed">
                  Your request has been forwarded to <strong className="text-slate-800">{selectedProjectForJoin.teamHead.name}</strong> (Team Head) for review. You will receive an in-app notification once approved.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedProjectForJoin(null)}
                  className="mt-6 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendJoinRequest} className="mt-5 space-y-4">
                {/* Note about Team Head Approval */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
                  <span className="font-bold">Notice:</span> Joining requires approval from Team Head{" "}
                  <strong>{selectedProjectForJoin.teamHead.name}</strong>.
                </div>

                {/* Primary Skill to Contribute */}
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Which skill do you want to contribute?
                  </label>
                  <select
                    value={joinSkillSelected}
                    onChange={(e) => setJoinSkillSelected(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
                    required
                  >
                    {selectedProjectForJoin.skillsNeeded.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message to Team Head */}
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Brief intro / message for the Team Head
                  </label>
                  <textarea
                    rows={4}
                    value={joinMessage}
                    onChange={(e) => setJoinMessage(e.target.value)}
                    placeholder="Tell the Team Head why you'd like to collaborate, your availability, or share a link to your GitHub / portfolio..."
                    required
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectForJoin(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-600"
                  >
                    Submit Join Request →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* POST NEW PROJECT MODAL */}
      {isCreatingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Post a Collaboration Project</h2>
                <p className="text-xs text-slate-500">
                  Invite student peers and mentors to build software together.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingProject(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Project Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI-Powered Resume Parser in Python"
                  required
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Category / Domain</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CommunityProject["category"])}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Web & Mobile">Web & Mobile</option>
                  <option value="AI & Data">AI & Data</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Design Systems">Design Systems</option>
                  <option value="Research">Research</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Project Description & Goal</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain what problem this project solves and what you plan to build..."
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="e.g. Python, FastAPI, Docker, React"
                  required
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Total Team Slots</label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={newSlots}
                    onChange={(e) => setNewSlots(Number(e.target.value))}
                    required
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Contact / Discord</label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="discord or email"
                    className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingProject(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-600"
                >
                  Publish Project Board Post →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
