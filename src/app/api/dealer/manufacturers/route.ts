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

    const { data, error, count } = await supabase
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
        company_description
      `,
        { count: "exact" },
      )
      .eq("is_active", true)
      .eq("application_status", "APPROVED")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch manufacturers." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        manufacturers: data ?? [],
        total: count ?? 0,
      },
    });
  } catch (err) {
    console.error("GET /api/public/manufacturers error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
