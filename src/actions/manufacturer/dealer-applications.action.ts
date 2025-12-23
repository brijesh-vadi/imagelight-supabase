// "use server";

// import { createClient } from "@/lib/supabase/server";
// import { getSession } from "@/lib/supabase/session";
// import { type ApiResponse, type Dealer, type Pagination, Role } from "@/types";

// export async function getDealersAppliedToManufacturer({
//   page = 1,
//   limit = 20,
// }: Pagination): Promise<ApiResponse<Dealer[]>> {
//   const supabase = await createClient();
//   const session = await getSession(Role.MANUFACTURER);
//   try {
//     const from = (page - 1) * limit;
//     const to = from + limit - 1;

//     const { data, error } = await supabase
//       .from("dealer_application_history")
//       .select(
//         `
//         dealer:dealers!dealer_application_history_dealer_id_fkey (
//           id,
//           email,
//           mobile,
//           is_email_verified,
//           is_mobile_verified,
//           is_onboarded,
//           is_active,
//           company_name,
//           company_logo,
//           contact_person,
//           gst_number,
//           address,
//           city,
//           state,
//           pincode,
//           verification_document,
//           created_at,
//           updated_at
//         )
//       `,
//         { count: "exact" },
//       )
//       .eq("manufacturer_id", session?.userId)
//       .order("created_at", { ascending: false })
//       .range(from, to);

//     if (error) {
//       console.error("Supabase error:", error);
//       return {
//         success: false,
//         message: "Failed to fetch dealers who applied.",
//       };
//     }

//     const dealers: Dealer[] =
//       data?.map((row: any) => row.dealer).filter(Boolean) ?? [];

//     return {
//       success: true,
//       data: dealers,
//     };
//   } catch (err) {
//     console.error("Unexpected error in getDealersAppliedToManufacturer:", err);
//     return {
//       success: false,
//       message: "Something went wrong. Please try again.",
//     };
//   }
// }

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import {
  type ApiResponse,
  type ApplicationStatus,
  type Dealer,
  type DealerApplicationHistoryEntry,
  type Pagination,
  Role,
} from "@/types";

export async function getDealersAppliedToManufacturer({
  page = 1,
  limit = 20,
}: Pagination): Promise<
  ApiResponse<
    {
      dealer: Dealer;
      status: ApplicationStatus;
      message: string | null;
      created_at: string;
      updated_at: string;
    }[]
  >
> {
  const supabase = await createClient();
  const session = await getSession(Role.MANUFACTURER);

  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("dealer_application_history")
      .select(
        `
        status,
        message,
        created_at,
        updated_at,
        dealer:dealers!dealer_application_history_dealer_id_fkey (
          id,
          email,
          mobile,
          is_email_verified,
          is_mobile_verified,
          is_onboarded,
          is_active,
          company_name,
          company_logo,
          contact_person,
          gst_number,
          address,
          city,
          state,
          pincode,
          verification_document,
          created_at,
          updated_at
        )
      `,
        { count: "exact" },
      )
      .eq("manufacturer_id", session?.userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch dealers who applied.",
      };
    }

    const result =
      data?.map((row: any) => ({
        dealer: row.dealer,
        status: row.status,
        message: row.message,
        created_at: row.created_at,
        updated_at: row.updated_at,
      })) ?? [];

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function getDealerById(dealerId: string): Promise<
  ApiResponse<
    Dealer & {
      application_history?: DealerApplicationHistoryEntry[];
      application_status?: ApplicationStatus;
    }
  >
