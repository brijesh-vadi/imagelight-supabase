"use server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, Category } from "@/types";

/**
 * Get categories that have products from the current manufacturer
 */
export async function getManufacturerUsedCategories(): Promise<
  ApiResponse<{ categories: Category[] }>
> {
  try {
    const supabase = await createClient();

    // Get distinct category IDs from products for this manufacturer
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("category_id")
      .not("category_id", "is", null);

    if (productsError) {
      console.error("Get manufacturer products error:", productsError);
      return { success: false, message: "Failed to fetch categories" };
    }

    // Extract unique category IDs
    const categoryIds = [
      ...new Set(products?.map((p) => p.category_id).filter(Boolean)),
    ];

    if (categoryIds.length === 0) {
      return { success: true, data: { categories: [] } };
    }

    // Fetch categories with those IDs
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .in("id", categoryIds)
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("Get categories error:", error);
      return { success: false, message: "Failed to fetch categories" };
    }

    return { success: true, data: { categories: categories || [] } };
  } catch (error) {
    console.error("Get manufacturer used categories error:", error);
    return { success: false, message: "Failed to fetch categories" };
  }
}
