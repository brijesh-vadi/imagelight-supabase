import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, Product } from "@/types";
import { Role } from "@/types";

export async function GET(req: Request) {
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Unauthorized. Please login again." },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);
  const search = searchParams.get("search") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  const unitId = searchParams.get("unitId") || undefined;

  try {
    /* ---------------- Approved Manufacturers ---------------- */
    const { data: approvedManufacturers, error: approvalError } = await supabase
      .from("dealer_application_history")
      .select("manufacturer_id")
      .eq("dealer_id", session.userId)
      .eq("status", "APPROVED");

    if (approvalError) {
      console.error("Approval check error:", approvalError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Failed to check approved manufacturers.",
        },
        { status: 500 },
      );
    }

    if (!approvedManufacturers || approvedManufacturers.length === 0) {
      return NextResponse.json<
        ApiResponse<{ products: Product[]; total: number }>
      >({
        success: true,
        data: { products: [], total: 0 },
      });
    }

    const approvedManufacturerIds = [
      ...new Set(approvedManufacturers.map((m) => m.manufacturer_id)),
    ];

    /* ---------------- Products Query ---------------- */
    let query = supabase
      .from("products")
      .select(
        `
        *,
        unit:unit(id, name),
        category:categories!products_category_id_fkey(id, name),
        manufacturer:manufacturer_id(id, company_name, company_logo)
      `,
        { count: "exact" },
      )
      .in("manufacturer_id", approvedManufacturerIds)
      .eq("is_active", true);

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`,
      );
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (unitId) {
      query = query.eq("unit_id", unitId);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const {
      data: products,
      error,
      count,
    } = await query.order("created_at", { ascending: false }).range(from, to);

    if (error) {
      console.error("Products fetch error:", error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to fetch products." },
        { status: 500 },
      );
    }

    return NextResponse.json<
      ApiResponse<{ products: Product[]; total: number }>
    >({
      success: true,
      data: {
        products: products ?? [],
        total: count ?? 0,
      },
    });
  } catch (err) {
    console.error("Dealer products API error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
