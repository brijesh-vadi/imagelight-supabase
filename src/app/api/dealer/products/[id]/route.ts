import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, Product } from "@/types";
import { Role } from "@/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: productId } = await params;

  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Unauthorized. Please login again." },
      { status: 401 },
    );
  }

  try {
    /* ---------------- Product ---------------- */
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(
        `
        *,
        unit:unit(id, name),
        category:categories!products_category_id_fkey(id, name),
        manufacturer:manufacturer_id(
          id,
          company_name,
          company_logo,
          email,
          mobile,
          address,
          city,
          state,
          pincode,
          website,
          company_description
        )
      `,
      )
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Product not found." },
        { status: 404 },
      );
    }

    /* ---------------- Dealer Approval Check ---------------- */
    const { data: approval } = await supabase
      .from("dealer_application_history")
      .select("status")
      .eq("dealer_id", session.userId)
      .eq("manufacturer_id", product.manufacturer_id)
      .eq("status", "APPROVED")
      .maybeSingle();

    if (!approval) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message:
            "You don't have access to view this product. Please apply for dealership with this manufacturer.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json<ApiResponse<Product>>({
      success: true,
      data: product as Product,
    });
  } catch (err) {
    console.error("Dealer product by id API error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
