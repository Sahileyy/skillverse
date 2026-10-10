import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.enum(["STUDENT", "MENTOR"]).optional(),
  education: z.string().max(200).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  headline: z.string().max(200).optional().nullable(),
  skills: z.array(z.string().min(1).max(50)).max(30).default([]),
  interests: z.array(z.string().min(1).max(50)).max(30).default([]),
  careerGoal: z.string().max(200).optional().nullable(),
  mentorLevel: z.string().max(100).optional().nullable(),
  mentorScore: z.number().min(0).max(100).optional().nullable(),
  image: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  linkedinUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
