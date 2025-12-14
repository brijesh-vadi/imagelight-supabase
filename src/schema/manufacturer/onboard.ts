import { z } from "zod";

const baseSchema = z.object({
  companyName: z
    .string({ message: "Company Name is required" })
    .min(5, "Company name must be at least 5 characters")
    .max(50, "Company name must be at most 50 characters"),

  contactPerson: z
    .string({ message: "Contact person name is required" })
    .min(2, "Contact person name must be at least 2 characters")
    .max(30, "Contact person name must be at most 100 characters"),

  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number",
    ),

  description: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .max(500, "Description must be at most 1000 characters"),

  website: z.url("Please enter a valid URL").optional().or(z.literal("")),

  address: z.string().min(10, "Address must be at least 10 characters"),

  state: z
    .string({ message: "State is required" })
    .min(2, "State must be at least 2 characters"),

  city: z
    .string({ message: "City is required" })
    .min(2, "City must be at least 2 characters"),

  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid PIN code"),
});

const companyLogoSchema = z.any();

const verificationDocSchema = z.any();

const urlString = z.string().min(1, { message: "File is required" });

// 1. First-time Onboarding Schema — MUST upload new files
export const onboardingSchema = baseSchema.extend({
  companyLogo: companyLogoSchema,
  verificationDocument: verificationDocSchema,
});

// 2. Resubmit/Update Schema — Accepts existing URL string OR new File
export const resubmitOnboardingSchema = baseSchema.extend({
  companyLogo: z.union([companyLogoSchema, urlString]),
  verificationDocument: z.union([verificationDocSchema, urlString]),
});

// Type exports
export type OnboardingForm = z.infer<typeof onboardingSchema>;
export type ResubmitOnboardingForm = z.infer<typeof resubmitOnboardingSchema>;
