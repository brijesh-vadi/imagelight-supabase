import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import { Role } from "@/types";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await getSession(Role.MANUFACTURER);

  if (!session?.userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const supabase = await createClient();

  try {
    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
          *,
          unit (
            id,
            name
          ),
          category:categories!products_category_id_fkey (
            id,
            name,
            parent_id
          )
        `,
      )
      .eq("id", id)
      .eq("manufacturer_id", session.userId)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    // Attach parent category if exists
    if (product.category?.parent_id) {
      const { data: parent } = await supabase
        .from("categories")
        .select("id, name")
        .eq("id", product.category.parent_id)
        .single();

      if (parent) {
        product.category.parent = parent;
      }

      delete product.category.parent_id;
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.error("GET manufacturer product by id failed:", err);
    return NextResponse.json(
      { success: false, message: "Unexpected server error" },
      { status: 500 },
    );
  }
}
