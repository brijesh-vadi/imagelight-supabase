"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import { type ApiResponse, Role } from "@/types";

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
