import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateGroqAssessment, GroqQuizResponse } from "@/lib/groq";

const requestSchema = z.object({
  skill: z.string().min(2, "Skill name must be at least 2 characters").max(60),
  difficulty: z.enum(["SIMPLE", "MEDIUM", "HARD"]).default("MEDIUM"),
  role: z.string().max(80).optional(),
});

// =========================================================================
// MENTOR PEDAGOGY & ACCREDITATION FALLBACK QUESTION BANKS (3 TIERS)
// =========================================================================
const MENTOR_FALLBACK_QUIZZES: Record<string, GroqQuizResponse> = {
  SIMPLE: {
    skillName: "Mentor Pedagogy & Foundations Guide",
    difficulty: "SIMPLE",
    questions: [
      {
        id: 1,
        question: "A beginner mentee asks why their variable modified inside a function doesn't change outside. How should an Associate Mentor best explain this?",
        options: [
          "A) Tell them JavaScript is broken and they should use global variables everywhere",
          "B) Use a visual diagram showing function call scopes as local boxes isolated from the global environment",
          "C) Tell them to read the ECMAScript 262 specification directly",
          "D) Write the entire code for them without explanation",
        ],
        correctAnswer: 1,
        explanation: "Foundational mentoring scaffolds beginner mental models by visualizing execution context and scope boundaries rather than encouraging anti-patterns or jargon.",
      },
      {
        id: 2,
        question: "When conducting an introductory code review on a student's first PR, what is the best practice for constructive feedback?",
        options: [
          "A) Leave 30 blunt comments pointing out every minor formatting discrepancy without positive notes",
          "B) Highlight what they did well first, explain the 'why' behind improvements, and offer small actionable next steps",
          "C) Silently close the pull request and rewrite the code yourself",
          "D) Approve the PR immediately without reviewing to encourage them",
        ],
        correctAnswer: 1,
        explanation: "Effective pedagogy uses positive reinforcement combined with conceptual reasoning ('why this matters'), fostering psychological safety and learning.",
      },
      {
        id: 3,
        question: "A student is confused by asynchronous JavaScript. Which real-world analogy best conveys the concept of async non-blocking operations?",
        options: [
          "A) Ordering food at a counter: you get a receipt buzzer (Promise) so you can sit down while the kitchen cooks, rather than blocking the line",
          "B) Reading a physical book cover to cover in absolute silence",
          "C) Waiting at a single ATM machine where nobody can step up until the current person leaves",
          "D) Stacking bricks on top of each other where each brick must cure before placing the next",
        ],
        correctAnswer: 0,
        explanation: "The restaurant buzzer analogy clearly maps to non-blocking I/O: the main thread stays unblocked while background work processes.",
      },
      {
        id: 4,
        question: "A mentee makes a single massive Git commit with the message 'fixes and updates'. How do you guide their version control hygiene?",
        options: [
          "A) Tell them Git commit messages don't matter as long as the code runs",
          "B) Explain how atomic commits and imperative summaries (e.g., 'feat: add user login validation') make rollback and team collaboration painless",
          "C) Tell them to delete the git repository and start over",
          "D) Mandate that every single line of code must be its own commit",
        ],
        correctAnswer: 1,
        explanation: "Teaching atomic commits helps junior developers learn industry git workflows and clean bisecting/rollback habits.",
      },
      {
        id: 5,
        question: "A mentee encounters a red stack trace in their browser console and immediately panics. How should a mentor train their debugging instinct?",
        options: [
          "A) Tell them to paste the whole project into ChatGPT without reading it",
          "B) Guide them to identify the error name, read the message, look at the file path and line number, and check the line right above it",
          "C) Fix the typo on their screen while they watch silently",
          "D) Advise them to wrap their entire application inside an empty try/catch block",
        ],
        correctAnswer: 1,
        explanation: "Teaching students to read stack traces methodically builds independent problem-solving skills rather than reliance on quick external fixes.",
      },
    ],
  },
  MEDIUM: {
    skillName: "Senior Mentor Code Review & Architecture Guidance",
    difficulty: "MEDIUM",
    questions: [
      {
        id: 1,
        question: "During a code review, you notice a student passing 8 props down through 5 intermediate components just to reach an edit button. How should you guide them?",
        options: [
          "A) Advise them to use window global variables",
          "B) Explain the problem of 'prop drilling' and demonstrate how component composition (passing children/slots) or a lightweight store (Zustand/Context) cleanly solves it",
          "C) Tell them to merge all 5 components into one giant 2,000-line file",
          "D) Suggest replacing React with vanilla DOM manipulations",
        ],
        correctAnswer: 1,
        explanation: "Senior mentors explain component composition and state colocation trade-offs to keep component hierarchies modular and maintainable.",
      },
      {
        id: 2,
        question: "A mentee's database query takes 3+ seconds on a table with 200,000 records. What is the most pedagogical approach to guide their diagnosis?",
        options: [
          "A) Tell them to immediately switch to MongoDB without looking at the query",
          "B) Teach them how to run 'EXPLAIN ANALYZE' in PostgreSQL to locate sequential table scans and design appropriate B-Tree composite indexes",
          "C) Tell them to restart their local database server",
          "D) Instruct them to load all 200,000 rows into frontend JavaScript and filter with Array.filter",
        ],
        correctAnswer: 1,
        explanation: "Guiding mentees through query execution profiling (EXPLAIN ANALYZE) and index strategies teaches fundamental database performance engineering.",
      },
      {
        id: 3,
        question: "A mentee's Next.js API route returns an unhandled 500 error when a user inputs an invalid email string. How do you advise them to structure API defenses?",
        options: [
          "A) Ignore it because users will usually enter valid inputs",
          "B) Implement schema validation with Zod on the boundary and return structured 400 Bad Request responses with readable error arrays",
          "C) Silence all errors with an empty catch block that returns status 200",
          "D) Remove server validation and rely solely on HTML 'required' attributes",
        ],
        correctAnswer: 1,
        explanation: "Senior mentors emphasize defensive API design: validating inputs with schemas (Zod) and returning clean HTTP error envelopes.",
      },
      {
        id: 4,
        question: "In a code review, you find an endpoint doing `prisma.order.findUnique({ where: { id: req.params.id } })` without checking if `order.userId === session.id`. What risk and fix should you mentor?",
        options: [
          "A) This is an Insecure Direct Object Reference (IDOR) vulnerability; guide them to always scope queries to the authenticated session user",
          "B) The query is fine because primary keys are unique",
          "C) It only needs a regex validation on the order ID format",
          "D) Primary keys should be encoded with base64 for security",
        ],
        correctAnswer: 0,
        explanation: "IDOR is a critical security vulnerability. Mentors teach mentees to always enforce authorization ownership checks on tenant data.",
      },
      {
        id: 5,
        question: "A mentee asks whether they should use Redux Toolkit, Zustand, or React Context for their small 3-page college portfolio project. How should you advise them?",
        options: [
          "A) Enforce Redux with Redux-Saga because enterprise apps use it",
          "B) Guide them to evaluate complexity trade-offs: start with React's built-in useState/Context, and only add a lightweight store like Zustand if global synchronization becomes unwieldy",
          "C) Tell them state management is obsolete in modern web development",
          "D) Tell them to store everything in localStorage",
        ],
        correctAnswer: 1,
        explanation: "Senior guidance prevents over-engineering by steering mentees towards the simplest solution that satisfies current project requirements.",
      },
    ],
  },
  HARD: {
    skillName: "Master Mentor Architectural Auditing & Scalability",
    difficulty: "HARD",
    questions: [
      {
        id: 1,
        question: "A mentee's Node.js production service experiences slow memory growth until the OS kills it with an OOM (Out Of Memory) signal. How do you teach them to locate the root cause?",
        options: [
          "A) Increase max-old-space-size to 16GB and restart on a timer",
          "B) Teach them to take comparative V8 heap snapshots in Chrome DevTools to locate retained closures, unbounded map caches, or dangling event listeners",
          "C) Tell them Node.js has automatic garbage collection so memory leaks are impossible",
          "D) Rewrite the application in Go without debugging the leak",
        ],
        correctAnswer: 1,
        explanation: "Master mentors teach diagnostic instrumentation: taking baseline and loaded heap snapshots to identify retained memory paths.",
      },
      {
        id: 2,
        question: "A mentee is building a high-concurrency ticket reservation system where two users might book the last seat simultaneously. What concurrency control strategy should you guide them to implement?",
        options: [
          "A) Perform a SELECT check in code, then an INSERT if seats > 0 without transaction locking",
          "B) Use Optimistic Concurrency Control (OCC) with row versioning, or a PostgreSQL SELECT ... FOR UPDATE pessimistic lock inside an ACID transaction",
          "C) Use setTimeout to delay one user's request by 100ms",
          "D) Rely on frontend disable buttons to prevent simultaneous clicks",
        ],
        correctAnswer: 1,
        explanation: "Master architects teach database-level transactional locking (pessimistic or OCC versioning) to eliminate race conditions under distributed concurrency.",
      },
      {
        id: 3,
        question: "A mentee proposes splitting their prototype with 50 active users into 8 separate Docker microservices with gRPC communication. What architectural guidance should you provide?",
        options: [
          "A) Praise the architecture and advise adding Kubernetes and Apache Kafka immediately",
          "B) Warn them about distributed system tax (network latency, distributed tracing, transactional boundaries) and recommend a clean modular monolith first",
          "C) Tell them 8 services is too few and they need at least 20 services",
          "D) Suggest abandoning Docker and running on bare metal",
        ],
        correctAnswer: 1,
        explanation: "Master mentors guide mentees against premature distributed systems complexity, teaching that modular monoliths maximize iteration velocity.",
      },
      {
        id: 4,
        question: "During an architecture audit of a database schema, you notice frequent deadlocks between two concurrent update queries. How do you teach the mentee to eliminate the deadlocks?",
        options: [
          "A) Ensure all concurrent transactions acquire row locks in the exact same deterministic order across the application",
          "B) Turn off database foreign keys and transactions completely",
          "C) Increase database timeout to 5 minutes so deadlocks resolve automatically",
          "D) Switch from PostgreSQL to SQLite",
        ],
        correctAnswer: 0,
        explanation: "Acquiring locks in a consistent, deterministic order prevents circular wait conditions, which is the foundational mathematical prevention for deadlocks.",
      },
      {
        id: 5,
        question: "A mentee's backend API uses string interpolation for database queries: `prisma.$queryRawUnsafe(`SELECT * FROM users WHERE email = '${email}'`)`. How do you respond?",
        options: [
          "A) Approve it if they validated the email with regex",
          "B) Demonstrate the SQL injection vulnerability with an input like `' OR '1'='1`, and mandate parameterized queries with `$queryRaw` tagged template literals",
          "C) Tell them SQL injection is only a problem on MySQL, not PostgreSQL",
          "D) Encode the SQL string in Base64 before execution",
        ],
        correctAnswer: 1,
        explanation: "Master mentors enforce production security standards by demonstrating exploit mechanics and enforcing parameterized SQL queries.",
      },
    ],
  },
};

