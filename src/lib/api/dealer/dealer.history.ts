import type { ApiResponse, DealerApplicationHistoryEntry } from "@/types";

export async function fetchDealerApplicationHistory(
  manufacturerId: string,
): Promise<ApiResponse<DealerApplicationHistoryEntry[]>> {
  const res = await fetch(
    `/api/dealer/manufacturers/${manufacturerId}/application-history`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch application history");
  }

  return res.json();
}
