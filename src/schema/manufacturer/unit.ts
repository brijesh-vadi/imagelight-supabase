import { z } from "zod";

export const unitSchema = z.object({
  name: z
    .string()
    .min(1, "Unit name is required")
    .min(2, "Unit name must be at least 2 characters")
    .max(20, "Unit name must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9\s\-/()]+$/,
      "Unit name can only contain letters, numbers, spaces, hyphens, slashes, and parentheses",
    ),
});

export type UnitForm = z.infer<typeof unitSchema>;
