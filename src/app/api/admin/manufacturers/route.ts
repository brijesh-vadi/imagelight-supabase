import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);

  const supabase = await createClient();

  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
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
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch manufacturers.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    });
  } catch (err) {
    console.error("Unexpected error in GET /admin/manufacturers", err);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}
