import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import { Role } from "@/types";

export async function GET() {
  try {
    const session = await getSession(Role.MANUFACTURER);

    if (!session?.userId) {
      return NextResponse.json({ success: true, data: [] });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("unit")
      .select(`
        id,
        name,
        created_at,
        updated_at,
        manufacturer_id,
        products:products(count)
      `)
      .eq("manufacturer_id", session.userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Units API error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch units" },
        { status: 500 },
      );
    }

    const unitsWithCount =
      data?.map((unit) => ({
        ...unit,
        product_count: unit.products?.[0]?.count ?? 0,
        products: undefined,
      })) ?? [];

    return NextResponse.json({
      success: true,
      data: unitsWithCount,
    });
  } catch (err) {
    console.error("Units API unexpected error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
