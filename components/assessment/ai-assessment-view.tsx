"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { useAuth } from "@/components/auth/auth-context";

export type Question = {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
};

export type SkillQuiz = {
  id: string;
  skillName: string;
  category: string;
  icon: string;
  difficulty: "Simple" | "Medium" | "Hard" | "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  description: string;
  questions: Question[];
};

export const QUIZ_BANK: Record<string, SkillQuiz> = {
  react: {
    id: "react",
    skillName: "React & Next.js Architecture",
    category: "Frontend",
    difficulty: "Medium",
    icon: "React",
    estimatedTime: "5 mins",
    description: "Evaluates state management, hooks lifecycle, server component boundaries, and performance optimization.",
    questions: [
      {
        id: 1,
        question: "When does useEffect execute in the React component lifecycle compared to useLayoutEffect?",
        options: [
          "useLayoutEffect runs asynchronously after paint; useEffect runs synchronously before paint",
          "useLayoutEffect runs synchronously after DOM mutations but before browser paint; useEffect runs asynchronously after paint",
          "Both run simultaneously in the microtask queue",
          "useEffect only runs on component unmount",
        ],
        correctIndex: 1,
        explanation: "useLayoutEffect fires synchronously after all DOM mutations but before the browser paints the screen, making it ideal for reading layout measurements.",
        topic: "Hooks Lifecycle",
      },
      {
        id: 2,
        question: "In Next.js App Router, which of the following is TRUE regarding Server Components?",
        options: [
          "Server Components can directly use useState and useEffect hooks",
          "Server Components have zero client-side JavaScript bundle footprint",
          "Server Components cannot fetch data asynchronously with async/await",
          "Server Components must always be marked with 'use client'",
        ],
        correctIndex: 1,
        explanation: "Server Components execute exclusively on the server and are streamed as static HTML/RSC payload, adding 0 KB of client-side JS bundle overhead.",
        topic: "Next.js App Router",
      },
      {
        id: 3,
        question: "What is the primary benefit of React's useCallback hook?",
        codeSnippet: `const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);`,
        options: [
          "It accelerates the computational execution of the wrapped function",
          "It caches the return value of an expensive calculation",
          "It preserves referential equality of the function instance between re-renders",
          "It automatically prevents child components from ever re-rendering",
        ],
        correctIndex: 2,
        explanation: "useCallback caches the function definition itself to maintain referential equality across renders, preventing unnecessary child re-renders when passed as props.",
        topic: "Performance & Memoization",
      },
      {
        id: 4,
        question: "How does React Fiber enable concurrent rendering features like Transitions and Suspense?",
        options: [
          "By utilizing multi-threaded CPU web workers for rendering",
          "By breaking rendering work into incremental units of fiber nodes that can be paused, resumed, or aborted",
          "By compiling JSX directly into WebAssembly binaries",
          "By avoiding DOM reconciliation entirely",
        ],
        correctIndex: 1,
        explanation: "The React Fiber reconciliation engine represents the component tree as a linked list of fiber units of work, enabling time-slicing and interruptible rendering.",
        topic: "React Internals & Fiber",
      },
      {
        id: 5,
        question: "In Zustand or Redux state management, why is state immutability strictly enforced?",
        options: [
          "To allow shallow reference comparison (prev !== next) for fast change detection and predictable selector updates",
          "Because JavaScript forbids mutation of Object.freeze objects",
          "To reduce memory usage across browser tabs",
          "Because immutable data runs faster in single-core CPUs",
        ],
        correctIndex: 0,
        explanation: "Immutability allows state stores to detect changes with O(1) shallow reference checks instead of expensive deep object equality comparisons.",
        topic: "State Management Architecture",
      },
    ],
  },
  python: {
    id: "python",
    skillName: "Python & Applied AI",
    category: "Backend & AI",
    difficulty: "Hard",
    icon: "PY",
    estimatedTime: "5 mins",
    description: "Evaluates Python data structures, decorators, generators, tensor operations, and API modeling.",
    questions: [
      {
        id: 1,
        question: "What is the primary difference between a Python Generator function (using yield) and a standard function returning a list?",
        options: [
          "Generators execute on a separate thread",
          "Generators produce items lazily on-demand with O(1) memory instead of allocating the entire collection in RAM",
          "Generators cannot be iterated with for loops",
          "Generators run faster for small collections under 10 elements",
        ],
        correctIndex: 1,
        explanation: "Generators use lazy evaluation, retaining their execution frame and yielding one value at a time, resulting in significant memory savings on large datasets.",
        topic: "Generators & Memory Efficiency",
      },
      {
        id: 2,
        question: "In Python's asyncio event loop, what happens when a blocking CPU-bound function is executed directly with await?",
        options: [
          "Asyncio automatically converts it into a multi-process worker",
          "It halts and blocks the entire single-threaded event loop, delaying all other pending coroutines",
          "It throws a CoroutineBlockedException",
          "It spawns a background greenlet",
        ],
        correctIndex: 1,
        explanation: "Asyncio runs on a single thread. Calling a synchronous blocking call freezes the event loop until completion. CPU-bound work should use run_in_executor.",
        topic: "Asyncio & Concurrency",
      },
      {
        id: 3,
        question: "In PyTorch or NumPy, what is the effect of tensor broadcasting?",
        options: [
          "It copies tensor arrays across GPU clusters over the network",
          "It automatically stretches compatible smaller dimensions without allocating duplicated memory",
          "It quantizes float32 weights into int8",
          "It computes backward gradients automatically",
        ],
        correctIndex: 1,
        explanation: "Broadcasting enables element-wise operations on arrays of different shapes by treating them as if they had matching shapes without actual data duplication.",
        topic: "Tensors & Vectorization",
      },
      {
        id: 4,
        question: "What is the role of Python's Global Interpreter Lock (GIL)?",
        options: [
          "It restricts Python from opening more than 1024 file descriptors",
          "It prevents multiple native threads from executing Python bytecodes simultaneously in CPython",
          "It encrypts variables in memory",
          "It manages garbage collection for circular references",
        ],
        correctIndex: 1,
        explanation: "The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing CPython bytecodes at once.",
        topic: "CPython & Threading",
      },
      {
        id: 5,
        question: "What is the main advantage of Pydantic models in FastAPI applications?",
        options: [
          "Automatic runtime data validation, parsing, and type-safe schema generation",
          "Compiling Python code into C extensions",
          "Automatically provisioning PostgreSQL tables",
          "Eliminating all HTTP latency",
        ],
        correctIndex: 0,
        explanation: "Pydantic provides robust type coercion, validation errors, and OpenAPI schema generation for incoming request payloads.",
        topic: "FastAPI & Type Safety",
      },
    ],
  },
  dsa: {
    id: "dsa",
    skillName: "Data Structures & Algorithms",
    category: "Computer Science",
    difficulty: "Medium",
    icon: "DSA",
    estimatedTime: "5 mins",
    description: "Evaluates asymptotic complexity, graph traversals, dynamic programming, and binary trees.",
    questions: [
      {
        id: 1,
        question: "What is the worst-case time complexity of searching for a key in an unbalanced Binary Search Tree vs an AVL Tree?",
        options: [
          "Unbalanced BST: O(N) | AVL Tree: O(log N)",
          "Unbalanced BST: O(log N) | AVL Tree: O(1)",
          "Both are always guaranteed O(1)",
          "Unbalanced BST: O(N log N) | AVL Tree: O(N)",
        ],
        correctIndex: 0,
        explanation: "In an unbalanced BST, elements can degenerate into a linked list giving O(N) worst-case time. Self-balancing AVL trees maintain O(log N) height.",
        topic: "Trees & Balancing",
      },
      {
        id: 2,
        question: "Which algorithm is best suited for finding the shortest path in a weighted graph with non-negative edge weights?",
        options: [
          "Floyd-Warshall Algorithm",
          "Dijkstra's Algorithm with a Min-Heap Priority Queue",
          "Breadth-First Search (BFS)",
          "Tarjan's Strongly Connected Components",
        ],
        correctIndex: 1,
        explanation: "Dijkstra's algorithm with a min-heap operates in O((V + E) log V) time for non-negative edge weights.",
        topic: "Graph Algorithms",
      },
      {
        id: 3,
        question: "What distinguishes Dynamic Programming from standard Divide and Conquer?",
        options: [
          "Dynamic programming only works on strings",
          "Dynamic programming solves overlapping subproblems by memoizing subproblem solutions to prevent redundant work",
          "Divide and conquer uses more memory than dynamic programming",
          "There is no difference between them",
        ],
        correctIndex: 1,
        explanation: "Dynamic programming applies when subproblems overlap and exhibits optimal substructure, caching intermediate results in a table.",
        topic: "Dynamic Programming",
      },
      {
        id: 4,
        question: "What is the average time complexity of inserting an item into a Hash Map with a good hash function?",
        options: ["O(log N)", "O(1)", "O(N)", "O(N^2)"],
        correctIndex: 1,
        explanation: "A well-distributed hash function distributes keys evenly across buckets, giving O(1) average constant time for insertion and lookup.",
        topic: "Hashing & Lookup",
      },
      {
        id: 5,
        question: "Which data structure is fundamentally utilized to detect cycles in a directed graph using Kahn's algorithm (Topological Sort)?",
        options: [
          "A Queue tracking nodes with in-degree = 0",
          "A Max-Heap of edge weights",
          "A doubly-linked list",
          "A Bloom Filter",
        ],
        correctIndex: 0,
        explanation: "Kahn's algorithm calculates in-degrees of all vertices and processes nodes with in-degree 0 using a queue. If processed count < total vertices, a cycle exists.",
        topic: "Topological Sort & Cycles",
      },
    ],
  },
  mentor_accreditation: {
    id: "mentor_accreditation",
    skillName: "Mentor Technical & Pedagogy Accreditation",
    category: "Mentorship",
    difficulty: "Hard",
    icon: "Mentor",
    estimatedTime: "5 mins",
    description: "Evaluates system architecture, code review rigor, debugging guidance, and pedagogical mentorship ability. Determines your official Mentor Level & Public Rating.",
    questions: [
      {
        id: 1,
        question: "A mentee reports that their API queries take 4+ seconds under concurrent traffic. What is the most architecturally sound mentorship guidance?",
        options: [
          "Instruct them to increase server RAM without inspecting the database logs",
          "Analyze query execution plans (EXPLAIN ANALYZE), ensure composite indexes cover foreign keys, and integrate connection pooling or Redis caching",
          "Switch immediately to MongoDB because NoSQL is always faster than PostgreSQL",
          "Wrap the database query inside a setTimeout to simulate async processing",
        ],
        correctIndex: 1,
        explanation: "Senior mentors guide students to systematically identify bottlenecks with query execution profiling (EXPLAIN ANALYZE), index optimization, and connection pooling rather than blindly scaling hardware.",
        topic: "Database Architecture & Optimization",
      },
      {
        id: 2,
        question: "During a code review, a mentee submits a React component with state passed down 7 nested layers and heavy useEffect dependencies causing infinite re-renders. How should you guide them?",
        options: [
          "Tell them to remove all useEffect dependency arrays to disable re-running",
          "Explain the root cause of referential instability, then guide them to refactor using component composition or lightweight centralized state (Zustand/Context)",
          "Advise them to rewrite the entire project in vanilla jQuery",
          "Tell them to suppress ESLint react-hooks/exhaustive-deps warnings everywhere",
        ],
        correctIndex: 1,
        explanation: "Constructive mentorship explains referential equality in dependency arrays and teaches component composition or modern state stores to permanently eliminate prop drilling.",
        topic: "Pedagogy & Clean Code Review",
      },
      {
        id: 3,
        question: "A mentee's Node.js backend is crashing with 'JavaScript heap out of memory' in production. How do you teach them to diagnose the root cause?",
        options: [
          "Teach them to take and compare V8 heap snapshots in Chrome DevTools to locate uncollected event listeners or unbounded caching arrays",
          "Tell them to restart the server every 10 minutes using a cron job",
          "Increase max_old_space_size indefinitely without investigating object retention",
          "Tell them garbage collection always takes care of everything and memory leaks cannot happen in JavaScript",
        ],
        correctIndex: 0,
        explanation: "Effective technical mentors teach students memory profiling with heap snapshot comparison to find retained memory structures such as orphaned event listeners or cache maps.",
        topic: "Production Diagnostics & Debugging",
      },
      {
        id: 4,
        question: "During a project audit, you spot a mentee constructing database queries with template literal string concatenation: `SELECT * FROM users WHERE email = '${email}'`. What is the correct response?",
        options: [
          "Approve the code if they wrapped it in a try/catch block",
          "Highlight the severe SQL Injection vulnerability, demonstrate how malicious inputs hijack the query, and mandate parameterized queries or Prisma ORM",
          "Suggest encoding the string to Base64 to make it secure",
          "Ignore it since it's just a student demo project",
        ],
        correctIndex: 1,
        explanation: "Mentors uphold security integrity: SQL concatenation is a critical SQLi risk. Guiding them to parameterized queries and ORMs instills production security habits.",
        topic: "Security Standards & Defense",
      },
      {
        id: 5,
        question: "A beginner mentee feels overwhelmed trying to learn microservices, Kubernetes, and Kafka simultaneously. How should a top mentor structure their roadmap?",
        options: [
          "Force them to build a Kubernetes cluster first before understanding basic HTTP",
          "Deconstruct their roadmap: first master modular monolith principles, REST/HTTP status codes, and relational data modeling before introducing containerization and asynchronous message queues",
          "Tell them full-stack development is too hard and they should give up",
          "Have them copy-paste Terraform templates without understanding the components",
        ],
        correctIndex: 1,
        explanation: "Top-tier mentors scaffold learning by grounding students in core fundamentals (modular architectures, clean REST, relational schemas) before introducing distributed systems complexity.",
        topic: "Mentee Roadmapping & Scaffolding",
      },
    ],
  },
};

