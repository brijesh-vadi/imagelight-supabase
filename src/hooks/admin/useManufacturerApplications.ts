import { useQuery } from "@tanstack/react-query";
import {
  fetchManufacturerById,
  fetchManufacturers,
} from "@/lib/api/admin/manufacturers";
import type { Manufacturer } from "@/types";

interface Params {
  page?: number;
  limit?: number;
}

export function useManufacturers({ page = 1, limit = 20 }: Params) {
  return useQuery({
    queryKey: ["manufacturers", page, limit],
    queryFn: () => fetchManufacturers({ page, limit }),
    staleTime: 60 * 2000,
  });
}

export function useManufacturerById(id: string) {
  return useQuery<Manufacturer>({
    queryKey: ["manufacturer", id],
    queryFn: async () => {
      const response = await fetchManufacturerById(id);
      return response.data;
    },
    staleTime: 60 * 2000,
  });
}
