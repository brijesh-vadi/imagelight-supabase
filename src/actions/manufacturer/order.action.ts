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

/**
 * Cancel order (manufacturer can cancel/reject orders)
 */
export async function cancelManufacturerOrder(
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

    if (
      existingOrder.status === "CANCELLED" ||
      existingOrder.status === "DELIVERED"
    ) {
      return {
        success: false,
        message: "Cannot cancel this order",
      };
    }

    // Update order status to REJECTED (manufacturer cancellation)
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({ status: "REJECTED" })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError || !order) {
      return { success: false, message: "Failed to cancel order" };
    }

    revalidatePath("/manufacturer/orders");
    revalidatePath(`/manufacturer/orders/${orderId}`);

    return {
      success: true,
      message: "Order cancelled successfully",
      data: { order },
    };
  } catch (error) {
    console.error("Cancel order error:", error);
    return { success: false, message: "Failed to cancel order" };
  }
}

/**
 * Cancel individual order item (manufacturer)
 */
export async function cancelManufacturerOrderItem(
  orderItemId: string,
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

    // Get order item with order details
    const { data: orderItem, error: itemError } = await supabase
      .from("order_items")
      .select(
        `
        id,
        order_id,
        quantity,
        price,
        subtotal,
        status,
        order:orders!inner (
          id,
          manufacturer_id,
          status,
          total_amount
        )
      `,
      )
      .eq("id", orderItemId)
      .single();

    if (itemError || !orderItem) {
      return { success: false, message: "Order item not found" };
    }

    // @ts-expect-error - Supabase nested select types
    if (orderItem.order.manufacturer_id !== manufacturer.id) {
      return { success: false, message: "Unauthorized" };
    }

    // @ts-expect-error - Supabase nested select types
    const orderStatus = orderItem.order.status;
    if (
      orderStatus === "CANCELLED" ||
      orderStatus === "DELIVERED" ||
      orderStatus === "REJECTED"
    ) {
      return {
        success: false,
        message: "Cannot cancel items from this order",
      };
    }

    if (orderItem.status === "CANCELLED") {
      return {
        success: false,
        message: "Order item is already cancelled",
      };
    }

    // Mark the order item as cancelled instead of deleting
    const { error: updateError } = await supabase
      .from("order_items")
      .update({ status: "CANCELLED", cancelled_by: "MANUFACTURER" })
      .eq("id", orderItemId);

    if (updateError) {
      return { success: false, message: "Failed to cancel order item" };
    }

    // Check remaining active items in the order
    const { data: remainingItems, error: remainingError } = await supabase
      .from("order_items")
      .select("id, subtotal, status")
      .eq("order_id", orderItem.order_id);

    if (remainingError) {
      return { success: false, message: "Failed to check remaining items" };
    }

    // Filter only active items
    const activeItems = remainingItems?.filter(
      (item) => item.status !== "CANCELLED",
    );

    // If no active items left, reject the entire order
    if (!activeItems || activeItems.length === 0) {
      const { error: cancelOrderError } = await supabase
        .from("orders")
        .update({ status: "REJECTED", total_amount: 0 })
        .eq("id", orderItem.order_id);

      if (cancelOrderError) {
        console.error("Failed to reject empty order:", cancelOrderError);
      }
    } else {
      // Recalculate order total based on active items only
      const newTotal = activeItems.reduce(
        (sum, item) => sum + Number(item.subtotal),
        0,
      );

      const { error: updateTotalError } = await supabase
        .from("orders")
        .update({ total_amount: newTotal })
        .eq("id", orderItem.order_id);

      if (updateTotalError) {
        console.error("Failed to update order total:", updateTotalError);
      }
    }

    // Fetch updated order
    const { data: updatedOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderItem.order_id)
      .single();

    if (fetchError || !updatedOrder) {
      return { success: false, message: "Failed to fetch updated order" };
    }

    revalidatePath("/manufacturer/orders");
    revalidatePath(`/manufacturer/orders/${orderItem.order_id}`);

    return {
      success: true,
      message: "Order item cancelled successfully",
      data: { order: updatedOrder },
    };
  } catch (error) {
    console.error("Cancel order item error:", error);
    return { success: false, message: "Failed to cancel order item" };
  }
}
