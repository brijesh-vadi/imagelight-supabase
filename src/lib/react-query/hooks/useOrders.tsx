import { useQuery } from "@tanstack/react-query";
import { getDealerOrders } from "@/actions/dealer/order.action";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const result = await getDealerOrders();
      if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to fetch orders");
      }
      return result.data.orders;
    },
  });
};
