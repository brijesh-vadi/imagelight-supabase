import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("level", { ascending: true })
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Get categories error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch categories" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    });
  } catch (err) {
    console.error("Get categories error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
