import { z } from "zod";

export const addProductSchema = z
  .object({
    name: z
      .string()
      .min(1, "Product name is required")
      .min(3, "Product name must be at least 3 characters")
      .max(100, "Product name must be at most 100 characters")
      .trim(),

    description: z
      .string()
      .max(2000, "Description must be at most 2000 characters")
      .optional()
      .or(z.literal("")),

    primaryImage: z
      .custom<File>((f) => f instanceof File, "Please upload a primary image")
      .refine((f) => f.size > 0, "Primary image is required")
      .refine(
        (f) => f.size <= 2 * 1024 * 1024,
        "Primary image must be less than 2MB",
      ),

    images: z
      .array(
        z
          .custom<File>((f) => f instanceof File)
          .refine(
            (f) => f.size <= 2 * 1024 * 1024,
            "Each image must be less than 2MB",
          ),
      )
      .max(3, "Maximum 3 additional images allowed")
      .optional(),

    sku: z
      .string()
      .min(1, "SKU is required")
      .max(50, "SKU must be at most 50 characters")
      .trim(),

    stock: z
      .number({ message: "Stock must be a number" })
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative"),

    minOrderQuantity: z
      .number({ message: "Min order quantity must be a number" })
      .int("Min order quantity must be a whole number")
      .min(1, "Min order quantity must be at least 1"),

    regularPrice: z
      .number({ message: "Regular price must be a number" })
      .positive("Regular price must be greater than 0"),

    dealerPrice: z
      .number({ message: "Dealer price must be a number" })
      .positive("Dealer price must be greater than 0"),

    unitId: z.uuid({ message: "Please select a unit" }),

    categoryId: z.uuid("Please select a category"),

    isActive: z.boolean().catch(true),
    inStock: z.boolean().catch(true),
  })
  .refine((data) => data.dealerPrice <= data.regularPrice, {
    message: "Dealer price cannot be higher than regular price",
    path: ["dealerPrice"],
  });

export type AddProductForm = z.infer<typeof addProductSchema>;
