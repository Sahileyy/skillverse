import { z } from "zod";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const FAST_MODEL = "llama-3.1-8b-instant";

export type GroqChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Zod Schema for generated assessment question
export const groqQuizQuestionSchema = z.object({
  id: z.number(),
  question: z.string().min(5),
  options: z.array(z.string().min(1)).min(3).max(5),
  correctAnswer: z.number().min(0).max(4),
  explanation: z.string().min(5),
});

export const groqQuizResponseSchema = z.object({
  skillName: z.string(),
  difficulty: z.string(),
  questions: z.array(groqQuizQuestionSchema).min(3).max(10),
});

export type GroqQuizQuestion = z.infer<typeof groqQuizQuestionSchema>;
export type GroqQuizResponse = z.infer<typeof groqQuizResponseSchema>;

// Zod Schema for generated career guidance roadmap
export const groqRoadmapMilestoneSchema = z.object({
  id: z.string(),
  stage: z.enum(["BASELINE", "SKILL_GAP", "RECOMMENDED", "CAPSTONE", "TARGET"]),
  title: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
  resources: z.array(z.string()),
  recommendedMentorRole: z.string().optional(),
});

export const groqCareerGuidanceSchema = z.object({
  targetRole: z.string(),
  careerSummary: z.string(),
  marketDemand: z.string(),
  estimatedMonths: z.string(),
  keySkillGaps: z.array(z.string()),
  milestones: z.array(groqRoadmapMilestoneSchema).min(3),
  capstoneProjectIdea: z.object({
    title: z.string(),
    description: z.string(),
    deliverables: z.array(z.string()),
  }),
});

export type GroqCareerGuidance = z.infer<typeof groqCareerGuidanceSchema>;

/**
 * Core helper to invoke Groq AI chat completion API
 */
export async function callGroqChat({
  messages,
  temperature = 0.2,
  responseJson = true,
  model = DEFAULT_MODEL,
}: {
  messages: GroqChatMessage[];
  temperature?: number;
  responseJson?: boolean;
  model?: string;
}): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  try {
    const payload: Record<string, unknown> = {
      model,
      messages,
      temperature,
    };

    if (responseJson) {
      payload.response_format = { type: "json_object" };
    }

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Groq API responded with status ${res.status}:`, errText);
      // Fallback to fast model if default model hit rate limits or errors
      if (model !== FAST_MODEL && res.status >= 500) {
        return callGroqChat({ messages, temperature, responseJson, model: FAST_MODEL });
      }
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("Groq API invocation error:", error);
    return null;
  }
}

/**
 * Generate a dynamic 5-question technical assessment via Groq AI
 */
/**
 * Generate a dynamic 5-question technical assessment via Groq AI
 * Supports 3 explicit levels: SIMPLE, MEDIUM, HARD
 * Tailors questions to user profile (STUDENT vs MENTOR)
 */
export async function generateGroqAssessment({
  skill,
  role = "STUDENT",
  difficulty = "MEDIUM",
  candidateProfile,
}: {
  skill: string;
  role?: string;
  difficulty?: "SIMPLE" | "MEDIUM" | "HARD" | string;
  candidateProfile?: {
    headline?: string | null;
    skills?: string[];
    bio?: string | null;
    education?: string | null;
  };
}): Promise<GroqQuizResponse | null> {
  const normDifficulty = difficulty.toUpperCase();
  const isMentor = role === "MENTOR";

  let difficultyGuidelines = "";
  if (isMentor) {
    if (normDifficulty === "SIMPLE") {
      difficultyGuidelines = "LEVEL: SIMPLE (Associate Tier). Focus on clear concept explanations to junior learners, foundational code hygiene, and identifying beginner syntax pitfalls.";
    } else if (normDifficulty === "HARD") {
      difficultyGuidelines = "LEVEL: HARD (Master Architect Tier). Focus on complex system architecture, diagnosing subtle race conditions/concurrency bugs in student PRs, high-throughput scaling trade-offs, and capstone auditing.";
    } else {
      difficultyGuidelines = "LEVEL: MEDIUM (Senior Tier). Focus on real-world code reviews, refactoring anti-patterns, guiding learners through practical debugging, and architectural modularity.";
    }
  } else {
    if (normDifficulty === "SIMPLE") {
      difficultyGuidelines = "LEVEL: SIMPLE (Beginner). Focus on core language fundamentals, essential syntax, standard libraries, and primary principles without tricky edge cases.";
    } else if (normDifficulty === "HARD") {
      difficultyGuidelines = "LEVEL: HARD (Advanced). Focus on deep framework internals, concurrency, memory/performance profiling, algorithmic trade-offs, and production edge cases.";
    } else {
      difficultyGuidelines = "LEVEL: MEDIUM (Intermediate). Focus on practical day-to-day scenarios, asynchronous flow, component/state patterns, and real-world debugging.";
    }
  }

  const profileContext = candidateProfile ? `
Candidate Profile Context:
- Headline: ${candidateProfile.headline || "Not specified"}
- Verified Profile Skills: ${candidateProfile.skills?.join(", ") || "General"}
- Background: ${candidateProfile.education || candidateProfile.bio || "Computer Science / Software Engineering"}
` : "";

  const prompt = `You are a Principal Software Engineering Assessor for SkillVerse.
Generate a high-quality 5-question technical assessment in "${skill}".
User Role: ${isMentor ? "MENTOR (evaluate mentoring pedagogy, code review competence, and architectural auditing)" : "STUDENT (evaluate direct technical comprehension, coding patterns, and problem solving)"}.
${difficultyGuidelines}
${profileContext}

CRITICAL RULES:
1. Every question must have exactly 4 distinct, plausible multiple-choice options.
2. The options must be mutually exclusive and clear. Avoid vague or overlapping choices.
3. The "correctAnswer" must be a 0-indexed integer (0 for option 1, 1 for option 2, 2 for option 3, 3 for option 4).
4. Provide a thorough "explanation" analyzing the correct answer and why other options are incorrect.
5. All questions must directly relate to the targeted skill "${skill}" and adhere to the ${normDifficulty} level.

OUTPUT FORMAT:
Respond with ONLY valid JSON (no markdown formatting, no code fencing). The JSON must conform strictly to this format:
{
  "skillName": "${skill}",
  "difficulty": "${normDifficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Clear, scenario-based technical question",
      "options": [
        "A) Option 1",
        "B) Option 2",
        "C) Option 3",
        "D) Option 4"
      ],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this answer is correct."
    }
  ]
}`;

  const messages: GroqChatMessage[] = [
    {
      role: "system",
      content: "You are an expert technical evaluator and curriculum architect. Output strictly valid JSON conforming to the requested schema.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const rawJson = await callGroqChat({ messages, temperature: 0.2 });
  if (!rawJson) return null;

  try {
    const parsed = JSON.parse(rawJson);
    const validated = groqQuizResponseSchema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
    console.warn("Groq Quiz validation failed:", validated.error);
    return null;
  } catch (e) {
    console.warn("Failed to parse Groq Quiz JSON:", e);
    return null;
  }
}

/**
 * Generate personalized Career Guidance & Custom Roadmap via Groq AI
 */
export async function generateGroqCareerGuidance({
  targetRole,
  currentSkills = [],
  interests = [],
  education = "",
  assessmentScore = null,
}: {
  targetRole: string;
  currentSkills?: string[];
  interests?: string[];
  education?: string;
  assessmentScore?: number | null;
}): Promise<GroqCareerGuidance | null> {
  const prompt = `You are the Lead AI Career Strategist for SkillVerse.
