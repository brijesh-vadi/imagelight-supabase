"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import {
  type CategoryForm,
  categorySchema,
} from "@/schema/manufacturer/category";
import { type ApiResponse, type Category, Role } from "@/types";

export async function addCategory(
  data: CategoryForm,
): Promise<ApiResponse<Category>> {
  const session = await getSession(Role.MANUFACTURER);
  const supabase = await createClient();

  try {
    const parsed = categorySchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: "Failed to validate data." };
    }

    const { name, isActive } = parsed.data;

    const { data: category, error } = await supabase
      .from("categories")
      .insert({
        name,
        manufacturer_id: session?.userId,
        is_active: isActive,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return {
          success: false,
          message: "A category with this name already exists.",
        };
      }
      return { success: false, message: "Failed to create category." };
    }

    revalidatePath("/manufacturer/categories");
    return {
      success: true,
      data: category,
      message: "Category added successfully",
    };
  } catch (err) {
    console.error("addCategory error:", err);
    return { success: false, message: "Unexpected server error" };
  }
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const session = await getSession(Role.MANUFACTURER);
    const supabase = await createClient();

    if (!session?.userId) {
      return { success: true, data: [] };
    }

    const { data, error } = await supabase
      .from("categories")
      .select(
        `
        id,
        name,
        is_active,
        created_at,
        updated_at,
        manufacturer_id,
        products:products(count)
      `,
      )
      .eq("manufacturer_id", session.userId)
      .order("name", { ascending: true });

    if (error) {
      return { success: false, message: "Failed to fetch categories" };
    }

    const categoriesWithCount = data?.map((category) => ({
      ...category,
      product_count: category.products?.[0]?.count || 0,
      products: undefined,
    }));

    return { success: true, data: categoriesWithCount || [] };
  } catch (err) {
    console.error("getCategories unexpected error:", err);
    return { success: false, message: "Something went wrong on our side" };
  }
}

export async function updateCategory(
  categoryId: string,
  data: CategoryForm,
): Promise<ApiResponse<Category>> {
  try {
    const session = await getSession(Role.MANUFACTURER);
    const supabase = await createClient();

    const parsed = categorySchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: "Invalid category name" };
    }

    const { name, isActive } = parsed.data;

    // Check for duplicate name (case-insensitive)
    const { data: duplicate } = await supabase
      .from("categories")
      .select("id")
      .eq("manufacturer_id", session?.userId)
      .ilike("name", name)
      .neq("id", categoryId)
      .limit(1);

    if (duplicate && duplicate.length > 0) {
      return {
        success: false,
        message: "A category with this name already exists",
      };
    }

    const updatePayload: { name: string; is_active?: boolean } = { name };

    if (isActive !== undefined) {
      updatePayload.is_active = isActive;
    }

    const { data: updatedCategory, error } = await supabase
      .from("categories")
      .update(updatePayload)
      .eq("id", categoryId)
      .eq("manufacturer_id", session?.userId)
      .select()
      .single();

    if (error || !updatedCategory) {
      return {
        success: false,
        message: "Category not found or you don't have permission",
      };
    }

    revalidatePath("/manufacturer/categories");
    return {
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    };
  } catch (err) {
    console.error("updateCategory unexpected error:", err);
    return {
      success: false,
      message: "Something went wrong while updating the category",
    };
  }
}

export async function deleteCategory(
  categoryId: string,
): Promise<ApiResponse<null>> {
  try {
    const session = await getSession(Role.MANUFACTURER);
    const supabase = await createClient();

    // Check if category is being used by any products
    const { data: products, error: checkError } = await supabase
      .from("products")
      .select("id")
      .eq("category_id", categoryId)
      .eq("manufacturer_id", session?.userId)
      .limit(1);

    if (checkError) {
      return { success: false, message: "Failed to verify category usage" };
    }

    if (products && products.length > 0) {
      return {
        success: false,
        message:
          "Cannot delete category. It is currently being used by one or more products.",
      };
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId)
      .eq("manufacturer_id", session?.userId);

    if (error) {
      return { success: false, message: "Failed to delete category" };
    }

    revalidatePath("/manufacturer/categories");
    return { success: true, message: "Category deleted successfully" };
  } catch (err) {
    console.error("deleteCategory unexpected error:", err);
    return {
      success: false,
      message: "Something went wrong while deleting the category",
    };
  }
}
