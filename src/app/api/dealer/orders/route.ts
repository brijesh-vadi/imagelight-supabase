import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, Order } from "@/types";
import { Role } from "@/types";

export async function GET() {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.DEALER);

    if (!session?.userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized. Please login again." },
        { status: 401 },
      );
    }

    /* ---------------- Dealer ---------------- */
    const { data: dealer, error: dealerError } = await supabase
      .from("dealers")
      .select("id")
      .eq("id", session.userId)
      .single();

    if (dealerError || !dealer) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Dealer not found" },
        { status: 404 },
      );
    }

    /* ---------------- Orders ---------------- */
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
        *,
        manufacturer:manufacturer (
          id,
          company_name,
          company_logo
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
      .eq("dealer_id", dealer.id)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Orders fetch error:", ordersError);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to fetch orders" },
        { status: 500 },
      );
    }

    return NextResponse.json<ApiResponse<{ orders: Order[] }>>({
      success: true,
      data: { orders: orders ?? [] },
    });
  } catch (err) {
    console.error("Dealer orders API error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
