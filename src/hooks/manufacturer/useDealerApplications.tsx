import { useQuery } from "@tanstack/react-query";
import {
  fetchDealerById,
  fetchManufacturerDealers,
} from "@/lib/api/manufacturer/dealer.applications";

interface Params {
  page?: number;
  limit?: number;
}

export function useDealerApplications({ page = 1, limit = 20 }: Params) {
  return useQuery({
    queryKey: ["manufacturer-dealers", page, limit],
    queryFn: () => fetchManufacturerDealers({ page, limit }),
    staleTime: 60 * 5000,
  });
}

export function useDealerById(dealerId: string) {
  return useQuery({
    queryKey: ["manufacturer-dealer", dealerId],
    queryFn: () => fetchDealerById(dealerId),
    enabled: !!dealerId,
    staleTime: 60 * 1000,
  });
}
