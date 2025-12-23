"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import {
  type ApiResponse,
  type DealerApplicationHistoryEntry,
  Role,
} from "@/types";

export async function sendDealershipRequest(
  manufacturerId: string,
): Promise<ApiResponse<DealerApplicationHistoryEntry>> {
  const supabase = await createClient();

  const session = await getSession(Role.DEALER);

  try {
    const { data: existing, error: checkError } = await supabase
      .from("dealer_application_history")
      .select("id, status")
      .eq("dealer_id", session?.userId)
      .eq("manufacturer_id", manufacturerId)
      .maybeSingle();

    if (checkError) {
      console.error("Check error:", checkError);
      return {
        success: false,
        message: "Failed to check application status.",
      };
    }

    if (existing) {
      if (existing.status === "REJECTED") {
        return {
          success: false,
          message: "Your application was rejected and cannot be resubmitted.",
        };
      }
      return {
        success: false,
        message: "You have already applied to this manufacturer.",
      };
    }

    const newApplication = {
      dealer_id: session?.userId,
      manufacturer_id: manufacturerId,
      status: "PENDING" as const,
    };

    const { data: inserted, error: insertError } = await supabase
      .from("dealer_application_history")
      .insert(newApplication)
      .select("id, status, message, created_at, updated_at, approver_id")
      .single();

    if (insertError || !inserted) {
      console.error("Insert error:", insertError);
      return {
        success: false,
        message:
          insertError?.message ||
          "Failed to send application. Please try again.",
      };
    }

    const applicationEntry: DealerApplicationHistoryEntry = {
      id: inserted.id,
      status: inserted.status,
      message: inserted.message,
      created_at: inserted.created_at,
      updated_at: inserted.updated_at,
      approver: null,
    };

    revalidatePath(`${`/dealer/manufacturers/${manufacturerId}`}`);

    return {
      success: true,
      message: "Dealership application sent successfully!",
      data: applicationEntry,
    };
  } catch (err) {
    console.error("Send dealership request error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function getDealerApplicationHistory(): Promise<
  ApiResponse<DealerApplicationHistoryEntry[]>
> {
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return {
      success: false,
      message: "Unauthorized. Please login again.",
    };
  }

  try {
    const { data, error } = await supabase
      .from("dealer_application_history")
      .select(
        `
          id,
          status,
          message,
          created_at,
          updated_at,
          approver_id,
          manufacturer:manufacturer_id (
            id,
            company_name,
            company_logo
          )
        `,
      )
      .eq("dealer_id", session.userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch dealer application history error:", error);
      return {
        success: false,
        message: "Failed to fetch application history.",
      };
    }

    const mapped: DealerApplicationHistoryEntry[] = (data || []).map(
      (entry) => ({
        id: entry.id,
        status: entry.status,
        message: entry.message,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
        approver: entry.approver_id ?? null,
        manufacturer: entry.manufacturer ? entry.manufacturer : null,
      }),
    );

    return {
      success: true,
      message: "Application history fetched successfully.",
      data: mapped,
    };
  } catch (err) {
    console.error("Dealer application history error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function getDealerApplicationHistoryForManufacturer(
  manufacturerId: string,
): Promise<ApiResponse<DealerApplicationHistoryEntry[]>> {
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return {
      success: false,
      message: "Unauthorized. Please login again.",
    };
  }

  try {
    const { data, error } = await supabase
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
            company_logo,
            email,
            mobile
          )
        `,
      )
      .eq("dealer_id", session.userId)
      .eq("manufacturer_id", manufacturerId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Fetch dealer application history error:", error);
      return {
        success: false,
        message: "Failed to fetch application history.",
      };
    }

    const mapped: DealerApplicationHistoryEntry[] = (data || []).map(
      (entry: any) => ({
        id: entry.id,
        status: entry.status,
        message: entry.message,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
        approver:
          Array.isArray(entry.approver) && entry.approver.length > 0
            ? entry.approver[0]
            : entry.approver || null,
      }),
    );

    return {
      success: true,
      message: "Application history fetched successfully.",
      data: mapped,
    };
  } catch (err) {
    console.error("Dealer application history error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
