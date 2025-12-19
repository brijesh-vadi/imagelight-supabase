"use server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, Manufacturer, Pagination, Product } from "@/types";

export type ManufacturerListItem = Pick<
  Manufacturer,
  | "id"
  | "company_name"
  | "company_logo"
  | "contact_person"
  | "gst_number"
  | "email"
  | "mobile"
  | "address"
  | "city"
  | "state"
  | "pincode"
  | "website"
  | "company_description"
> & { products?: Product[]; totalProducts?: number };

export async function getAllManufacturers({
  page = 1,
  limit = 20,
}: Pagination): Promise<
  ApiResponse<{ manufacturers: ManufacturerListItem[]; total: number }>
> {
  const supabase = await createClient();

  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("manufacturer")
      .select(
        "id, company_name, company_logo, contact_person, gst_number, email, mobile, address, city, state, pincode, website, company_description",
        { count: "exact" },
      )
      .eq("is_active", true)
      .eq("application_status", "APPROVED")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return {
        success: false,
        message: "Failed to fetch manufacturers.",
      };
    }

    return {
      success: true,
      data: {
        manufacturers: data ?? [],
        total: count ?? 0,
      },
    };
  } catch (err) {
    console.error("Unexpected error in getAllManufacturers:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function getManufacturerById(
  manufacturerId: string,
  includeProducts: boolean = false,
): Promise<
  ApiResponse<Manufacturer & { products?: Product[]; totalProducts?: number }>
> {
  const supabase = await createClient();

  const baseFields = `
    id,
    company_name,
    company_logo,
    contact_person,
    gst_number,
    email,
    mobile,
    address,
    city,
    state,
    pincode,
    website,
    company_description
  `;

  try {
    // ---------- Get Manufacturer ----------
    const { data: manufacturer, error } = await supabase
      .from("manufacturer")
      .select(baseFields)
      .eq("id", manufacturerId)
      .single();

    if (error) {
      console.error(error);
      return {
        success: false,
        message: "Failed to fetch manufacturer details.",
      };
    }

    if (!manufacturer) {
      return {
        success: false,
        message: "Manufacturer not found.",
      };
    }

    // ---------- Optionally Fetch Products ----------
    let products: Product[] | undefined;
    let totalProducts = 0;

    if (includeProducts) {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(
          ` *,
          unit:unit(id, name),
          category:categories(id, name)
        `,
          { count: "exact" },
        )
        .eq("manufacturer_id", manufacturerId)
        .order("created_at", { ascending: false })
        .limit(3);

      const { count, error: countError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("manufacturer_id", manufacturerId);

      if (!productError) {
        products = productData ?? [];
        totalProducts = count ?? 0;
      }

      if (!countError) {
        totalProducts = count ?? 0;
      }
    }

    return {
      success: true,
      data: {
        ...manufacturer,
        products,
        totalProducts,
      } as Manufacturer & { products?: Product[]; totalProducts: number },
    };
  } catch (err) {
    console.error("Unexpected error in getManufacturerById:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
