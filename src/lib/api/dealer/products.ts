import type { ApiResponse, Product } from "@/types";

export async function fetchDealerProductById(
  productId: string,
): Promise<ApiResponse<Product>> {
  const res = await fetch(`/api/dealer/products/${productId}`);

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.message || "Failed to fetch product");
  }

  return res.json();
}

interface Params {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  unitId?: string;
}

export async function fetchDealerProducts({
  page = 1,
  limit = 20,
  search,
  categoryId,
  unitId,
}: Params): Promise<ApiResponse<{ products: Product[]; total: number }>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.set("search", search);
  if (categoryId) params.set("categoryId", categoryId);
  if (unitId) params.set("unitId", unitId);

  const res = await fetch(`/api/dealer/products?${params.toString()}`);

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.message || "Failed to fetch products");
  }

  return res.json();
}
