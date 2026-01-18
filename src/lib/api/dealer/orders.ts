import type { ApiResponse, Order } from "@/types";

export async function fetchDealerOrders(): Promise<
  ApiResponse<{ orders: Order[] }>
> {
  const res = await fetch("/api/dealer/orders");

  if (!res.ok) {
    throw new Error("Failed to fetch dealer orders");
  }

  return res.json();
}

export async function fetchDealerOrderById(
  orderId: string,
): Promise<ApiResponse<{ order: Order }>> {
  const res = await fetch(`/api/dealer/orders/${orderId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return res.json();
}
