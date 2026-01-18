import { useQuery } from "@tanstack/react-query";
import {
  fetchDealerProductById,
  fetchDealerProducts,
} from "@/lib/api/dealer/products";

export function useDealerProductById(productId: string) {
  return useQuery({
    queryKey: ["dealer-product", productId],
    queryFn: () => fetchDealerProductById(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
}

interface Params {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  unitId?: string;
}

export function useDealerProducts({
  page = 1,
  limit = 20,
  search,
  categoryId,
  unitId,
}: Params) {
  return useQuery({
    queryKey: ["dealer-products", page, limit, search, categoryId, unitId],
    queryFn: () =>
      fetchDealerProducts({ page, limit, search, categoryId, unitId }),
    staleTime: 5 * 60 * 1000,
  });
}
