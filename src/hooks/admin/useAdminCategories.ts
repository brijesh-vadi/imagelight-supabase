import { useQuery } from "@tanstack/react-query";
import { fetchAdminCategories } from "@/lib/api/admin/categories";
import type { Category } from "@/types";

export function useAdminCategories() {
  return useQuery<Category[]>({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await fetchAdminCategories();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
