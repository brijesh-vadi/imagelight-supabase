import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, Manufacturer, Product } from "@/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { searchParams } = new URL(req.url);
  const includeProducts = searchParams.get("includeProducts") === "true";

  const { id: manufacturerId } = await params;

  const supabase = await createClient();

  const baseFields = `
    id,
    company_name,
    company_logo,
    contact_person,
    gst_number,
    email,
    mobile,
    address,
    city,
    state,
    pincode,
    website,
    company_description
  `;

  try {
    /* ---------------- Manufacturer ---------------- */
    const { data: manufacturer, error } = await supabase
      .from("manufacturer")
      .select(baseFields)
      .eq("id", manufacturerId)
      .single();

    if (error || !manufacturer) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Manufacturer not found." },
        { status: 404 },
      );
    }

    /* ---------------- Products (optional) ---------------- */
    let products: Product[] | undefined;
    let totalProducts = 0;

    if (includeProducts) {
      // 1️⃣ Fetch products (REAL DATA)
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(
          `
          *,
          unit:unit(id, name),
          category:categories!products_category_id_fkey (
            id,
            name
          )
        `,
          { count: "exact" },
        )
        .eq("manufacturer_id", manufacturerId)
        .order("created_at", { ascending: false })
        .limit(3);

      if (productError) {
        console.error("Product fetch error:", productError);
      } else {
        products = productData ?? [];
      }

      // 2️⃣ Fetch total count (HEAD ONLY)
      const { count, error: countError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("manufacturer_id", manufacturerId);

      if (countError) {
        console.error("Product count error:", countError);
      } else {
        totalProducts = count ?? 0;
      }
    }

    return NextResponse.json<
      ApiResponse<
        Manufacturer & { products?: Product[]; totalProducts?: number }
      >
    >({
      success: true,
      data: {
        ...(manufacturer as Manufacturer),
        products,
        totalProducts,
      },
    });
  } catch (err) {
    console.error("GET manufacturer by id error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
