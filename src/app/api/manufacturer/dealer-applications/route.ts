import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import { Role } from "@/types";

export async function GET(req: Request) {
  const session = await getSession(Role.MANUFACTURER);

  if (!session?.userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);

  const supabase = await createClient();

  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    /* -----------------------------
       1️⃣ Dealer application history
    ------------------------------ */
    const { data: history, error: historyError } = await supabase
      .from("dealer_application_history")
      .select(
        `
        dealer_id,
        status,
        message,
        created_at,
        updated_at
      `,
      )
      .eq("manufacturer_id", session.userId)
      .order("created_at", { ascending: false });

    if (historyError) {
      console.error(historyError);
      return NextResponse.json(
        { success: false, message: "Failed to fetch dealer history" },
        { status: 500 },
      );
    }

    const latestByDealer = new Map<string, (typeof history)[number]>();
    history?.forEach((h) => {
      if (!latestByDealer.has(h.dealer_id)) {
        latestByDealer.set(h.dealer_id, h);
      }
    });

    const historyDealerIds = Array.from(latestByDealer.keys());

    /* -----------------------------
       2️⃣ Dealers from history
    ------------------------------ */
    const { data: historyDealers } = await supabase
      .from("dealers")
      .select("*")
      .in("id", historyDealerIds);

    const historyResults =
      historyDealers?.map((dealer) => {
        const h = latestByDealer.get(dealer.id)!;
        return {
          dealer,
          status: h.status,
          message: h.message,
          created_at: h.created_at,
          updated_at: h.updated_at,
        };
      }) ?? [];

    /* -----------------------------
       3️⃣ Manufacturer-added dealers
    ------------------------------ */
    const { data: addedDealers, error: addedError } = await supabase
      .from("dealers")
      .select("*")
      .eq("is_added_by_manufacturer", true)
      .eq("added_by_manufacturer_id", session.userId);

    if (addedError) {
      console.error(addedError);
      return NextResponse.json(
        { success: false, message: "Failed to fetch added dealers" },
        { status: 500 },
      );
    }

    const addedResults =
      addedDealers
        ?.filter((d) => !latestByDealer.has(d.id))
        .map((dealer) => ({
          dealer,
          status: "APPROVED",
          message: "Added directly by manufacturer",
          created_at: dealer.created_at,
          updated_at: dealer.updated_at,
        })) ?? [];

    /* -----------------------------
       4️⃣ Merge + sort + paginate
    ------------------------------ */
    const combined = [...historyResults, ...addedResults];

    combined.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return NextResponse.json({
      success: true,
      data: combined.slice(from, to + 1),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
