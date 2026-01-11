"use server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, Category } from "@/types";

/**
 * Get all parent categories (for manufacturers to select)
 */
export async function getParentCategories(): Promise<
  ApiResponse<{ categories: Category[] }>
> {
  try {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .is("parent_id", null)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Get parent categories error:", error);
      return { success: false, message: "Failed to fetch parent categories" };
    }

    return { success: true, data: { categories: categories || [] } };
  } catch (error) {
    console.error("Get parent categories error:", error);
    return { success: false, message: "Failed to fetch parent categories" };
  }
}

/**
 * Get child categories by parent ID
 */
export async function getChildCategories(
  parentId: string,
): Promise<ApiResponse<{ categories: Category[] }>> {
  try {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .eq("parent_id", parentId)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Get child categories error:", error);
      return { success: false, message: "Failed to fetch child categories" };
    }

    return { success: true, data: { categories: categories || [] } };
  } catch (error) {
    console.error("Get child categories error:", error);
    return { success: false, message: "Failed to fetch child categories" };
  }
}

/**
 * Get all categories (for backward compatibility)
 */
export async function getCategories(): Promise<
  ApiResponse<{ categories: Category[] }>
> {
  try {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("level", { ascending: true })
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Get categories error:", error);
      return { success: false, message: "Failed to fetch categories" };
    }

    return { success: true, data: { categories: categories || [] } };
  } catch (error) {
    console.error("Get categories error:", error);
    return { success: false, message: "Failed to fetch categories" };
  }
}

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
