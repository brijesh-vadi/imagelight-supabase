"use server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, Category, Product } from "@/types";

/**
 * Get all active products with their categories (public access)
 */
export async function getPublicProducts(
  categoryId?: string,
  page = 1,
  limit = 12,
): Promise<
  ApiResponse<{ products: Product[]; total: number; totalPages: number }>
> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count
    let countQuery = supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("in_stock", true);

    if (categoryId) {
      countQuery = countQuery.eq("category_id", categoryId);
    }

    const { count } = await countQuery;

    // Get products
    let query = supabase
      .from("products")
      .select(
        `
          *,
          unit (
            id,
            name
          ),
          category:categories!products_category_id_fkey (
            id,
            name,
            parent_id
          ),
          manufacturer (
            id,
            company_name,
            company_logo
          )
        `,
      )
      .eq("is_active", true)
      .eq("in_stock", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getPublicProducts] Query error:", error);
      return {
        success: false,
        message: "Failed to fetch products",
      };
    }

    // Fetch parent categories for products
    if (data && data.length > 0) {
      const parentIds = data
        .map((p: any) => p.category?.parent_id)
        .filter((id): id is string => !!id);

      if (parentIds.length > 0) {
        const { data: parents } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", parentIds);

        if (parents) {
          data.forEach((product: any) => {
            if (product.category?.parent_id) {
              const parent = parents.find(
                (p) => p.id === product.category.parent_id,
              );
              if (parent) {
                product.category.parent = parent;
              }
              delete product.category.parent_id;
            }
          });
        }
      }
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      success: true,
      data: {
        products: data ?? [],
        total: count || 0,
        totalPages,
      },
    };
  } catch (err) {
    console.error("[getPublicProducts] Unexpected error:", err);
    return {
      success: false,
      message: "Unexpected server error",
    };
  }
}

/**
 * Get categories that have active products (public access)
 */
export async function getPublicCategoriesWithProducts(): Promise<
  ApiResponse<{ categories: Category[] }>
> {
  try {
    const supabase = await createClient();

    // Get distinct category IDs from active products
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("category_id")
      .eq("is_active", true)
      .eq("in_stock", true)
      .not("category_id", "is", null);

    if (productsError) {
      console.error("[getPublicCategoriesWithProducts] Error:", productsError);
      return { success: false, message: "Failed to fetch categories" };
    }

    const categoryIds = [
      ...new Set(products?.map((p) => p.category_id).filter(Boolean)),
    ];

    if (categoryIds.length === 0) {
      return { success: true, data: { categories: [] } };
    }

    // Fetch categories (only child categories)
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .in("id", categoryIds)
      .not("parent_id", "is", null) // Only child categories
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("[getPublicCategoriesWithProducts] Error:", error);
      return { success: false, message: "Failed to fetch categories" };
    }

    return { success: true, data: { categories: categories || [] } };
  } catch (error) {
    console.error("[getPublicCategoriesWithProducts] Error:", error);
    return { success: false, message: "Failed to fetch categories" };
  }
}

/**
 * Get a single product by ID (public access)
 */
export async function getPublicProductById(
  productId: string,
): Promise<ApiResponse<{ product: Product }>> {
  try {
    const supabase = await createClient();

    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
          *,
          unit (
            id,
            name
          ),
          category:categories!products_category_id_fkey (
            id,
            name,
            parent_id
          ),
          manufacturer (
            id,
            company_name,
            company_logo,
            city,
            state
          )
        `,
      )
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("[getPublicProductById] Query error:", error);
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Fetch parent category if exists
    if (product?.category?.parent_id) {
      const { data: parent } = await supabase
        .from("categories")
        .select("id, name")
        .eq("id", product.category.parent_id)
        .single();

      if (parent) {
        product.category.parent = parent;
      }
      delete product.category.parent_id;
    }

    return {
      success: true,
      data: { product },
    };
  } catch (err) {
    console.error("[getPublicProductById] Unexpected error:", err);
    return {
      success: false,
      message: "Unexpected server error",
    };
  }
}

/**
 * Get products from the same manufacturer (public access)
 */
export async function getProductsByManufacturer(
  manufacturerId: string,
  excludeProductId?: string,
  page = 1,
  limit = 8,
): Promise<
  ApiResponse<{ products: Product[]; total: number; totalPages: number }>
> {
  try {
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count
    let countQuery = supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("manufacturer_id", manufacturerId)
      .eq("is_active", true)
      .eq("in_stock", true);

    if (excludeProductId) {
      countQuery = countQuery.neq("id", excludeProductId);
    }

    const { count } = await countQuery;

    // Get products
    let query = supabase
      .from("products")
      .select(
        `
          *,
          unit (
            id,
            name
          ),
          category:categories!products_category_id_fkey (
            id,
            name,
            parent_id
          ),
          manufacturer (
            id,
            company_name,
            company_logo
          )
        `,
      )
      .eq("manufacturer_id", manufacturerId)
      .eq("is_active", true)
      .eq("in_stock", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (excludeProductId) {
      query = query.neq("id", excludeProductId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getProductsByManufacturer] Query error:", error);
      return {
        success: false,
        message: "Failed to fetch products",
      };
    }

    // Fetch parent categories for products
    if (data && data.length > 0) {
      const parentIds = data
        .map((p: any) => p.category?.parent_id)
        .filter((id): id is string => !!id);

      if (parentIds.length > 0) {
        const { data: parents } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", parentIds);

        if (parents) {
          data.forEach((product: any) => {
            if (product.category?.parent_id) {
              const parent = parents.find(
                (p) => p.id === product.category.parent_id,
              );
              if (parent) {
                product.category.parent = parent;
              }
              delete product.category.parent_id;
            }
          });
        }
      }
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      success: true,
      data: {
        products: data ?? [],
        total: count || 0,
        totalPages,
      },
    };
  } catch (err) {
    console.error("[getProductsByManufacturer] Unexpected error:", err);
    return {
      success: false,
      message: "Unexpected server error",
    };
  }
}
