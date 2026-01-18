"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import type { ApiResponse, Product } from "@/types";
import { Role } from "@/types";

// export interface CartItem {
//   id: string;
//   dealer_id: string;
//   product_id: string;
//   quantity: number;
//   added_at: string;
//   updated_at: string;
//   product: Product & {
//     unit?: { id: string; name: string };
//     category?: { id: string; name: string };
//   };
// }

export async function addToCart(
  productId: string,
  quantity: number = 1,
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return {
      success: false,
      message: "Unauthorized. Please login again.",
    };
  }

  try {
    const { data: existingItem } = await supabase
      .from("carts")
      .select("id, quantity")
      .eq("dealer_id", session.userId)
      .eq("product_id", productId)
      .maybeSingle();

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("carts")
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id);

      if (updateError) {
        console.error("Update cart error:", updateError);
        return {
          success: false,
          message: "Failed to update cart.",
        };
      }
    } else {
      const { error: insertError } = await supabase.from("carts").insert({
        dealer_id: session.userId,
        product_id: productId,
        quantity,
      });

      if (insertError) {
        console.error("Insert cart error:", insertError);
        return {
          success: false,
          message: "Failed to add to cart.",
        };
      }
    }

    revalidatePath("/dealer/cart");
    revalidatePath("/dealer/products");

    return {
      success: true,
      message: "Product added to cart successfully!",
    };
  } catch (err) {
    console.error("Unexpected error in addToCart:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return {
      success: false,
      message: "Unauthorized. Please login again.",
    };
  }

  if (quantity < 1) {
    return {
      success: false,
      message: "Quantity must be at least 1.",
    };
  }

  try {
    const { error } = await supabase
      .from("carts")
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cartItemId)
      .eq("dealer_id", session.userId);

    if (error) {
      console.error("Update quantity error:", error);
      return {
        success: false,
        message: "Failed to update quantity.",
      };
    }

    revalidatePath("/dealer/cart");

    return {
      success: true,
      message: "Quantity updated successfully!",
    };
  } catch (err) {
    console.error("Unexpected error in updateCartItemQuantity:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function removeFromCart(
  cartItemId: string,
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return {
      success: false,
      message: "Unauthorized. Please login again.",
    };
  }

  try {
    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("id", cartItemId)
      .eq("dealer_id", session.userId);

    if (error) {
      console.error("Remove from cart error:", error);
      return {
        success: false,
        message: "Failed to remove item from cart.",
      };
    }

    revalidatePath("/dealer/cart");

    return {
      success: true,
      message: "Item removed from cart successfully!",
    };
  } catch (err) {
    console.error("Unexpected error in removeFromCart:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function clearCart(): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const session = await getSession(Role.DEALER);

  if (!session?.userId) {
    return {
      success: false,
      message: "Unauthorized. Please login again.",
    };
  }

  try {
    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("dealer_id", session.userId);

    if (error) {
      console.error("Clear cart error:", error);
      return {
        success: false,
        message: "Failed to clear cart.",
      };
    }

    revalidatePath("/dealer/cart");

    return {
      success: true,
      message: "Cart cleared successfully!",
    };
  } catch (err) {
    console.error("Unexpected error in clearCart:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