export default function AIAssessmentView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openLoginModal = useLoginModal();
  const { user, refreshUser } = useAuth();

  const isMentor = user?.role === "MENTOR";

  const initialQuizParam = searchParams.get("quiz");
  const initialSkillParam = searchParams.get("skill");
  const initialRoleParam = searchParams.get("role");
  const initialTierParam = searchParams.get("difficulty") || searchParams.get("level");

  const defaultQuiz = initialQuizParam && QUIZ_BANK[initialQuizParam]
    ? initialQuizParam
    : isMentor
    ? "mentor_accreditation"
    : "react";

  const [selectedQuizKey, setSelectedQuizKey] = useState<string>(defaultQuiz);
  const [currentStep, setCurrentStep] = useState<"SELECT" | "QUIZ" | "RESULT">("SELECT");
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingUrl, setNavigatingUrl] = useState<string | null>(null);
  const [navigatingCareerTitle, setNavigatingCareerTitle] = useState<string>("Full-Stack Software Engineer");
  const [evaluatedScore, setEvaluatedScore] = useState<number>(0);

  // Target Role for AI Assessment (Supports ANY Job Position, e.g. Developer, Digital Marketer, etc.)
  const [targetRole, setTargetRole] = useState<string>(
    initialRoleParam || user?.profile?.careerGoal || (isMentor ? "Technical Mentor" : "Full-Stack Software Engineer")
  );

  // 3 Dynamic Difficulty Tiers: Simple, Medium, Hard
  const [difficultyTier, setDifficultyTier] = useState<"SIMPLE" | "MEDIUM" | "HARD">(() => {
    if (initialTierParam) {
      const upper = initialTierParam.toUpperCase();
      if (upper === "SIMPLE" || upper === "MEDIUM" || upper === "HARD") {
        return upper;
      }
    }
    return "MEDIUM";
  });

  // Profile-based skill selection
  const [selectedSkillOverride, setSelectedSkillOverride] = useState<string | null>(null);
  const profileSkills = user?.profile?.skills || [];
  const chosenSkill =
    selectedSkillOverride ??
    (initialSkillParam || profileSkills[0] || (isMentor ? "System Architecture" : "React"));
  const setChosenSkill = (skill: string) => setSelectedSkillOverride(skill);
  const [customSkillInput, setCustomSkillInput] = useState<string>("");
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Mentor Result State
  const [mentorLevelResult, setMentorLevelResult] = useState<{
    level: string;
    tier: string;
    rating: number;
    description: string;
  } | null>(null);

  // History state
  const [historyList, setHistoryList] = useState<Array<{
    id: string;
    skillName: string;
    score: number;
    isVerified: boolean;
    feedback: string;
    createdAt: string;
  }>>([]);

  const [customQuizBank, setCustomQuizBank] = useState<Record<string, SkillQuiz>>({});

  const allQuizzes = useMemo(() => ({
    ...QUIZ_BANK,
    ...customQuizBank,
  }), [customQuizBank]);

  const activeQuiz = allQuizzes[selectedQuizKey] || (isMentor ? QUIZ_BANK.mentor_accreditation : QUIZ_BANK.react);
  const currentQuestion = activeQuiz.questions[questionIndex];

  // Fetch assessment history
  useEffect(() => {
    let ignore = false;
    async function loadHistory() {
      if (!user) return;
      try {
        const res = await fetch("/api/assessment/history");
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setHistoryList(data.assessments || []);
          }
        }
      } catch {
        // ignore
      }
    }
    loadHistory();
    return () => {
      ignore = true;
    };
  }, [user]);

  // Handle Dynamic Profile-Based Quiz Generation
  const handleGenerateProfileQuiz = useCallback(async (targetSkill: string, overrideRole?: string) => {
    const skillToEvaluate = targetSkill.trim();
    if (!skillToEvaluate) return;
    const effectiveRole = (overrideRole || targetRole).trim();

    try {
      setIsGeneratingQuiz(true);
      setGenerateError(null);

      const res = await fetch("/api/ai/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill: skillToEvaluate,
          difficulty: difficultyTier,
          role: effectiveRole,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.quiz) {
        setGenerateError(data.error || "Failed to generate assessment. Please try again.");
        return;
      }

      type ApiQuizQuestion = {
        id: number;
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
      };

      const key = `groq-${Date.now()}`;
      const diffLabel = difficultyTier === "SIMPLE" ? "Simple" : difficultyTier === "HARD" ? "Hard" : "Medium";
      const formattedQuiz: SkillQuiz = {
        id: key,
        skillName: data.quiz.skillName,
        category: effectiveRole || (isMentor ? "Mentor Pedagogy" : "Role-Aligned Evaluation"),
        icon: isMentor ? "Mentor" : "Skill",
        difficulty: diffLabel,
        estimatedTime: "5 mins",
        description: isMentor
          ? `Mentor Competency & Accreditation Assessment in ${data.quiz.skillName} (${diffLabel} Level).`
          : `AI Role-Aligned Assessment for "${effectiveRole}" in ${data.quiz.skillName} (${diffLabel} Level).`,
        questions: (data.quiz.questions as ApiQuizQuestion[]).map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctIndex: q.correctAnswer,
          explanation: q.explanation,
          topic: data.quiz.skillName,
        })),
      };

      setCustomQuizBank((prev) => ({ ...prev, [key]: formattedQuiz }));
      setSelectedQuizKey(key);
      setQuestionIndex(0);
      setAnswers({});
      setXpAwarded(null);
      setSubmitMessage(null);
      setIsNavigating(false);
      setNavigatingUrl(null);
      setCurrentStep("QUIZ");
    } catch {
      setGenerateError("Network error while communicating with AI evaluation engine.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  }, [difficultyTier, isMentor, targetRole]);

  const handleStartPresetQuiz = (quizKey: string) => {
    setSelectedQuizKey(quizKey);
    setQuestionIndex(0);
    setAnswers({});
    setXpAwarded(null);
    setSubmitMessage(null);
    setIsNavigating(false);
    setNavigatingUrl(null);
    setCurrentStep("QUIZ");
  };

  const handleSelectOption = (optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    let correctCount = 0;
    activeQuiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    const isVerified = percentage >= 60;

    // A. MENTOR EVALUATION TRACK
    if (isMentor) {
      let level = "Apprentice Mentor";
      let tier = "Tier 4: In Training / Accreditation Pending";
      let rating = 3.8;
      let desc = "Below the 60% threshold. Strengthen architectural patterns and retake to earn official accreditation.";

      if (percentage >= 90) {
        level = "Master Mentor";
        tier = "Tier 1: Principal Architect & Capstone Lead";
        rating = 5.0;
        desc = "Elite technical mastery. Certified to lead complex system design evaluations, capstone reviews, and masterclass sessions.";
      } else if (percentage >= 75) {
        level = "Senior Mentor";
        tier = "Tier 2: Advanced Systems & Code Reviewer";
        rating = 4.8;
        desc = "Strong architectural competence and pedagogy. Certified for deep-dive code reviews, full-stack debugging, and interview prep.";
      } else if (percentage >= 60) {
        level = "Associate Mentor";
        tier = "Tier 3: Core Foundations Guide";
        rating = 4.5;
        desc = "Solid technical baseline. Certified for foundational tutoring, concept walkthroughs, and beginner debugging assistance.";
      }

      setMentorLevelResult({ level, tier, rating, description: desc });
      setEvaluatedScore(percentage);
      setCurrentStep("RESULT");

      if (user) {
        try {
          const res = await fetch("/api/mentor/assessment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score: percentage }),
          });
          const data = await res.json();
          if (res.ok) {
            if (data.xpAwarded && data.xpAwarded > 0) {
              setXpAwarded(data.xpAwarded);
            }
            setSubmitMessage(data.message || `Official Mentor Level set to "${level}" (${rating}★)!`);
            await refreshUser();
          }
        } catch (err) {
          console.error("Failed to save mentor assessment:", err);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
      return;
    }

    // B. STUDENT EVALUATION TRACK
    const calculatedLevel =
      percentage >= 80 ? "Expert / Advanced" : percentage >= 60 ? "Proficient Practitioner" : "Foundational Learner";
    const feedback = `${calculatedLevel}: ${correctCount}/${activeQuiz.questions.length} correct (${percentage}%)`;

    const matchedPathway =
      activeQuiz.skillName.toLowerCase().includes("python") || activeQuiz.skillName.toLowerCase().includes("ai")
        ? "aiml"
        : "fullstack";
    const careerTitle = matchedPathway === "aiml" ? "AI & Machine Learning Engineer" : "Full-Stack Software Engineer";
    const roadmapUrl = `/roadmap?fromAssessment=1&quiz=${selectedQuizKey}&score=${percentage}&skill=${encodeURIComponent(activeQuiz.skillName)}&level=${encodeURIComponent(calculatedLevel)}&verified=${isVerified ? "1" : "0"}&career=${matchedPathway}`;

    setEvaluatedScore(percentage);
    setNavigatingCareerTitle(careerTitle);
    setNavigatingUrl(roadmapUrl);
    setIsNavigating(true);
    setCurrentStep("RESULT");

    if (user) {
      try {
        const res = await fetch("/api/assessment/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: selectedQuizKey,
            skillName: activeQuiz.skillName,
            score: percentage,
            isVerified,
            feedback,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          if (data.xpAwarded && data.xpAwarded > 0) {
            setXpAwarded(data.xpAwarded);
          }
          setSubmitMessage(data.message || "Skill assessment recorded to your profile!");
          await refreshUser();
          if (data.assessment) {
            setHistoryList((prev) => [data.assessment, ...prev]);
          }
        }
      } catch (err) {
        console.error("Failed to save student assessment:", err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }

    // Direct navigation for students
    setTimeout(() => {
      router.push(roadmapUrl);
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (questionIndex < activeQuiz.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const handlePrevQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
    }
  };

  // Score stats calculation
  const scoreResult = useMemo(() => {
    let correctCount = 0;
    activeQuiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    let level: "Expert / Advanced" | "Proficient Practitioner" | "Foundational Learner" = "Foundational Learner";
    let badgeEarned = false;

    if (percentage >= 80) {
      level = "Expert / Advanced";
      badgeEarned = true;
    } else if (percentage >= 60) {
      level = "Proficient Practitioner";
      badgeEarned = true;
    }

    return {
      correctCount,
      totalCount: activeQuiz.questions.length,
      percentage,
      level,
      badgeEarned,
    };
  }, [activeQuiz, answers]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-5 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">
              {isMentor ? "Mentor AI Accreditation" : "Skill Assessment & Verification"}
            </span>
          </div>

          {isMentor && (
            <Link
              href="/mentor/dashboard"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Mentor Studio</span>
              <span>→</span>
            </Link>
          )}
        </div>

        {/* Student Direct Navigation Overlay Modal */}
        {!isMentor && isNavigating && navigatingUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fade-in">
            <div className="w-full max-w-md rounded-3xl border border-indigo-200 bg-white p-7 text-center shadow-2xl">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-indigo-600 text-white text-3xl shadow-lg">
                🧭
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-200">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-bold text-emerald-800">
                  Score Evaluated: {evaluatedScore}%
                </span>
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-slate-900">
                Calibrating Your Career Path...
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Routing directly to the <strong>{navigatingCareerTitle}</strong> roadmap with waypoints calibrated to your test results.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => router.push(navigatingUrl)}
                  className="w-full rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition"
                >
                  Go Directly to Career Path Navigation →
                </button>
                <button
                  type="button"
                  onClick={() => setIsNavigating(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Stay on Question Breakdown
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. SELECTION SCREEN (Completely Separate for Mentor vs Student) */}
        {/* ======================================================== */}
        {currentStep === "SELECT" && (
          <div className="space-y-8">
            {isMentor ? (
              /* ==================================================== */
              /* BRANCH A: MENTOR ACCREDITATION & RATING PORTAL        */
              /* ==================================================== */
              <div className="space-y-8">
                {/* Mentor Header */}
                <div className="rounded-3xl border border-amber-300 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-7 sm:p-9 text-white shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-0.5 text-[11px] font-bold tracking-wider uppercase text-amber-300">
                          👑 Mentor Accreditation Portal
                        </span>
                        {user?.profile?.mentorScore && (
                          <span className="text-xs text-indigo-200 font-semibold">
                            Score: {user.profile.mentorScore}%
                          </span>
                        )}
                      </div>

                      <h1 className="mt-3 text-2xl sm:text-3xl font-black text-white">
                        AI Mentor Competency & Rating Evaluation
                      </h1>

                      <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                        Evaluate your technical code review rigor, architecture guidance, and mentoring pedagogy.
                        Your score determines your official <strong>Mentor Accreditation Level</strong> and public credibility rating visible to students.
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                          Current Level:{" "}
                          <span className="text-amber-300">
                            {user?.profile?.mentorLevel || "Pending Accreditation"}
                          </span>
                        </span>
                        {user?.profile?.mentorScore && (
                          <span className="rounded-full bg-amber-400/20 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
                            ★ {user.profile.mentorScore >= 90 ? "5.0" : user.profile.mentorScore >= 75 ? "4.8" : "4.5"} Official Rating
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
                        href="/mentor/dashboard"
                        className="rounded-xl bg-amber-400 hover:bg-amber-300 px-5 py-3 text-xs font-black text-slate-950 shadow-md text-center transition hover:scale-[1.02]"
                      >
                        Manage Mentor Skill Ads →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Profile-Based Mentor Skill & 3-Tier Selector */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                      Profile-Grounded Evaluation
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      Select Expertise from Your Mentor Profile
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Choose which domain from your verified profile you want to be evaluated on for code review and mentoring competency.
                    </p>
                  </div>

                  {/* Profile Skills Chips */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Your Mentor Profile Skills:
                    </label>
                    {profileSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileSkills.map((sk) => (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => {
                              setChosenSkill(sk);
                              setCustomSkillInput("");
                            }}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition border ${
                              chosenSkill === sk && !customSkillInput
                                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            ✓ {sk}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-center justify-between">
                        <span>No skills added to your profile yet.</span>
                        <Link href="/profile" className="font-bold underline">
                          Add Skills in Profile →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Custom Domain Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Or Evaluate a Specialized Mentorship Domain:
                    </label>
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => {
                        setCustomSkillInput(e.target.value);
                        setChosenSkill(e.target.value);
                      }}
                      placeholder="e.g. System Design, Distributed Systems, Cloud Architecture, FastAPI..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  {/* 3 Dynamic Difficulty Tiers for Mentors */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Choose Evaluation Tier (Simple / Medium / Hard):
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => setDifficultyTier("SIMPLE")}
                        className={`rounded-2xl border p-4 text-left transition ${
                          difficultyTier === "SIMPLE"
                            ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-100"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">Simple Tier</span>
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                            Associate Guide
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                          Core concept clarity, beginner scaffolding, and diagnosing elementary syntax mistakes.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDifficultyTier("MEDIUM")}
                        className={`rounded-2xl border p-4 text-left transition ${
                          difficultyTier === "MEDIUM"
                            ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-100"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">Medium Tier</span>
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                            Senior Mentor
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                          Practical code reviews, identifying junior anti-patterns, refactoring, and debugging.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDifficultyTier("HARD")}
                        className={`rounded-2xl border p-4 text-left transition ${
                          difficultyTier === "HARD"
                            ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-100"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">Hard Tier</span>
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800">
                            Master Architect
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                          Distributed systems, concurrency & memory leaks, capstone audits, and executive strategy.
                        </p>
                      </button>
                    </div>
                  </div>

                  {generateError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                      {generateError}
                    </div>
                  )}

                  {/* Launch Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleGenerateProfileQuiz(chosenSkill)}
                      disabled={isGeneratingQuiz || !chosenSkill.trim()}
                      className="w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs font-bold text-white shadow-xs transition hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isGeneratingQuiz ? (
                        <>
                          <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Generating Dynamic Mentor Quiz with Groq...</span>
                        </>
                      ) : (
                        <>
                          <span>⚡ Start Mentor Accreditation Test ({chosenSkill})</span>
                          <span>→</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartPresetQuiz("mentor_accreditation")}
                      className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-xs font-bold text-slate-700 transition"
                    >
                      Take Standard System Decider Test
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ==================================================== */
              /* BRANCH B: STUDENT SKILL ASSESSMENT & VERIFICATION    */
              /* ==================================================== */
              <div className="space-y-8">
                {/* Student Header */}
                <div className="text-center max-w-2xl mx-auto">
                  <span className="rounded-full bg-blue-100 border border-blue-200 px-3 py-1 text-[11px] font-bold text-blue-800 uppercase tracking-wide">
                    ✦ Student Skill Verification
                  </span>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mt-3">
                    Test & Verify Your Technical Skills
                  </h1>
                  <p className="mt-2 text-sm text-slate-600">
                    Take adaptive 5-question technical quizzes tailored directly to your profile.
                    Score 60%+ to earn an <strong>AI-Verified Badge</strong> and calibrate your personalized career roadmap.
                  </p>
                </div>

                {/* Profile-Based Assessment Generator */}
                <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-white p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                        Profile-Grounded Generator
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Groq LLaMA-3.3 70B</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      Assess Skills from Your Learning Profile
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select one of your profile skills to generate an adaptive evaluation, or type any new topic.
                    </p>
                  </div>

                  {/* Profile Skills Pills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Skills Listed on Your Profile:
                    </label>
                    {profileSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileSkills.map((sk) => (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => {
                              setChosenSkill(sk);
                              setCustomSkillInput("");
                            }}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition border ${
                              chosenSkill === sk && !customSkillInput
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            ✓ {sk}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-blue-50/80 border border-blue-200 p-3 text-xs text-blue-900 flex items-center justify-between">
                        <span>No skills added to your profile yet.</span>
                        <Link href="/profile" className="font-bold underline">
                          Add Skills in Profile →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Target Role Selector (Allows ANY Job Position: Developer, Digital Marketer, UI/UX, etc.) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Career Role / Job Position:
                    </label>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Groq AI aligns scenarios, real-world constraints, and questions to this specific role.
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {[
                        "Full-Stack Software Engineer",
                        "Digital Marketer & Growth Strategist",
                        "UI/UX Product Designer",
                        "Data Analyst & BI Specialist",
                        "Cyber Security Analyst",
                        "Product Manager",
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setTargetRole(preset)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition border ${
                            targetRole === preset
                              ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="Or type ANY custom role: e.g. Content Marketer, DevOps Engineer, Cloud Architect..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  {/* Custom Topic Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700">
                      Or Type Any Other Technology / Concept:
                    </label>
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => {
                        setCustomSkillInput(e.target.value);
                        setChosenSkill(e.target.value);
                      }}
                      placeholder="e.g. TypeScript, React Hooks, PostgreSQL, Docker, PyTorch, SEO Strategy..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  {/* 3 Difficulty Levels: Simple, Medium, Hard */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Select Assessment Difficulty:
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => setDifficultyTier("SIMPLE")}
                        className={`rounded-2xl border p-4 text-left transition ${
                          difficultyTier === "SIMPLE"
                            ? "border-indigo-600 bg-white shadow-xs ring-2 ring-indigo-100"
                            : "border-slate-200 bg-white/70 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">Simple</span>
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                            Foundations
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                          Core language fundamentals, essential syntax, primary definitions without tricky edge cases.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDifficultyTier("MEDIUM")}
                        className={`rounded-2xl border p-4 text-left transition ${
                          difficultyTier === "MEDIUM"
                            ? "border-indigo-600 bg-white shadow-xs ring-2 ring-indigo-100"
                            : "border-slate-200 bg-white/70 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">Medium</span>
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                            Applied
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                          Practical scenario problem solving, asynchronous data flow, and standard real-world bugs.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDifficultyTier("HARD")}
                        className={`rounded-2xl border p-4 text-left transition ${
                          difficultyTier === "HARD"
                            ? "border-indigo-600 bg-white shadow-xs ring-2 ring-indigo-100"
                            : "border-slate-200 bg-white/70 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">Hard</span>
                          <span className="rounded bg-purple-100 px-2 py-0.5 text-[9px] font-bold text-purple-700">
                            Advanced
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                          Deep framework internals, concurrency, memory profiling, and production architecture trade-offs.
                        </p>
                      </button>
                    </div>
                  </div>

                  {generateError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                      {generateError}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleGenerateProfileQuiz(chosenSkill)}
                      disabled={isGeneratingQuiz || !chosenSkill.trim()}
                      className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-xs font-bold text-white shadow-xs transition hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isGeneratingQuiz ? (
                        <>
                          <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Generating Dynamic Quiz with Groq...</span>
                        </>
                      ) : (
                        <>
                          <span>⚡ Generate & Take AI Quiz ({chosenSkill} • {targetRole})</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Curated Pre-set Core Tracks */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Or Choose Standard Curriculum Quizzes:
                  </h3>
                  <div className="grid gap-6 md:grid-cols-3">
                    {Object.values(QUIZ_BANK)
                      .filter((q) => q.id !== "mentor_accreditation")
                      .map((quiz) => (
                        <div
                          key={quiz.id}
                          className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-400 hover:shadow-indigo-50 transition"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="flex h-8 items-center justify-center rounded-lg bg-slate-100 px-2.5 font-mono text-xs font-bold text-slate-800">
                                {quiz.icon}
                              </span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                                {quiz.difficulty}
                              </span>
                            </div>

                            <h4 className="mt-4 text-base font-bold text-slate-900">{quiz.skillName}</h4>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                              {quiz.description}
                            </p>

                            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                              <span>5 Questions</span>
                              <span>•</span>
                              <span>{quiz.estimatedTime}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleStartPresetQuiz(quiz.id)}
                            className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-slate-900 hover:bg-indigo-600 text-xs font-bold text-white shadow-xs transition"
                          >
                            Start Assessment →
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Assessment History Section */}
            {historyList.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Your Past Assessment Attempts</h3>
                  <span className="text-xs text-slate-500">{historyList.length} recorded</span>
                </div>
                <div className="mt-4 divide-y divide-slate-100">
                  {historyList.map((item) => {
                    const matchedCareer = item.skillName.toLowerCase().includes("python") ? "aiml" : "fullstack";
                    return (
                      <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className={`size-2.5 rounded-full ${item.isVerified ? "bg-emerald-500" : "bg-amber-500"}`} />
                          <div>
                            <p className="font-bold text-slate-900">{item.skillName}</p>
                            <p className="text-[11px] text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-slate-900">{item.score}%</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            item.isVerified ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                          }`}>
                            {item.isVerified ? "Verified" : "Unverified"}
                          </span>
                          {!isMentor && (
                            <Link
                              href={`/roadmap?fromAssessment=1&skill=${encodeURIComponent(item.skillName)}&score=${item.score}&career=${matchedCareer}`}
                              className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                            >
                              🧭 Career Path →
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. ACTIVE QUIZ SCREEN                                    */}
        {/* ======================================================== */}
        {currentStep === "QUIZ" && (
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              {/* Header: Skill & Difficulty */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
                    {activeQuiz.icon}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {activeQuiz.skillName}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    {activeQuiz.difficulty}
                  </span>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  Question {questionIndex + 1} of {activeQuiz.questions.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${((questionIndex + 1) / activeQuiz.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <div className="mt-8">
                <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Domain: {currentQuestion.topic}
                </span>
                <h2 className="mt-3 text-lg font-bold text-slate-900 sm:text-xl leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {currentQuestion.codeSnippet && (
                  <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 font-mono text-xs text-slate-100">
                    <code>{currentQuestion.codeSnippet}</code>
                  </pre>
                )}
              </div>

              {/* Options */}
              <div className="mt-6 space-y-3">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = answers[currentQuestion.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-xs sm:text-sm font-medium transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs ring-1 ring-blue-600"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span>{option}</span>
                      <span
                        className={`size-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-blue-600 bg-blue-600 text-white text-[10px]" : "border-slate-300"
                        }`}
                      >
                        {isSelected && "✓"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={questionIndex === 0}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("SELECT")}
                    className="text-xs font-medium text-slate-400 hover:text-slate-600"
                  >
                    Quit
                  </button>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={answers[currentQuestion.id] === undefined || isSubmitting}
                    className="flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-xs font-bold text-white shadow-xs transition hover:bg-blue-600 disabled:opacity-40"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : questionIndex === activeQuiz.questions.length - 1
                      ? isMentor
                        ? "Submit & Calculate Mentor Level →"
                        : "Submit & Verify Skill →"
                      : "Next Question →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. RESULTS SCREEN (Clean Role Specific Layout)           */}
        {/* ======================================================== */}
        {currentStep === "RESULT" && (
          <div className="mx-auto max-w-3xl space-y-6">
            {/* XP Celebration Banner */}
            {xpAwarded && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black text-lg">
                    ⚡
                  </span>
                  <div>
                    <p className="font-bold text-sm">+{xpAwarded} XP Earned!</p>
                    <p className="text-xs text-amber-800">
                      Technical evaluation recorded and credited to your profile!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setXpAwarded(null)}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900"
                >
                  Dismiss
                </button>
              </div>
            )}

            {submitMessage && !xpAwarded && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-semibold text-blue-800">
                {submitMessage}
              </div>
            )}

            {!user && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-700 flex items-center justify-between shadow-xs">
                <span>Want to save this assessment and earn +10 XP?</span>
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Sign In to Save
                </button>
              </div>
            )}

            {/* MENTOR RESULT VIEW */}
            {isMentor ? (
              <div className="rounded-3xl border border-amber-300 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-7 text-white shadow-xl animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-0.5 text-[11px] font-bold tracking-wider uppercase text-amber-300">
                        👑 Official AI Mentor Level Decision
                      </span>
                      <span className="text-xs text-indigo-200 font-bold">
                        Score: {scoreResult.percentage}%
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-3xl">
                        {scoreResult.percentage >= 90 ? "👑" : scoreResult.percentage >= 75 ? "🎖️" : scoreResult.percentage >= 60 ? "🎓" : "⏳"}
                      </span>
                      <div>
                        <h3 className="text-2xl font-black text-white">
                          Assigned Level:{" "}
                          <span className={scoreResult.percentage >= 90 ? "text-amber-400" : scoreResult.percentage >= 75 ? "text-indigo-300" : scoreResult.percentage >= 60 ? "text-blue-300" : "text-slate-400"}>
                            {mentorLevelResult?.level || "Associate Mentor"}
                          </span>
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                            ★ {mentorLevelResult?.rating || (scoreResult.percentage >= 90 ? 5.0 : scoreResult.percentage >= 75 ? 4.8 : 4.5)} Public Rating
                          </span>
                          <span className="text-xs text-slate-300">
                            {mentorLevelResult?.tier || "Tier 3: Core Foundations Guide"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed max-w-xl">
                      {mentorLevelResult?.description || "Your official mentor accreditation level has been saved to your SkillVerse profile."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 shrink-0">
                    <Link
                      href="/mentor/dashboard"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 px-6 py-3.5 text-xs font-black text-slate-950 shadow-md transition hover:scale-[1.02]"
                    >
                      <span>Go to Mentor Studio & Manage Ads</span>
                      <span>→</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 px-6 py-2.5 text-xs font-bold text-white transition"
                    >
                      View Updated Mentor Profile
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* STUDENT RESULT VIEW */
              <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 p-6 sm:p-7 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-indigo-500/30 border border-indigo-400/40 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-indigo-200">
                        🧭 Career Path Route Ready
                      </span>
                      <span className="text-xs text-indigo-200 font-semibold">
                        Score: {scoreResult.percentage}%
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-extrabold text-white">
                      Career Path Navigation Calibrated to Your Result
                    </h3>
                    <p className="mt-1 text-xs text-indigo-100 max-w-xl leading-relaxed">
                      Based on your evaluation in <strong>{activeQuiz.skillName}</strong>, your learning route has been calibrated with active waypoints, gap analysis, and tailored mentor matching.
                    </p>
                  </div>
                  <Link
                    href={`/roadmap?fromAssessment=1&quiz=${selectedQuizKey}&score=${scoreResult.percentage}&skill=${encodeURIComponent(activeQuiz.skillName)}&level=${encodeURIComponent(scoreResult.level)}&verified=${scoreResult.badgeEarned ? "1" : "0"}&career=${activeQuiz.skillName.toLowerCase().includes("python") ? "aiml" : "fullstack"}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3.5 text-xs font-black text-white shadow-md transition hover:scale-[1.02]"
                  >
                    <span>Go Directly to Career Path Navigation</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Score Card Breakdown */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {activeQuiz.skillName} • {activeQuiz.difficulty}
                  </span>
                  <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                    Evaluation Performance Summary
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-3xl font-black text-slate-900">{scoreResult.percentage}%</span>
                    <span className="block text-[11px] text-slate-500">
                      {scoreResult.correctCount} of {scoreResult.totalCount} correct
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      scoreResult.badgeEarned
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {scoreResult.badgeEarned ? "Verified" : "Needs Review"}
                  </span>
                </div>
              </div>

              {/* Question-by-Question Review */}
              <div className="mt-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question Review & Pedagogical Explanations
                </h4>

                {activeQuiz.questions.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl border p-4 text-xs transition ${
                        isCorrect
                          ? "border-emerald-200 bg-emerald-50/40"
                          : "border-red-200 bg-red-50/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-slate-900">
                          {idx + 1}. {q.question}
                        </p>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-600 space-y-0.5">
                        <p>
                          <strong className="text-slate-800">Your Answer:</strong>{" "}
                          {userAnswer !== undefined ? q.options[userAnswer] : "Skipped"}
                        </p>
                        {!isCorrect && (
                          <p className="text-emerald-800">
                            <strong>Correct Answer:</strong> {q.options[q.correctIndex]}
                          </p>
                        )}
                      </div>

                      <p className="mt-2 text-[11px] text-slate-700 bg-white/70 rounded-xl p-2.5 border border-slate-200/60 leading-relaxed">
                        <span className="font-bold">Explanation:</span> {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep("SELECT")}
                  className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 transition"
                >
                  ← Take Another Assessment
                </button>

                {isMentor ? (
                  <Link
                    href="/mentor/dashboard"
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition"
                  >
                    Go to Mentor Studio →
                  </Link>
                ) : (
                  <Link
                    href={`/roadmap?fromAssessment=1&skill=${encodeURIComponent(activeQuiz.skillName)}&score=${scoreResult.percentage}&career=${activeQuiz.skillName.toLowerCase().includes("python") ? "aiml" : "fullstack"}`}
                    className="rounded-xl bg-slate-900 hover:bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition"
                  >
                    View Calibrated Career Path →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
