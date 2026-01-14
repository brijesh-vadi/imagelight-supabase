import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import { Role } from "@/types";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: dealerId } = await params;

  const session = await getSession(Role.MANUFACTURER);
  if (!session?.userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  const supabase = await createClient();

  try {
    /* -----------------------------
       1️⃣ Dealer basic info
    ------------------------------ */
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
      return NextResponse.json(
        { success: false, message: "Dealer not found." },
        { status: 404 },
      );
    }

    /* -----------------------------
       2️⃣ Application history
    ------------------------------ */
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

    const history =
      rawHistory?.map((entry: any) => ({
        id: entry.id,
        status: entry.status,
        message: entry.message,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
        approver: entry.approver?.[0] ?? null,
      })) ?? [];

    const currentStatus =
      history.length > 0 ? history[history.length - 1].status : "PENDING";

    return NextResponse.json({
      success: true,
      data: {
        ...dealer,
        application_history: history,
        application_status: currentStatus,
      },
    });
  } catch (err) {
    console.error("GET dealer by id failed:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
