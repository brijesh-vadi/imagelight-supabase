import { useQuery } from "@tanstack/react-query";
import {
  fetchDealerOrderById,
  fetchDealerOrders,
} from "@/lib/api/dealer/orders";

export function useDealerOrders() {
  return useQuery({
    queryKey: ["dealer-orders"],
    queryFn: fetchDealerOrders,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDealerOrderById(orderId: string) {
  return useQuery({
    queryKey: ["dealer-order", orderId],
    queryFn: () => fetchDealerOrderById(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  });
}
