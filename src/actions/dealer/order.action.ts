"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, Order } from "@/types";
import { Role } from "@/types";

interface CreateOrderInput {
  shipping_address: string;
  billing_address: string;
  notes?: string;
}

interface OrdersByManufacturer {
  manufacturer_id: string;
  manufacturer_name: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
}

/**
 * Generate unique order number with manufacturer prefix
 * Format: ORDER-XXX-001 (XXX = first 3 chars of manufacturer company name)
 */
async function generateOrderNumber(
  supabase: any,
  manufacturerId: string,
  companyName: string,
): Promise<string> {
  // Get first 3 characters of company name, uppercase, remove spaces
  const prefix = companyName.replace(/\s+/g, "").substring(0, 3).toUpperCase();

  // Get the count of existing orders for this manufacturer
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("manufacturer_id", manufacturerId);

  const orderNumber = (count || 0) + 1;
  const paddedNumber = orderNumber.toString().padStart(3, "0");

  return `ORD-${prefix}-${paddedNumber}`;
}

/**
 * Generate unique invoice number for a manufacturer
 * Format: XXX-001 (XXX = first 3 chars of manufacturer company name)
 */
async function generateInvoiceNumber(
  supabase: any,
  manufacturerId: string,
  companyName: string,
): Promise<string> {
  // Get first 3 characters of company name, uppercase, remove spaces
  const prefix = companyName.replace(/\s+/g, "").substring(0, 3).toUpperCase();

  // Get the count of existing orders for this manufacturer
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("manufacturer_id", manufacturerId);

  const invoiceNumber = (count || 0) + 1;
  const paddedNumber = invoiceNumber.toString().padStart(3, "0");

  return `INV-${prefix}-${paddedNumber}`;
}

/**
 * Create orders from cart items
 * Groups cart items by manufacturer and creates separate orders
 */
export async function createOrdersFromCart(
  input: CreateOrderInput,
): Promise<ApiResponse<{ orders: Order[] }>> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.DEALER);

    // Get dealer info
    const { data: dealer, error: dealerError } = await supabase
      .from("dealers")
      .select("id")
      .eq("id", session?.userId)
      .single();

    if (dealerError || !dealer) {
      return { success: false, message: "Dealer not found" };
    }

    // Get cart items with product and manufacturer info
    const { data: cartItems, error: cartError } = await supabase
      .from("carts")
      .select(
        `
        id,
        product_id,
        quantity,
        product:products (
          id,
          name,
          dealer_price,
          manufacturer_id,
          manufacturer:manufacturer (
            id,
            company_name
          )
        )
      `,
      )
      .eq("dealer_id", dealer.id);

    if (cartError) {
      return { success: false, message: "Failed to fetch cart items" };
    }

    if (!cartItems || cartItems.length === 0) {
      return { success: false, message: "Cart is empty" };
    }

    // Group cart items by manufacturer
    const ordersByManufacturer: Map<string, OrdersByManufacturer> = new Map();

    for (const item of cartItems) {
      // @ts-expect-error - Supabase nested select types
      if (!item.product || !item.product.manufacturer) continue;

      // @ts-expect-error - Supabase nested select types
      const manufacturerId = item.product.manufacturer_id;
      // @ts-expect-error - Supabase nested select types
      const manufacturerName = item.product.manufacturer.company_name;

      if (!ordersByManufacturer.has(manufacturerId)) {
        ordersByManufacturer.set(manufacturerId, {
          manufacturer_id: manufacturerId,
          manufacturer_name: manufacturerName,
          items: [],
          total_amount: 0,
        });
      }

      const order = ordersByManufacturer.get(manufacturerId)!;
      // @ts-expect-error - Supabase nested select types
      const itemTotal = item.product.dealer_price * item.quantity;

      order.items.push({
        product_id: item.product_id,
        quantity: item.quantity,
        // @ts-expect-error - Supabase nested select types
        price: item.product.dealer_price,
      });
      order.total_amount += itemTotal;
    }

    // Create orders for each manufacturer
    const createdOrders: Order[] = [];

    for (const [manufacturerId, orderData] of ordersByManufacturer) {
      const orderNumber = await generateOrderNumber(
        supabase,
        manufacturerId,
        orderData.manufacturer_name,
      );
      const invoiceNumber = await generateInvoiceNumber(
        supabase,
        manufacturerId,
        orderData.manufacturer_name,
      );

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          dealer_id: dealer.id,
          manufacturer_id: manufacturerId,
          order_number: orderNumber,
          invoice_number: invoiceNumber,
          total_amount: orderData.total_amount,
          shipping_address: input.shipping_address,
          billing_address: input.billing_address,
          notes: input.notes || null,
          status: "PENDING",
          payment_status: "UNPAID",
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error("Failed to create order:", orderError);
        continue;
      }

      // Insert order items
      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Failed to create order items:", itemsError);
        // Rollback: delete the order
        await supabase.from("orders").delete().eq("id", order.id);
        continue;
      }

      createdOrders.push(order);
    }

    if (createdOrders.length === 0) {
      return { success: false, message: "Failed to create orders" };
    }

    // Clear cart after successful order creation
    const { error: clearCartError } = await supabase
      .from("carts")
      .delete()
      .eq("dealer_id", dealer.id);

    if (clearCartError) {
      console.error("Failed to clear cart:", clearCartError);
    }

    revalidatePath("/dealer/cart");
    revalidatePath("/dealer/orders");

    return {
      success: true,
      message: `Successfully created ${createdOrders.length} order(s)`,
      data: { orders: createdOrders },
    };
  } catch (error) {
    console.error("Create orders error:", error);
    return { success: false, message: "Failed to create orders" };
  }
}

