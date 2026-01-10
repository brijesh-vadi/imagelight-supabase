import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must not exceed 100 characters")
    .trim(),
  category_type: z.string().min(1, "Category type is required"),
  parent_id: z.string().uuid().optional().nullable(),
  description: z.string().max(500).optional().nullable(),
});

export type CategoryForm = z.infer<typeof categorySchema>;
