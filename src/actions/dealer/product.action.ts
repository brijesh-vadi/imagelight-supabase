"use server";

import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, Product } from "@/types";
import { Role } from "@/types";

interface GetDealerProductsParams {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  unitId?: string;
}

export async function getDealerProducts({
  page = 1,
  limit = 20,
  search,
  categoryId,
  unitId,
}: GetDealerProductsParams): Promise<
  ApiResponse<{ products: Product[]; total: number }>
> {
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  try {
    const { data: approvedManufacturers, error: approvalError } = await supabase
      .from("dealer_application_history")
      .select("manufacturer_id")
      .eq("dealer_id", session?.userId)
      .eq("status", "APPROVED");

    if (approvalError) {
      console.error("Approval check error:", approvalError);
      return {
        success: false,
        message: "Failed to check approved manufacturers.",
      };
    }

    if (!approvedManufacturers || approvedManufacturers.length === 0) {
      return {
        success: true,
        data: {
          products: [],
          total: 0,
        },
      };
    }

    const approvedManufacturerIds = [
      ...new Set(approvedManufacturers.map((m) => m.manufacturer_id)),
    ];

    let query = supabase
      .from("products")
      .select(
        `
        *,
        unit:unit(id, name),
        category:categories!products_category_id_fkey(id, name),
        manufacturer:manufacturer_id(id, company_name, company_logo)
      `,
        { count: "exact" },
      )
      .in("manufacturer_id", approvedManufacturerIds)
      .eq("is_active", true);

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`,
      );
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (unitId) {
      query = query.eq("unit_id", unitId);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const {
      data: products,
      error: productsError,
      count,
    } = await query.order("created_at", { ascending: false }).range(from, to);

    if (productsError) {
      console.error("Products fetch error:", productsError);
      return {
        success: false,
        message: "Failed to fetch products.",
      };
    }

    return {
      success: true,
      data: {
        products: products || [],
        total: count || 0,
      },
    };
  } catch (err) {
    console.error("Unexpected error in getDealerProducts:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}


export async function getDealerProductById(
  productId: string
): Promise<ApiResponse<Product>> {
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return {
      success: false,
      message: "Unauthorized. Please login again.",
    };
  }

  try {
    // First check if the dealer is approved by the manufacturer of this product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(
        `
        *,
        unit:unit(id, name),
        category:categories!products_category_id_fkey(id, name),
        manufacturer:manufacturer_id(id, company_name, company_logo, email, mobile, address, city, state, pincode, website, company_description)
      `
      )
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    // Check if dealer is approved by this manufacturer
    const { data: approval } = await supabase
      .from("dealer_application_history")
      .select("status")
      .eq("dealer_id", session.userId)
      .eq("manufacturer_id", product.manufacturer_id)
      .eq("status", "APPROVED")
      .maybeSingle();

    if (!approval) {
      return {
        success: false,
        message: "You don't have access to view this product. Please apply for dealership with this manufacturer.",
      };
    }

    return {
      success: true,
      data: product,
    };
  } catch (err) {
    console.error("Unexpected error in getDealerProductById:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