// =========================================================================
// STUDENT SKILL-SPECIFIC FALLBACK QUESTION BANKS (BY TOPIC & 3 TIERS)
// =========================================================================
const STUDENT_PYTHON_QUIZZES: Record<string, GroqQuizResponse> = {
  SIMPLE: {
    skillName: "Python Core Fundamentals",
    difficulty: "SIMPLE",
    questions: [
      {
        id: 1,
        question: "In Python, what is the key difference between a list and a tuple?",
        options: [
          "A) Lists are mutable (can be changed); tuples are immutable (cannot be changed after creation)",
          "B) Tuples can contain different data types; lists can only contain integers",
          "C) Lists use parentheses (); tuples use square brackets []",
          "D) There is no difference in Python 3",
        ],
        correctAnswer: 0,
        explanation: "Lists are mutable sequences created with [], while tuples are immutable sequences created with ().",
      },
      {
        id: 2,
        question: "What does the 'len()' function return when passed a Python dictionary with 4 key-value pairs?",
        options: ["A) 8 (keys + values)", "B) 4 (number of keys)", "C) 1", "D) Throws a TypeError"],
        correctAnswer: 1,
        explanation: "Calling len(dict) returns the count of keys currently present in the dictionary.",
      },
      {
        id: 3,
        question: "Which keyword is used to handle exceptions in Python?",
        options: ["A) catch", "B) except", "C) rescue", "D) trap"],
        correctAnswer: 1,
        explanation: "Python uses 'try...except...finally' blocks for exception handling.",
      },
      {
        id: 4,
        question: "What will `[x * 2 for x in [1, 2, 3]]` evaluate to?",
        options: ["A) [1, 2, 3, 1, 2, 3]", "B) [2, 4, 6]", "C) [2, 2, 2]", "D) (2, 4, 6)"],
        correctAnswer: 1,
        explanation: "This is a Python list comprehension that iterates through each element and multiplies it by 2.",
      },
      {
        id: 5,
        question: "In Python, which built-in data type does NOT allow duplicate elements?",
        options: ["A) list", "B) set", "C) tuple", "D) dict_values"],
        correctAnswer: 1,
        explanation: "A Python 'set' is an unordered collection of unique hashable elements.",
      },
    ],
  },
  MEDIUM: {
    skillName: "Python & Applied Systems",
    difficulty: "MEDIUM",
    questions: [
      {
        id: 1,
        question: "What is the primary difference between a Python Generator function (using yield) and a standard function returning a list?",
        options: [
          "A) Generators run on a separate CPU thread",
          "B) Generators produce items lazily on-demand with O(1) memory instead of allocating the entire collection in RAM",
          "C) Generators cannot be iterated with a for loop",
          "D) Generators only work with floating-point numbers",
        ],
        correctAnswer: 1,
        explanation: "Generators utilize lazy evaluation, retaining their frame and yielding values one at a time to minimize memory footprint.",
      },
      {
        id: 2,
        question: "In Python's asyncio module, what happens if you call a blocking, CPU-intensive function directly inside an async coroutine without an executor?",
        options: [
          "A) Python automatically multithreads it across available cores",
          "B) It halts the entire single-threaded event loop, preventing all other concurrent coroutines from progressing",
          "C) It raises an AsyncBlockedException at runtime",
          "D) It spawns a background OS process",
        ],
        correctAnswer: 1,
        explanation: "The asyncio event loop runs on a single thread. CPU-bound or blocking operations freeze the loop unless delegated via loop.run_in_executor.",
      },
      {
        id: 3,
        question: "In Python, what is the purpose of the `*args` and `**kwargs` syntax in a function definition?",
        options: [
          "A) It performs pointer dereferencing similar to C/C++",
          "B) It allows the function to accept arbitrary positional arguments as a tuple and keyword arguments as a dictionary",
          "C) It optimizes bytecode compilation speed",
          "D) It enforces static type checking at runtime",
        ],
        correctAnswer: 1,
        explanation: "*args packs arbitrary positional arguments into a tuple, while **kwargs packs named keyword arguments into a dictionary.",
      },
      {
        id: 4,
        question: "What is the function of the `@property` decorator in a Python class?",
        options: [
          "A) Makes the method private and inaccessible from outside the module",
          "B) Allows a method to be accessed like an attribute without calling parentheses, enabling getter and setter logic",
          "C) Compiles the method into C code",
          "D) Automatically saves the property to a database",
        ],
        correctAnswer: 1,
        explanation: "The @property decorator defines getter methods that can be accessed syntactically as attributes while executing encapsulation logic.",
      },
      {
        id: 5,
        question: "In NumPy and PyTorch, what is array broadcasting?",
        options: [
          "A) Streaming tensor buffers over network sockets",
          "B) Arithmetic operations on arrays of different compatible shapes without making unnecessary memory copies",
          "C) Converting multidimensional arrays into flattened 1D lists",
          "D) Printing tensor values to standard output",
        ],
        correctAnswer: 1,
        explanation: "Broadcasting allows element-wise operations on arrays of differing shapes by virtually expanding compatible trailing dimensions.",
      },
    ],
  },
  HARD: {
    skillName: "Python Advanced Architecture & Internals",
    difficulty: "HARD",
    questions: [
      {
        id: 1,
        question: "How does CPython's Global Interpreter Lock (GIL) impact CPU-bound multi-threading compared to I/O-bound multi-threading?",
        options: [
          "A) It prevents multi-threading for both CPU and I/O workloads completely",
          "B) It prevents multiple threads from executing Python bytecode simultaneously on separate cores for CPU-bound tasks, while I/O operations release the GIL during syscalls",
          "C) It doubles CPU execution speed by disabling garbage collection",
          "D) It only applies to Python 2.7, not Python 3",
        ],
        correctAnswer: 1,
        explanation: "The GIL serializes CPython bytecode execution, meaning CPU-bound tasks do not parallelize across cores with threading. However, I/O releases the GIL while waiting on descriptors.",
      },
      {
        id: 2,
        question: "In Python metaclasses, what is the exact execution order when a new class is defined?",
        options: [
          "A) __init__ of the instance, then __call__ of the metaclass",
          "B) Metaclass `__prepare__` -> class body execution -> Metaclass `__new__` -> Metaclass `__init__`",
          "C) Class `__new__` -> Metaclass `__del__`",
          "D) Metaclass `__repr__` only",
        ],
        correctAnswer: 1,
        explanation: "Python first calls the metaclass's __prepare__ method to create the namespace dictionary, executes the class body within it, then calls __new__ and __init__ on the metaclass.",
      },
      {
        id: 3,
        question: "How does Python handle circular references during memory management?",
        options: [
          "A) Reference counting alone frees circular references immediately",
          "B) The cyclic garbage collector uses a generational tri-color mark-and-sweep algorithm to detect and break isolated reference cycles",
          "C) Circular references trigger an unrecoverable Segfault",
          "D) Python crashes and prints MemoryError",
        ],
        correctAnswer: 1,
        explanation: "While reference counting handles immediate cleanup of non-cyclic objects, CPython's generational cyclic GC runs periodically to identify and collect reference cycles.",
      },
      {
        id: 4,
        question: "What is the computational benefit of using `__slots__` in Python classes?",
        options: [
          "A) Enables multi-core execution of class methods",
          "B) Replaces the dynamic per-instance `__dict__` with a static C array of references, significantly reducing RAM usage for millions of objects",
          "C) Encrypts the object state in memory",
          "D) Automatically converts the class to JSON",
        ],
        correctAnswer: 1,
        explanation: "By defining __slots__, instances do not create a __dict__, saving significant RAM per instance when instantiating large numbers of objects.",
      },
      {
        id: 5,
        question: "In Python decorators, why is using `functools.wraps` considered mandatory in production libraries?",
        options: [
          "A) It prevents infinite recursion during execution",
          "B) It preserves the original function's metadata, including `__name__`, `__doc__`, and signature for introspection and debugging tools",
          "C) It speeds up decorator execution by 10x",
          "D) It automatically validates argument types",
        ],
        correctAnswer: 1,
        explanation: "Without @functools.wraps, decorated functions lose their original __name__, __doc__, and module metadata, breaking docstrings and debugging tools.",
      },
    ],
  },
};

