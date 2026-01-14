import { z } from "zod";

export const dealerSchema = z
  .object({
    email: z.email("Please enter a valid email address"),

    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),

    companyName: z.string().min(2),
    contactPerson: z.string().min(2),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type DealerForm = z.infer<typeof dealerSchema>;
