import { z } from "zod";

export const CATEGORY_OPTIONS = [
  "Frontend",
  "Backend",
  "Mobile",
  "UI/UX Design",
  "AI / ML",
  "DevOps & Cloud",
  "Data Science",
  "Cybersecurity",
] as const;

export const createPostSchema = z.object({
  skillName: z.string().min(2, "Skill name must be at least 2 characters").max(50),
  category: z.string().min(2, "Please select a valid category").max(50),
  title: z.string().min(5, "Title must be at least 5 characters").max(120),
  description: z.string().min(15, "Please provide a detailed description (at least 15 characters)").max(2000),
  pricingType: z.enum(["FREE", "PAID"]),
  priceAmount: z.number().min(0, "Price must be positive").max(100000).optional().nullable(),
  availability: z.string().min(3, "Availability is required").max(120),
});

export const updatePostStatusSchema = z.object({
  id: z.string().min(1, "Post ID is required"),
  status: z.enum(["ACTIVE", "PAUSED", "REMOVED"]),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostStatusInput = z.infer<typeof updatePostStatusSchema>;
