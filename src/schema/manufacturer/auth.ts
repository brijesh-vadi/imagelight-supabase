import { z } from "zod";

// sign up schema
export const signupSchema = z
  .object({
    email: z.email("Invalid email address"),

    mobile: z
      .string()
      .min(10, "Mobile number must be at least 10 digits")
      .max(10, "Mobile number must be at least 10 digits")
      .regex(/^[0-9]+$/, "Mobile number must contain only digits"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password too long"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpForm = z.infer<typeof signupSchema>;

// sign in schema
export const signInSchema = z.object({
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(10, "Mobile number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Mobile number must contain only digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInForm = z.infer<typeof signInSchema>;
