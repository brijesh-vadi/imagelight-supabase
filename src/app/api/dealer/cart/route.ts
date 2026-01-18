import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, CartItem } from "@/types";
import { Role } from "@/types";

export async function GET() {
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Unauthorized. Please login again." },
      { status: 401 },
    );
  }

  try {
    const { data, error } = await supabase
      .from("carts")
      .select(
        `
        id,
        dealer_id,
        product_id,
        quantity,
        added_at,
        updated_at,
        product:products (
          id,
          name,
          description,
          primary_image,
          images,
          sku,
          dealer_price,
          regular_price,
          stock,
          min_order_quantity,
          is_active,
          manufacturer_id,
          unit:unit(id, name),
          category:categories!products_category_id_fkey(id, name)
        )
      `,
      )
      .eq("dealer_id", session.userId)
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Fetch cart error:", error);
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Failed to fetch cart items." },
        { status: 500 },
      );
    }

    // 🔹 Normalize FK arrays
    const transformed: CartItem[] = (data ?? []).map((item: any) => ({
      id: item.id,
      dealerId: item.dealer_id,
      productId: item.product_id,
      quantity: item.quantity,
      addedAt: item.added_at,
      updatedAt: item.updated_at,
      product: item.product
        ? {
            ...item.product,
            unit:
              Array.isArray(item.product.unit) && item.product.unit.length > 0
                ? item.product.unit[0]
                : undefined,
            category:
              Array.isArray(item.product.category) &&
              item.product.category.length > 0
                ? item.product.category[0]
                : undefined,
          }
        : undefined,
    }));

    return NextResponse.json<ApiResponse<CartItem[]>>({
      success: true,
      data: transformed,
    });
  } catch (err) {
    console.error("Get cart items error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