Create a personalized, actionable career guidance roadmap for a student aiming for the target role: "${targetRole}".

Candidate Profile:
- Current Verified/Practiced Skills: ${currentSkills.length > 0 ? currentSkills.join(", ") : "Beginner / Foundational"}
- Technical Interests: ${interests.length > 0 ? interests.join(", ") : "General Software Engineering"}
- Education Background: ${education || "Undergraduate / Self-taught"}
${assessmentScore !== null ? `- Latest Skill Assessment Score: ${assessmentScore}%` : ""}

REQUIREMENTS:
1. Analyze their current skill gap toward the target role.
2. Produce 4 to 5 sequential learning milestones from BASELINE foundations to CAPSTONE.
3. Include real-world resources and recommended mentor specializations.
4. Suggest a high-impact capstone portfolio project with tangible deliverables.

OUTPUT FORMAT:
Respond with ONLY valid JSON (no markdown formatting, no code fencing). The JSON must conform strictly to this format:
{
  "targetRole": "${targetRole}",
  "careerSummary": "2-3 sentence strategic executive summary of the pathway and employment outlook.",
  "marketDemand": "e.g. High Demand (94% hiring index)",
  "estimatedMonths": "e.g. 4 - 6 Months",
  "keySkillGaps": ["Gap 1", "Gap 2", "Gap 3"],
  "milestones": [
    {
      "id": "m-1",
      "stage": "BASELINE",
      "title": "Stage 1: Title",
      "description": "Clear explanation of goals for this stage",
      "skills": ["Skill A", "Skill B"],
      "resources": ["Doc/Resource 1", "Doc/Resource 2"],
      "recommendedMentorRole": "e.g. Frontend Specialist"
    },
    {
      "id": "m-2",
      "stage": "SKILL_GAP",
      "title": "Stage 2: Title",
      "description": "Clear explanation",
      "skills": ["Skill C", "Skill D"],
      "resources": ["Resource 1"],
      "recommendedMentorRole": "e.g. Backend Architect"
    },
    {
      "id": "m-3",
      "stage": "RECOMMENDED",
      "title": "Stage 3: Title",
      "description": "Clear explanation",
      "skills": ["Skill E"],
      "resources": ["Resource 1"],
      "recommendedMentorRole": "e.g. DevOps Engineer"
    },
    {
      "id": "m-4",
      "stage": "CAPSTONE",
      "title": "Stage 4: Production Capstone Project",
      "description": "Building and deploying end-to-end portfolio proof-of-work",
      "skills": ["End-to-End Delivery", "Cloud Deployment"],
      "resources": ["Vercel/AWS Docs"],
      "recommendedMentorRole": "e.g. Capstone Mentor"
    }
  ],
  "capstoneProjectIdea": {
    "title": "e.g. Distributed Real-Time Collaboration Platform",
    "description": "Detailed project description that proves mastery for hiring managers.",
    "deliverables": [
      "Full-stack Next.js 16 + PostgreSQL schema",
      "Live deployed URL with automated CI/CD",
      "Clean architecture with comprehensive test coverage"
    ]
  }
}`;

  const messages: GroqChatMessage[] = [
    {
      role: "system",
      content: "You are an elite software career strategist. Output strictly valid JSON conforming to the requested schema.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const rawJson = await callGroqChat({ messages, temperature: 0.3 });
  if (!rawJson) return null;

  try {
    const parsed = JSON.parse(rawJson);
    const validated = groqCareerGuidanceSchema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
    console.warn("Groq Career Guidance validation failed:", validated.error);
    return null;
  } catch (e) {
    console.warn("Failed to parse Groq Career Guidance JSON:", e);
    return null;
  }
}
