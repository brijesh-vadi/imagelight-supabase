import { useQuery } from "@tanstack/react-query";
import { fetchDealerApplicationHistory } from "@/lib/api/dealer/dealer.history";

export function useDealerApplicationHistory(manufacturerId: string) {
  return useQuery({
    queryKey: ["dealer-application-history", manufacturerId],
    queryFn: () => fetchDealerApplicationHistory(manufacturerId),
    enabled: !!manufacturerId,
    staleTime: 5 * 60 * 1000,
  });
}
