import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, Order } from "@/types";
import { Role } from "@/types";

export async function GET() {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.MANUFACTURER);

    if (!session?.userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized. Please login again." },
        { status: 401 },
      );
    }

    // 🔍 Ensure manufacturer exists
    const { data: manufacturer, error: manufacturerError } = await supabase
      .from("manufacturer")
      .select("id")
      .eq("id", session.userId)
      .single();

    if (manufacturerError || !manufacturer) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Manufacturer not found" },
        { status: 404 },
      );
    }

    // 📦 Fetch orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
        *,
        dealer:dealers (
          id,
          company_name,
          company_logo,
          email,
          mobile
        ),
        order_items:order_items (
          id,
          quantity,
          price,
          subtotal,
          status,
          cancelled_by,
          product:products (
            id,
            name,
            primary_image,
            images,
            sku
          )
        )
      `,
      )
      .eq("manufacturer_id", manufacturer.id)
      .order("created_at", { ascending: false });

    if (ordersError) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to fetch orders" },
        { status: 500 },
      );
    }

    return NextResponse.json<ApiResponse<{ orders: Order[] }>>({
      success: true,
      data: { orders: orders ?? [] },
    });
  } catch (error) {
    console.error("GET manufacturer orders error:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
