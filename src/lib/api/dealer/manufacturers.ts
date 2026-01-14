import type { ApiResponse, Manufacturer, Product } from "@/types";

export type ManufacturerListItem = Pick<
  Manufacturer,
  | "id"
  | "company_name"
  | "company_logo"
  | "contact_person"
  | "gst_number"
  | "email"
  | "mobile"
  | "address"
  | "city"
  | "state"
  | "pincode"
  | "website"
  | "company_description"
> & { products?: Product[]; totalProducts?: number };

interface Params {
  page?: number;
  limit?: number;
}

export async function fetchManufacturers({
  page = 1,
  limit = 20,
}: Params): Promise<
  ApiResponse<{ manufacturers: ManufacturerListItem[]; total: number }>
> {
  const res = await fetch(
    `/api/dealer/manufacturers?page=${page}&limit=${limit}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch manufacturers");
  }

  return res.json();
}

export async function fetchManufacturerById(
  manufacturerId: string,
  includeProducts = false,
): Promise<
  ApiResponse<Manufacturer & { products?: Product[]; totalProducts?: number }>
> {
  const res = await fetch(
    `/api/dealer/manufacturers/${manufacturerId}?includeProducts=${includeProducts}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch manufacturer");
  }

  return res.json();
}
