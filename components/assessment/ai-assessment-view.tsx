"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  description: string;
  questions: Question[];
};

export const QUIZ_BANK: Record<string, SkillQuiz> = {
  react: {
    id: "react",
    skillName: "React & Next.js Architecture",
    category: "Frontend",
    difficulty: "Intermediate",
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
    difficulty: "Advanced",
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
    difficulty: "Intermediate",
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
};

export default function AIAssessmentView() {
  const openLoginModal = useLoginModal();
  const { user } = useAuth();

  const [selectedQuizKey, setSelectedQuizKey] = useState<string>("react");
  const [currentStep, setCurrentStep] = useState<"SELECT" | "QUIZ" | "RESULT">("SELECT");
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const activeQuiz = QUIZ_BANK[selectedQuizKey] || QUIZ_BANK.react;
  const currentQuestion = activeQuiz.questions[questionIndex];

  const handleStartQuiz = (quizKey: string) => {
    setSelectedQuizKey(quizKey);
    setQuestionIndex(0);
    setAnswers({});
    setShowExplanation(false);
    setCurrentStep("QUIZ");
  };

  const handleSelectOption = (optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  const handleNextQuestion = () => {
    if (questionIndex < activeQuiz.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setShowExplanation(false);
    } else {
      setCurrentStep("RESULT");
    }
  };

  const handlePrevQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
      setShowExplanation(false);
    }
  };

  // Calculate score
  const scoreResult = React.useMemo(() => {
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
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">AI Skill Assessment</span>
        </div>

        {/* 1. SELECTION SCREEN */}
        {currentStep === "SELECT" && (
          <div>
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Test & Verify Your Technical Skills
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
                Take an adaptive 5-question technical quiz. Score 60%+ to earn an <strong>AI-Verified Badge</strong> on your SkillVerse profile and pinpoint your exact learning gaps.
              </p>
            </div>

            {/* Quizzes List */}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {Object.values(QUIZ_BANK).map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs transition-all hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-8 items-center justify-center rounded-lg bg-slate-100 px-2.5 font-mono text-xs font-bold text-slate-800">
                        {quiz.icon}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                        {quiz.difficulty}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">{quiz.skillName}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {quiz.description}
                    </p>

                    <div className="mt-5 flex items-center gap-3 text-xs font-medium text-slate-500">
                      <span>5 Questions</span>
                      <span>•</span>
                      <span>{quiz.estimatedTime}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white shadow-xs transition hover:bg-blue-600"
                  >
                    Start Assessment →
                  </button>
                </div>
              ))}
            </div>

            {/* Value Props Strip */}
            <div className="mt-12 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-8">
              <h3 className="text-base font-bold text-slate-900">How AI Skill Verification Works:</h3>
              <div className="mt-4 grid gap-6 sm:grid-cols-3 text-xs text-slate-600">
                <div className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
                  <p><strong>Adaptive Testing:</strong> Practical questions testing real architecture patterns and gotchas.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">2</span>
                  <p><strong>Instant Analysis:</strong> Comprehensive breakdown of your knowledge strengths and skill gaps.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">3</span>
                  <p><strong>Verified Badge:</strong> Showcase your level to mentors and prospective project teammates.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ACTIVE QUIZ SCREEN (PupilNetwork style) */}
        {currentStep === "QUIZ" && (
          <div className="mx-auto max-w-3xl">
            {/* Header: Topic & Progress Bar */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">{activeQuiz.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {activeQuiz.skillName}
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
                  Topic: {currentQuestion.topic}
                </span>
                <h2 className="mt-3 text-lg font-bold text-slate-900 sm:text-xl leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {/* Optional Code Snippet */}
                {currentQuestion.codeSnippet && (
                  <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-emerald-400">
                    <code>{currentQuestion.codeSnippet}</code>
                  </pre>
                )}
              </div>

              {/* Interactive Radio Options */}
              <div className="mt-6 space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "border border-slate-300 text-slate-500 bg-slate-50"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs font-medium text-slate-800 leading-relaxed sm:text-sm">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation & Submit Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={questionIndex === 0}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep("SELECT")}
                    className="text-xs font-medium text-slate-400 hover:text-slate-600"
                  >
                    Quit Quiz
                  </button>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={answers[currentQuestion.id] === undefined}
                    className="flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-xs font-bold text-white shadow-xs transition hover:bg-blue-600 disabled:opacity-40"
                  >
                    {questionIndex === activeQuiz.questions.length - 1
                      ? "Submit Assessment →"
                      : "Next Question →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. EVALUATION & RESULTS SCREEN (PupilNetwork style) */}
        {currentStep === "RESULT" && (
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Score & Level Hero Box */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs text-center">
              <div className="inline-flex size-20 items-center justify-center rounded-3xl bg-blue-50 text-3xl font-extrabold text-blue-600">
                {scoreResult.percentage}%
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Assessment Complete: {activeQuiz.skillName}
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                You answered <strong>{scoreResult.correctCount} out of {scoreResult.totalCount}</strong> questions correctly.
              </p>

              {/* Skill Level Badge */}
              <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-2xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">Assessed Skill Level:</span>
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  {scoreResult.level}
                </span>
              </div>

              {/* AI-Verified Profile Badge Preview */}
              {scoreResult.badgeEarned ? (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-900 text-xs">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-800 text-sm">
                    <span>AI-Verified Badge Unlocked</span>
                  </div>
                  <p className="mt-1">
                    This verified badge has been credited to your profile. Mentors and project leads will see your verified status.
                  </p>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900 text-xs">
                  <span className="font-bold">Almost there!</span> Score 60%+ to unlock the AI-Verified badge on your profile.
                </div>
              )}
            </div>

            {/* Strengths & Learning Gaps Feedback */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">
                Personalized Knowledge Breakdown
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Detailed question-by-question explanations from the AI evaluator:
              </p>

              <div className="mt-6 space-y-4">
                {activeQuiz.questions.map((q) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl border p-4 text-xs ${
                        isCorrect
                          ? "border-emerald-200 bg-emerald-50/40"
                          : "border-red-200 bg-red-50/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex size-5 items-center justify-center rounded-full text-[11px] font-bold ${
                              isCorrect
                                ? "bg-emerald-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {isCorrect ? "✓" : "✕"}
                          </span>
                          <span className="font-bold text-slate-900">
                            {q.topic}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            isCorrect ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Needs Review"}
                        </span>
                      </div>

                      <p className="mt-2 font-medium text-slate-800">{q.question}</p>

                      <div className="mt-2.5 rounded-lg bg-white/80 p-2.5 border border-slate-100 text-[11px] leading-relaxed text-slate-600">
                        <strong className="text-slate-800">AI Feedback:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href={`/search?q=${encodeURIComponent(activeQuiz.skillName.split(" ")[0])}`}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 px-6 text-xs font-bold text-white shadow-xs transition hover:bg-blue-600"
              >
                Find Mentors for {activeQuiz.skillName.split(" ")[0]} →
              </Link>

              <button
                type="button"
                onClick={() => setCurrentStep("SELECT")}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Test Another Skill
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
