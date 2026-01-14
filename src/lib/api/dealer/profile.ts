import type { ApiResponse, Dealer } from "@/types";

export async function fetchDealerProfile(): Promise<ApiResponse<Dealer>> {
  const res = await fetch("/api/dealer/profile");

  if (!res.ok) {
    throw new Error("Failed to fetch dealer profile");
  }

  return res.json();
}
