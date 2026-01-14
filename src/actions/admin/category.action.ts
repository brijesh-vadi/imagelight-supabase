"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, Category } from "@/types";
import { Role } from "@/types";

/**
 * Add new category
 */
export async function addCategory(data: {
  name: string;
  category_type: string;
  parent_id?: string | null;
  description?: string;
}): Promise<ApiResponse<{ category: Category }>> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.ADMIN);

    if (!session?.userId) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if slug already exists
    const { data: existingCategory } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingCategory) {
      return {
        success: false,
        message: "A category with this name already exists",
      };
    }

    // Determine level based on parent
    let level = 0;
    if (data.parent_id) {
      const { data: parentCategory } = await supabase
        .from("categories")
        .select("level")
        .eq("id", data.parent_id)
        .single();

      if (parentCategory) {
        level = parentCategory.level + 1;
      }
    }

    // Get max display_order for this parent
    const { data: maxOrderCategory } = await supabase
      .from("categories")
      .select("display_order")
      .eq("parent_id", data.parent_id || null)
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const display_order = maxOrderCategory
      ? maxOrderCategory.display_order + 1
      : 0;

    // Insert category
    const { data: category, error } = await supabase
      .from("categories")
      .insert({
        name: data.name,
        slug,
        category_type: data.category_type,
        parent_id: data.parent_id || null,
        description: data.description || null,
        level,
        display_order,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Add category error:", error);
      return { success: false, message: "Failed to add category" };
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category added successfully",
      data: { category },
    };
  } catch (error) {
    console.error("Add category error:", error);
    return { success: false, message: "Failed to add category" };
  }
}

/**
 * Update category
 */
export async function updateCategory(
  id: string,
  data: {
    name?: string;
    category_type?: string;
    description?: string;
    is_active?: boolean;
  },
): Promise<ApiResponse<{ category: Category }>> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.ADMIN);

    if (!session?.userId) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    const updateData: Record<string, unknown> = {};

    if (data.name) {
      updateData.name = data.name;
      updateData.slug = data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    if (data.category_type) {
      updateData.category_type = data.category_type;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.is_active !== undefined) {
      updateData.is_active = data.is_active;
    }

    const { data: category, error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update category error:", error);
      return { success: false, message: "Failed to update category" };
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category updated successfully",
      data: { category },
    };
  } catch (error) {
    console.error("Update category error:", error);
    return { success: false, message: "Failed to update category" };
  }
}

/**
 * Delete category
 */
export async function deleteCategory(
  id: string,
): Promise<ApiResponse<{ category: Category }>> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.ADMIN);

    if (!session?.userId) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    // Check if category has children
    const { data: children } = await supabase
      .from("categories")
      .select("id")
      .eq("parent_id", id)
      .limit(1);

    if (children && children.length > 0) {
      return {
        success: false,
        message: "Cannot delete category with subcategories",
      };
    }

    const { data: category, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Delete category error:", error);
      return { success: false, message: "Failed to delete category" };
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category deleted successfully",
      data: { category },
    };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, message: "Failed to delete category" };
  }
}
