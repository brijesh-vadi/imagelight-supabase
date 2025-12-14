"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import {
  type ApiResponse,
  type Manufacturer,
  type Pagination,
  Role,
} from "@/types";

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

export async function getManufacturerById(
  manufacturerId: string,
): Promise<ApiResponse<Manufacturer>> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("manufacturer")
      .select(`
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
        company_description,
        verification_document,
        business_type,
        application_status,
        is_onboarded,
        is_active,
        is_verified,
        is_email_verified,
        is_mobile_verified,
        created_at,
        updated_at
      `)
      .eq("id", manufacturerId)
      .single();

    if (error) {
      return {
        success: false,
        message: "Failed to fetch manufacturer details.",
      };
    }

    if (!data) {
      return {
        success: false,
        message: "Manufacturer not found.",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (err) {
    console.error("Unexpected error in getManufacturerById:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function startManufacturerReview(
  manufacturerId: string,
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const session = await getSession(Role.ADMIN);

  try {
    const { error: updateError } = await supabase
      .from("manufacturer")
      .update({
        application_status: "IN_REVIEW",
      })
      .eq("id", manufacturerId);

    if (updateError) {
      return {
        success: false,
        message: "Failed to start review. Please try again.",
      };
    }

    await supabase.from("manufacturer_application_history").insert({
      manufacturer_id: manufacturerId,
      status: "IN_REVIEW",
      admin_id: session?.userId,
      message: null,
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${manufacturerId}`);

    return {
      success: true,
      message: "Review started successfully.",
    };
  } catch (err) {
    console.error("Unexpected error in startManufacturerReview:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function approveManufacturerApplication(
  manufacturerId: string,
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const session = await getSession(Role.ADMIN);
  try {
    const { error: updateError } = await supabase
      .from("manufacturer")
      .update({
        application_status: "APPROVED",
        is_verified: true,
        is_active: true,
      })
      .eq("id", manufacturerId);

    if (updateError) {
      return { success: false, message: "Failed to approve application." };
    }

    await supabase.from("manufacturer_application_history").insert({
      manufacturer_id: manufacturerId,
      status: "APPROVED",
      admin_id: session?.userId,
      message: null,
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${manufacturerId}`);

    return { success: true, message: "Application approved successfully!" };
  } catch (err) {
    console.error("Unexpected error approving application:", err);
    return { success: false, message: "Something went wrong." };
  }
}

export async function rejectManufacturerApplication(
  manufacturerId: string,
  message: string,
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const session = await getSession(Role.ADMIN);
  try {
    const { error: updateError } = await supabase
      .from("manufacturer")
      .update({
        application_status: "REJECTED",
      })
      .eq("id", manufacturerId);

    if (updateError) {
      return { success: false, message: "Failed to reject application." };
    }

    await supabase.from("manufacturer_application_history").insert({
      manufacturer_id: manufacturerId,
      status: "REJECTED",
      admin_id: session?.userId,
      message: message.trim(),
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${manufacturerId}`);

    return { success: true, message: "Application rejected." };
  } catch (err) {
    console.error("Unexpected error rejecting application:", err);
    return { success: false, message: "Something went wrong." };
  }
}
