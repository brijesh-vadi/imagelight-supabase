"use client";

import { useQuery } from "@tanstack/react-query";
import { getCartItems } from "@/actions/dealer/cart.action";

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const result = await getCartItems();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch cart");
      }
      return result.data || [];
    },
  });
}