/**
 * Get dealer's orders
 */
export async function getDealerOrders(): Promise<
  ApiResponse<{ orders: Order[] }>
> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.DEALER);

    if (!session?.userId) {
      console.error("No session found");
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    const { data: dealer, error: dealerError } = await supabase
      .from("dealers")
      .select("id")
      .eq("id", session.userId)
      .single();

    if (dealerError || !dealer) {
      console.error("Dealer not found:", dealerError);
      return { success: false, message: "Dealer not found" };
    }

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
      console.error("Failed to fetch orders:", ordersError);
      return { success: false, message: "Failed to fetch orders" };
    }

    return { success: true, data: { orders: orders || [] } };
  } catch (error) {
    console.error("Get orders error:", error);
    return { success: false, message: "Failed to fetch orders" };
  }
}

/**
 * Get order by ID
 */
export async function getDealerOrderById(
  orderId: string,
): Promise<ApiResponse<{ order: Order }>> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.DEALER);

    if (!session?.userId) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    const { data: dealer, error: dealerError } = await supabase
      .from("dealers")
      .select("id")
      .eq("id", session.userId)
      .single();

    if (dealerError || !dealer) {
      return { success: false, message: "Dealer not found" };
    }

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
      return { success: false, message: "Order not found" };
    }

    return { success: true, data: { order } };
  } catch (error) {
    console.error("Get order error:", error);
    return { success: false, message: "Failed to fetch order" };
  }
}

/**
 * Cancel order (only if status is PENDING)
 */
export async function cancelOrder(
  orderId: string,
): Promise<ApiResponse<{ order: Order }>> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.DEALER);

    if (!session?.userId) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    const { data: dealer, error: dealerError } = await supabase
      .from("dealers")
      .select("id")
      .eq("id", session.userId)
      .single();

    if (dealerError || !dealer) {
      return { success: false, message: "Dealer not found" };
    }

    // Check if order exists and belongs to dealer
    const { data: existingOrder, error: checkError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .eq("dealer_id", dealer.id)
      .single();

    if (checkError || !existingOrder) {
      return { success: false, message: "Order not found" };
    }

    if (existingOrder.status !== "PENDING") {
      return {
        success: false,
        message: "Only pending orders can be cancelled",
      };
    }

    // Update order status
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({ status: "CANCELLED" })
      .eq("id", orderId)
      .select()
      .single();

    if (updateError || !order) {
      return { success: false, message: "Failed to cancel order" };
    }

    revalidatePath("/dealer/orders");
    revalidatePath(`/dealer/orders/${orderId}`);

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

export async function cancelOrderItem(
  orderItemId: string,
): Promise<ApiResponse<{ order: Order }>> {
  try {
    const supabase = await createClient();
    const session = await getSession(Role.DEALER);

    const { data: dealer, error: dealerError } = await supabase
      .from("dealers")
      .select("id")
      .eq("id", session?.userId)
      .single();

    if (dealerError || !dealer) {
      return { success: false, message: "Dealer not found" };
    }

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
          dealer_id,
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
    if (orderItem.order.dealer_id !== dealer.id) {
      return { success: false, message: "Unauthorized" };
    }

    // @ts-expect-error - Supabase nested select types
    if (orderItem.order.status !== "PENDING") {
      return {
        success: false,
        message: "Only pending orders can be cancelled",
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
      .update({ status: "CANCELLED", cancelled_by: "DEALER" })
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

    // If no active items left, cancel the entire order
    if (!activeItems || activeItems.length === 0) {
      const { error: cancelOrderError } = await supabase
        .from("orders")
        .update({ status: "CANCELLED", total_amount: 0 })
        .eq("id", orderItem.order_id);

      if (cancelOrderError) {
        console.error("Failed to cancel empty order:", cancelOrderError);
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

    const { data: updatedOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderItem.order_id)
      .single();

    if (fetchError || !updatedOrder) {
      return { success: false, message: "Failed to fetch updated order" };
    }

    revalidatePath("/dealer/orders");
    revalidatePath(`/dealer/orders/${orderItem.order_id}`);

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
