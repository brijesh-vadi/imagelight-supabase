import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.email("Please enter a valid email address"),

    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupForm = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  password: z.string().min(1, "Password is required"),
});

export type SigninForm = z.infer<typeof signinSchema>;
