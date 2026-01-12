import type { ApiResponse, Manufacturer } from "@/types";

interface Params {
  page?: number;
  limit?: number;
}

export async function fetchManufacturers({
  page = 1,
  limit = 20,
}: Params): Promise<ApiResponse<Manufacturer[]>> {
  const res = await fetch(
    `/api/admin/manufacturers?page=${page}&limit=${limit}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch manufacturers");
  }

  return res.json();
}

export async function fetchManufacturerById(id: string) {
  const res = await fetch(`/api/admin/manufacturers/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch manufacturer");
  }

  return res.json();
}
