import { useQuery } from "@tanstack/react-query";
import { fetchDealerProfile } from "@/lib/api/dealer/profile";

export function useDealerProfile() {
  return useQuery({
    queryKey: ["dealer-profile"],
    queryFn: fetchDealerProfile,
    staleTime: 5 * 60 * 1000,
  });
}
