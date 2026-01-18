import type { ApiResponse, CartItem } from "@/types";

export async function fetchCartItems(): Promise<ApiResponse<CartItem[]>> {
  const res = await fetch("/api/dealer/cart");

  if (!res.ok) {
    throw new Error("Failed to fetch cart items");
  }

  return res.json();
}
