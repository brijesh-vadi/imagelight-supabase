import { useQuery } from "@tanstack/react-query";
import { fetchManufacturerOrders } from "@/lib/api/manufacturer/order";

export function useManufacturerOrders() {
  return useQuery({
    queryKey: ["manufacturer-orders"],
    queryFn: fetchManufacturerOrders,
    staleTime: 5 * 60 * 1000,
  });
}
