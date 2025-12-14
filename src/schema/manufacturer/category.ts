import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be at most 50 characters")
    .trim(),
  isActive: z.boolean().optional(),
});

export type CategoryForm = z.infer<typeof categorySchema>;
