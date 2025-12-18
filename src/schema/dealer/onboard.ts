import { z } from "zod";

export const dealerOnboardingSchema = z.object({
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
    )
    .optional()
    .or(z.literal("")),

  address: z
    .string({ message: "Address is required" })
    .min(10, "Address must be at least 10 characters"),

  city: z
    .string({ message: "City is required" })
    .min(2, "City must be at least 2 characters"),

  state: z
    .string({ message: "State is required" })
    .min(2, "State must be at least 2 characters"),

  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid PIN code"),

  companyLogo: z.any(),

  verificationDocument: z.any(),
});

export type DealerOnboardingForm = z.infer<typeof dealerOnboardingSchema>;
