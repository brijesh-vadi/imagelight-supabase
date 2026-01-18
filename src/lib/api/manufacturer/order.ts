import type { ApiResponse, Order } from "@/types";

export async function fetchManufacturerOrders(): Promise<
  ApiResponse<{ orders: Order[] }>
> {
  const res = await fetch("/api/manufacturer/orders");

  if (!res.ok) {
    throw new Error("Failed to fetch manufacturer orders");
  }

  return res.json();
}
