import { useQuery } from "@tanstack/react-query";
import { fetchCartItems } from "@/lib/api/dealer/cart";

export function useCartItems() {
  return useQuery({
    queryKey: ["dealer-cart"],
    queryFn: fetchCartItems,
    staleTime: 2 * 60 * 1000,
  });
}
