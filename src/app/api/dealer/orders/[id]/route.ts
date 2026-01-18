import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, Order } from "@/types";
import { Role } from "@/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;

  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Unauthorized. Please login again." },
      { status: 401 },
    );
  }

  try {
    // 🔹 Verify dealer
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

    // 🔹 Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        *,
        manufacturer:manufacturer (
          id,
          company_name,
          company_logo,
          email,
          mobile,
          address,
          city,
          state,
          gst_number,
          pincode
        ),
        order_items:order_items (
          id,
          quantity,
          price,
          subtotal,
          status,
          cancelled_by,
          created_at,
          product:products (
            id,
            name,
            primary_image,
            sku,
            description
          )
        )
      `,
      )
      .eq("id", orderId)
      .eq("dealer_id", dealer.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<{ order: Order }>>({
      success: true,
      data: { order },
    });
  } catch (err) {
    console.error("GET dealer order error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Failed to fetch order" },
      { status: 500 },
    );
  }
}
