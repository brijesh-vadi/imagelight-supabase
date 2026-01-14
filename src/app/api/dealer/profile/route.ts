import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, Dealer } from "@/types";
import { Role } from "@/types";

export async function GET() {
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { data, error } = await supabase
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
        is_added_by_manufacturer,
        added_by_manufacturer_id,
        created_at,
        updated_at
      `,
      )
      .eq("id", session.userId)
      .single();

    if (error || !data) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Dealer profile not found." },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<Dealer>>({
      success: true,
      data,
    });
  } catch (err) {
    console.error("GET dealer profile error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch profile." },
      { status: 500 },
    );
  }
}
