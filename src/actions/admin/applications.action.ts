"use server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, Manufacturer, Pagination } from "@/types";

export async function getAllManufacturers({
  page = 1,
  limit = 20,
}: Pagination): Promise<ApiResponse<Manufacturer[]>> {
  const supabase = await createClient();

  try {
    const query = supabase
      .from("manufacturer")
      .select(
        `
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
        created_at,
        updated_at,
        company_description,
        verification_document,
        business_type,
        application_status,
        is_onboarded,
        is_active,
        is_verified,
        is_email_verified,
        is_mobile_verified
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await query.range(from, to);

    if (error) {
      return {
        success: false,
        message: "Failed to fetch manufacturers.",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("Unexpected error in getAllManufacturers:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