> {
  const supabase = await createClient();
  const session = await getSession(Role.MANUFACTURER);

  if (!session?.userId) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    // 1️⃣ Fetch Dealer Info
    const { data: dealer, error: dealerError } = await supabase
      .from("dealers")
      .select(
        `
        id,
        email,
        mobile,
        is_email_verified,
        is_mobile_verified,
        is_onboarded,
        is_active,
        company_name,
        company_logo,
        contact_person,
        gst_number,
        address,
        city,
        state,
        pincode,
        verification_document,
        created_at,
        updated_at
      `,
      )
      .eq("id", dealerId)
      .single();

    if (dealerError || !dealer) {
      return {
        success: false,
        message: "Dealer not found.",
      };
    }

    const { data: rawHistory } = await supabase
      .from("dealer_application_history")
      .select(
        `
          id,
          status,
          message,
          created_at,
          updated_at,
          approver:approver_id (
            id,
            company_name,
            email,
            mobile,
            company_logo
          )
        `,
      )
      .eq("dealer_id", dealerId)
      .eq("manufacturer_id", session.userId)
      .order("created_at", { ascending: true });

    const history: DealerApplicationHistoryEntry[] =
      rawHistory?.map((entry: any) => ({
        id: entry.id,
        status: entry.status,
        message: entry.message,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
        approver: entry.approver?.[0] ?? null, // 🔥 FIX HERE
      })) ?? [];

    // Get current application status from latest history entry
    const currentStatus =
      history.length > 0 ? history[history.length - 1].status : "PENDING";

    return {
      success: true,
      data: {
        ...dealer,
        application_history: history || [],
        application_status: currentStatus,
      },
    };
  } catch (err) {
    console.error("Unexpected error in getDealerById:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function startDealerReview(
  dealerId: string,
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const session = await getSession(Role.MANUFACTURER);

  if (!session?.userId) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    // Check the latest status
    const { data: latestEntry } = await supabase
      .from("dealer_application_history")
      .select("status")
      .eq("dealer_id", dealerId)
      .eq("manufacturer_id", session.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latestEntry) {
      return {
        success: false,
        message: "Application not found.",
      };
    }

    if (latestEntry.status !== "PENDING") {
      return {
        success: false,
        message: "Application is already under review or processed.",
      };
    }

    // Insert a new IN_REVIEW entry to preserve history
    const { error: insertError } = await supabase
      .from("dealer_application_history")
      .insert({
        dealer_id: dealerId,
        manufacturer_id: session.userId,
        status: "IN_REVIEW",
        approver_id: session.userId,
        message: null,
      });

    if (insertError) {
      console.error("Insert error:", insertError);

      // If unique constraint error, provide helpful message
      if (insertError.code === "23505") {
        return {
          success: false,
          message:
            "Database constraint error. Please contact support to enable history tracking.",
        };
      }

      return {
        success: false,
        message: "Failed to start review. Please try again.",
      };
    }

    revalidatePath("/manufacturer/dealer-applications");
    revalidatePath(`/manufacturer/dealer-applications/${dealerId}`);

    return {
      success: true,
      message: "Review started successfully.",
    };
  } catch (err) {
    console.error("Unexpected error in startDealerReview:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function approveDealerApplication(
  dealerId: string,
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const session = await getSession(Role.MANUFACTURER);

  if (!session?.userId) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    // Check if application is in review
    const { data: latestEntry } = await supabase
      .from("dealer_application_history")
      .select("status")
      .eq("dealer_id", dealerId)
      .eq("manufacturer_id", session.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latestEntry || latestEntry.status !== "IN_REVIEW") {
      return {
        success: false,
        message: "Application must be under review to approve.",
      };
    }

    const { error: insertError } = await supabase
      .from("dealer_application_history")
      .insert({
        dealer_id: dealerId,
        manufacturer_id: session.userId,
        status: "APPROVED",
        approver_id: session.userId,
        message: null,
      });

    if (insertError) {
      console.error("Insert error:", insertError);

      // If unique constraint error, provide helpful message
      if (insertError.code === "23505") {
        return {
          success: false,
          message:
            "Database constraint error. Please contact support to enable history tracking.",
        };
      }

      return {
        success: false,
        message: "Failed to approve application. Please try again.",
      };
    }

    revalidatePath("/manufacturer/dealer-applications");
    revalidatePath(`/manufacturer/dealer-applications/${dealerId}`);

    return { success: true, message: "Application approved successfully!" };
  } catch (err) {
    console.error("Unexpected error approving dealer application:", err);
    return { success: false, message: "Something went wrong." };
  }
}

export async function rejectDealerApplication(
  dealerId: string,
  message: string,
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const session = await getSession(Role.MANUFACTURER);

  if (!session?.userId) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    // Check if application is in review
    const { data: latestEntry } = await supabase
      .from("dealer_application_history")
      .select("status")
      .eq("dealer_id", dealerId)
      .eq("manufacturer_id", session.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latestEntry || latestEntry.status !== "IN_REVIEW") {
      return {
        success: false,
        message: "Application must be under review to reject.",
      };
    }

    const { error: insertError } = await supabase
      .from("dealer_application_history")
      .insert({
        dealer_id: dealerId,
        manufacturer_id: session.userId,
        status: "REJECTED",
        approver_id: session.userId,
        message: message.trim(),
      });

    if (insertError) {
      console.error("Insert error:", insertError);

      // If unique constraint error, provide helpful message
      if (insertError.code === "23505") {
        return {
          success: false,
          message:
            "Database constraint error. Please contact support to enable history tracking.",
        };
      }

      return {
        success: false,
        message: "Failed to reject application. Please try again.",
      };
    }

    revalidatePath("/manufacturer/dealer-applications");
    revalidatePath(`/manufacturer/dealer-applications/${dealerId}`);

    return { success: true, message: "Application rejected." };
  } catch (err) {
    console.error("Unexpected error rejecting dealer application:", err);
    return { success: false, message: "Something went wrong." };
  }
}
