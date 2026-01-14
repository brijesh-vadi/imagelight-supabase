import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, DealerApplicationHistoryEntry } from "@/types";
import { Role } from "@/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: manufacturerId } = await params;
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Unauthorized. Please login again." },
      { status: 401 },
    );
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
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to fetch application history." },
        { status: 500 },
      );
    }

    const mapped: DealerApplicationHistoryEntry[] = (data ?? []).map(
      (entry: any) => ({
        id: entry.id,
        status: entry.status,
        message: entry.message,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
        approver:
          Array.isArray(entry.approver) && entry.approver.length > 0
            ? entry.approver[0]
            : (entry.approver ?? null),
      }),
    );

    return NextResponse.json<ApiResponse<DealerApplicationHistoryEntry[]>>({
      success: true,
      data: mapped,
    });
  } catch (err) {
    console.error("Dealer application history error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
