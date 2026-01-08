"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, Order } from "@/types";
import { Role } from "@/types";

/**
 * Get manufacturer's orders
 */
export async function getManufacturerOrders(): Promise<
  ApiResponse<{ orders: Order[] }>
> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.MANUFACTURER);

    if (!session?.userId) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    const { data: manufacturer, error: manufacturerError } = await supabase
      .from("manufacturer")
      .select("id")
      .eq("id", session.userId)
      .single();

    if (manufacturerError || !manufacturer) {
      return { success: false, message: "Manufacturer not found" };
    }

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
      return { success: false, message: "Failed to fetch orders" };
    }

    return { success: true, data: { orders: orders || [] } };
  } catch (error) {
    console.error("Get orders error:", error);
    return { success: false, message: "Failed to fetch orders" };
  }
}

/**
 * Get order by ID (manufacturer view)
 */
export async function getManufacturerOrderById(
  orderId: string,
): Promise<ApiResponse<{ order: Order }>> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.MANUFACTURER);

    if (!session?.userId) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    const { data: manufacturer, error: manufacturerError } = await supabase
      .from("manufacturer")
      .select("id")
      .eq("id", session.userId)
      .single();

    if (manufacturerError || !manufacturer) {
      return { success: false, message: "Manufacturer not found" };
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        *,
        dealer:dealers (
          id,
          company_name,
          company_logo,
          email,
          mobile,
          address,
          city,
          state,
          pincode,
          gst_number
        ),
        order_items:order_items (
          id,
          quantity,
          price,
          subtotal,
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
      .eq("manufacturer_id", manufacturer.id)
      .single();

    if (orderError || !order) {
      return { success: false, message: "Order not found" };
    }

    return { success: true, data: { order } };
  } catch (error) {
    console.error("Get order error:", error);
    return { success: false, message: "Failed to fetch order" };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<ApiResponse<{ order: Order }>> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.MANUFACTURER);

    if (!session?.userId) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    const { data: manufacturer, error: manufacturerError } = await supabase
      .from("manufacturer")
      .select("id")
      .eq("id", session.userId)
      .single();

    if (manufacturerError || !manufacturer) {
      return { success: false, message: "Manufacturer not found" };
    }

    // Check if order exists and belongs to manufacturer
    const { data: existingOrder, error: checkError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .eq("manufacturer_id", manufacturer.id)
      .single();

    if (checkError || !existingOrder) {
      return { success: false, message: "Order not found" };
    }

    // Update order status
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError || !order) {
      return { success: false, message: "Failed to update order status" };
    }

    revalidatePath("/manufacturer/orders");
    revalidatePath(`/manufacturer/orders/${orderId}`);

    return {
      success: true,
      message: "Order status updated successfully",
      data: { order },
    };
  } catch (error) {
    console.error("Update order status error:", error);
    return { success: false, message: "Failed to update order status" };
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: string,
): Promise<ApiResponse<{ order: Order }>> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.MANUFACTURER);

    if (!session?.userId) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    const { data: manufacturer, error: manufacturerError } = await supabase
      .from("manufacturer")
      .select("id")
      .eq("id", session.userId)
      .single();

    if (manufacturerError || !manufacturer) {
      return { success: false, message: "Manufacturer not found" };
    }

    // Check if order exists and belongs to manufacturer
    const { data: existingOrder, error: checkError } = await supabase
      .from("orders")
      .select("id")
      .eq("id", orderId)
      .eq("manufacturer_id", manufacturer.id)
      .single();

    if (checkError || !existingOrder) {
      return { success: false, message: "Order not found" };
    }

    // Update payment status
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: paymentStatus })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError || !order) {
      return { success: false, message: "Failed to update payment status" };
    }

    revalidatePath("/manufacturer/orders");
    revalidatePath(`/manufacturer/orders/${orderId}`);

    return {
      success: true,
      message: "Payment status updated successfully",
      data: { order },
    };
  } catch (error) {
    console.error("Update payment status error:", error);
    return { success: false, message: "Failed to update payment status" };
  }
}
