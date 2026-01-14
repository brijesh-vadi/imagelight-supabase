import type {
  ApiResponse,
  ApplicationStatus,
  Dealer,
  DealerApplicationHistoryEntry,
} from "@/types";

interface Params {
  page?: number;
  limit?: number;
}

export async function fetchManufacturerDealers({
  page = 1,
  limit = 20,
}: Params): Promise<
  ApiResponse<
    {
      dealer: Dealer;
      status: ApplicationStatus;
      message: string | null;
      created_at: string;
      updated_at: string;
    }[]
  >
> {
  const res = await fetch(
    `/api/manufacturer/dealer-applications?page=${page}&limit=${limit}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch dealers");
  }

  return res.json();
}

export async function fetchDealerById(dealerId: string): Promise<
  ApiResponse<
    Dealer & {
      application_history?: DealerApplicationHistoryEntry[];
      application_status?: ApplicationStatus;
    }
  >
> {
  const res = await fetch(`/api/manufacturer/dealer-applications/${dealerId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch dealer");
  }

  return res.json();
}
