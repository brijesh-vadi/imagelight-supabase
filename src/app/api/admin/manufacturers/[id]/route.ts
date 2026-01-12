import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "Manufacturer not found." },
        { status: 404 },
      );
    }

    const { data: history } = await supabase
      .from("manufacturer_application_history")
      .select(`
        id,
        status,
        message,
        created_at,
        admin:admin_id (
          id,
          username,
          email,
          mobile,
          profile_image
        )
      `)
      .eq("manufacturer_id", id)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        application_history: history ?? [],
      },
    });
  } catch (err) {
    console.error("GET manufacturer by id failed:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