const STUDENT_FRONTEND_QUIZZES: Record<string, GroqQuizResponse> = {
  SIMPLE: {
    skillName: "Frontend & React Core",
    difficulty: "SIMPLE",
    questions: [
      {
        id: 1,
        question: "In JavaScript/TypeScript, what is the key difference between 'const' and 'let'?",
        options: [
          "A) 'const' creates an immutable binding that cannot be reassigned; 'let' allows reassignment",
          "B) 'const' variables have global scope; 'let' is block-scoped",
          "C) 'const' values are frozen and cannot have their object properties modified",
          "D) There is no runtime difference between them",
        ],
        correctAnswer: 0,
        explanation: "'const' signals that the variable identifier cannot be reassigned. However, the contents of mutable objects assigned to a const binding can still be modified.",
      },
      {
        id: 2,
        question: "Which HTML element is the correct semantic tag for navigation links?",
        options: ["A) <div class='nav'>", "B) <nav>", "C) <menu-bar>", "D) <navigation>"],
        correctAnswer: 1,
        explanation: "HTML5 semantic tags like <nav> enhance accessibility (screen readers) and SEO crawler indexing.",
      },
      {
        id: 3,
        question: "In React, what hook is used to introduce stateful values to functional components?",
        options: ["A) useMount", "B) useState", "C) useRender", "D) useVariable"],
        correctAnswer: 1,
        explanation: "useState is the foundational React hook for declaring state variables in functional components.",
      },
      {
        id: 4,
        question: "In CSS Flexbox, which property aligns items along the primary main axis?",
        options: ["A) align-items", "B) justify-content", "C) flex-direction", "D) align-content"],
        correctAnswer: 1,
        explanation: "'justify-content' aligns children along the main axis, while 'align-items' aligns along the cross axis.",
      },
      {
        id: 5,
        question: "What does the browser's Document Object Model (DOM) represent?",
        options: [
          "A) The raw binary code sent by the web server",
          "B) A structured tree representation of the HTML document rendered by the browser",
          "C) The database query result set",
          "D) The CSS stylesheet file",
        ],
        correctAnswer: 1,
        explanation: "The DOM is an object-oriented representation of the web page, allowing scripts to update style, structure, and content.",
      },
    ],
  },
  MEDIUM: {
    skillName: "React & Next.js Architecture",
    difficulty: "MEDIUM",
    questions: [
      {
        id: 1,
        question: "When does useEffect execute in the React component lifecycle compared to useLayoutEffect?",
        options: [
          "A) useLayoutEffect runs asynchronously after paint; useEffect runs synchronously before paint",
          "B) useLayoutEffect runs synchronously after DOM mutations but before browser paint; useEffect runs asynchronously after paint",
          "C) Both run simultaneously in the microtask queue",
          "D) useEffect only runs on component unmount",
        ],
        correctAnswer: 1,
        explanation: "useLayoutEffect fires synchronously after all DOM mutations but before the browser paints the screen, making it ideal for reading layout measurements.",
      },
      {
        id: 2,
        question: "In Next.js App Router, which of the following is TRUE regarding Server Components?",
        options: [
          "A) Server Components can directly use useState and useEffect hooks",
          "B) Server Components execute on the server and have zero client-side JavaScript bundle footprint",
          "C) Server Components cannot fetch data asynchronously with async/await",
          "D) Server Components must always be marked with 'use client'",
        ],
        correctAnswer: 1,
        explanation: "Server Components execute exclusively on the server and are streamed as static HTML/RSC payload, adding 0 KB of client-side JS bundle overhead.",
      },
      {
        id: 3,
        question: "What is the primary benefit of React's useCallback hook?",
        options: [
          "A) It accelerates the computational execution of the wrapped function",
          "B) It caches the return value of an expensive calculation",
          "C) It preserves referential equality of the function instance between re-renders",
          "D) It automatically prevents child components from ever re-rendering",
        ],
        correctAnswer: 2,
        explanation: "useCallback caches the function definition itself to maintain referential equality across renders, preventing unnecessary child re-renders when passed as props.",
      },
      {
        id: 4,
        question: "In React component trees, what problem does state colocation primarily solve?",
        options: [
          "A) Prevents CSS collision",
          "B) Restricts unnecessary re-renders of unrelated parent components by keeping state local to where it is used",
          "C) Enforces server-side rendering for all components",
          "D) Automatically optimizes database indexes",
        ],
        correctAnswer: 1,
        explanation: "Placing state as close as possible to the components that need it minimizes cascading re-renders across the component tree.",
      },
      {
        id: 5,
        question: "What is the difference between controlled and uncontrolled form inputs in React?",
        options: [
          "A) Controlled inputs manage their value through React state; uncontrolled inputs rely on DOM refs to pull values",
          "B) Controlled inputs do not allow user typing",
          "C) Uncontrolled inputs are encrypted automatically",
          "D) There is no difference in modern React",
        ],
        correctAnswer: 0,
        explanation: "Controlled inputs have their current value driven by state with an onChange handler; uncontrolled inputs store their value in the DOM itself.",
      },
    ],
  },
  HARD: {
    skillName: "Advanced Frontend & React Internals",
    difficulty: "HARD",
    questions: [
      {
        id: 1,
        question: "How does React's Fiber reconciliation architecture enable concurrent rendering features like Transitions and Suspense?",
        options: [
          "A) By utilizing multi-threaded CPU web workers for rendering",
          "B) By breaking rendering work into incremental units of fiber nodes that can be paused, prioritized, or aborted by the scheduler",
          "C) By compiling JSX directly into WebAssembly binaries",
          "D) By avoiding DOM reconciliation entirely",
        ],
        correctAnswer: 1,
        explanation: "The React Fiber reconciliation engine represents the component tree as a linked list of fiber units of work, enabling time-slicing and interruptible rendering.",
      },
      {
        id: 2,
        question: "In React 19 / Server Components architecture, what happens when an async Server Component throws an uncaught Promise rejection during streaming SSR?",
        options: [
          "A) The entire server process crashes and restarts",
          "B) The nearest parent Suspense boundary renders its fallback on the client while the error is logged on the server",
          "C) The client browser displays a blank white screen",
          "D) Next.js retries the component render in an infinite loop",
        ],
        correctAnswer: 1,
        explanation: "Streaming SSR isolates component subtree errors to the nearest Suspense or Error boundary without crashing adjacent streamed chunks.",
      },
      {
        id: 3,
        question: "Under high concurrency, what is the fundamental risk of doing 'Check-Then-Act' logic on distributed caches without atomic primitives or locks?",
        options: [
          "A) Memory fragmentation in the cache",
          "B) Race conditions and cache stampedes leading to duplicate database writes and inconsistent states",
          "C) HTTP 504 gateway timeout from the browser",
          "D) TLS handshake renegotiation failure",
        ],
        correctAnswer: 1,
        explanation: "Without atomic primitives like Redis SETNX or Lua scripts, multiple processes can execute the check simultaneously before any writes occur.",
      },
      {
        id: 4,
        question: "In TypeScript, what does the 'infer' keyword do inside conditional types?",
        options: [
          "A) Forces the compiler to guess missing types randomly",
          "B) Introduces a type variable to be deduced from the pattern match in the 'extends' clause (e.g. `T extends Promise<infer U> ? U : T`)",
          "C) Suppresses all type errors in the block",
          "D) Converts types to any",
        ],
        correctAnswer: 1,
        explanation: "'infer' allows you to extract and bind sub-types dynamically within conditional type branches.",
      },
      {
        id: 5,
        question: "Why can excessive DOM depth and CSS selector specificity harm browser frame rates during scroll animations?",
        options: [
          "A) Because browsers must recalculate styles, reflow the layout geometry, and repaint composite layers on the main thread",
          "B) Because CSS files are re-downloaded during scrolling",
          "C) Because GPU hardware acceleration is disabled during scrolling",
          "D) It has no measurable performance impact",
        ],
        correctAnswer: 0,
        explanation: "Complex CSS selectors and deep DOM trees increase Style Invalidation and Layout (reflow) cost, leading to dropped frames during user interactions.",
      },
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    let role = session?.role || "STUDENT";

    let candidateProfile: {
      headline?: string | null;
      skills?: string[];
      bio?: string | null;
      education?: string | null;
    } | undefined = undefined;

    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: {
          role: true,
          profile: {
            select: {
              headline: true,
              skills: true,
              bio: true,
              education: true,
            },
          },
        },
      });

      if (user) {
        role = user.role;
        candidateProfile = {
          headline: user.profile?.headline,
          skills: user.profile?.skills,
          bio: user.profile?.bio,
          education: user.profile?.education,
        };
      }
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid skill or difficulty input" },
        { status: 400 }
      );
    }

    const { skill, difficulty, role: customRole } = parsed.data;
    const effectiveRole = customRole?.trim() || role;

    // Attempt generation with Groq AI using full profile context & specific job role
    const groqQuiz = await generateGroqAssessment({
      skill,
      role: effectiveRole,
      difficulty,
      candidateProfile,
    });

    if (groqQuiz) {
      return NextResponse.json({
        success: true,
        isAiGenerated: true,
        engine: "Groq LLaMA-3.3 70B Versatile",
        quiz: groqQuiz,
      });
    }

    // Dynamic fallback based on role, topic, and selected tier
    let fallbackTemplate = STUDENT_FRONTEND_QUIZZES[difficulty] || STUDENT_FRONTEND_QUIZZES.MEDIUM;
    const lowerSkill = skill.toLowerCase();

    if (role === "MENTOR") {
      fallbackTemplate = MENTOR_FALLBACK_QUIZZES[difficulty] || MENTOR_FALLBACK_QUIZZES.MEDIUM;
    } else if (
      lowerSkill.includes("python") ||
      lowerSkill.includes("ai") ||
      lowerSkill.includes("ml") ||
      lowerSkill.includes("data") ||
      lowerSkill.includes("django") ||
      lowerSkill.includes("fastapi")
    ) {
      fallbackTemplate = STUDENT_PYTHON_QUIZZES[difficulty] || STUDENT_PYTHON_QUIZZES.MEDIUM;
    } else {
      fallbackTemplate = STUDENT_FRONTEND_QUIZZES[difficulty] || STUDENT_FRONTEND_QUIZZES.MEDIUM;
    }

    const fallbackQuiz: GroqQuizResponse = {
      skillName: skill,
      difficulty,
      questions: fallbackTemplate.questions.map((q, idx) => ({
        ...q,
        id: idx + 1,
      })),
    };

    return NextResponse.json({
      success: true,
      isAiGenerated: false,
      engine: "Calibrated Dynamic Engine (Add GROQ_API_KEY to enable live LLaMA-3.3 70B generation)",
      quiz: fallbackQuiz,
    });
  } catch (error) {
    console.error("POST /api/ai/assessment error:", error);
    return NextResponse.json({ error: "Failed to generate assessment" }, { status: 500 });
  }
}
