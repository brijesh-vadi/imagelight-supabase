import { useQuery } from "@tanstack/react-query";
import {
  fetchManufacturerById,
  fetchManufacturers,
} from "@/lib/api/dealer/manufacturers";

interface Params {
  page?: number;
  limit?: number;
}

export function useManufacturers({ page = 1, limit = 20 }: Params) {
  return useQuery({
    queryKey: ["manufacturers", page, limit],
    queryFn: () => fetchManufacturers({ page, limit }),
    staleTime: 1000 * 60 * 5,
  });
}

export function useManufacturerById(
  manufacturerId: string,
  includeProducts = false,
) {
  return useQuery({
    queryKey: ["manufacturer", manufacturerId, includeProducts],
    queryFn: () => fetchManufacturerById(manufacturerId, includeProducts),
    enabled: !!manufacturerId,
    staleTime: 1000 * 60 * 5,
  });
}
