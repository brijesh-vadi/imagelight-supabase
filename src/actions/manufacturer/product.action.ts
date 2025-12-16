"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import {
  type AddProductForm,
  addProductSchema,
} from "@/schema/manufacturer/product";
import { type ApiResponse, type Product, Role } from "@/types";

type UploadResult = {
  type: "primary" | "secondary";
  path: string;
  error: any | null;
  index?: number;
};

export async function addProduct(
  data: AddProductForm,
): Promise<ApiResponse<Product>> {
  const session = await getSession(Role.MANUFACTURER);

  const supabase = createAdminClient();

  try {
    const parsed = addProductSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
      };
    }

    const validatedData = parsed.data;

    const productId = uuid();
    const baseImagePath = `${session?.userId}/products/${productId}`;

    const primaryImageFile = validatedData.primaryImage;
    const primaryImageExt = primaryImageFile.name.split(".").pop();
    const primaryImagePath = `${baseImagePath}/primary.${primaryImageExt}`;

    const uploadTasks: Promise<UploadResult>[] = [
      supabase.storage
        .from("manufacturer-assets")
        .upload(primaryImagePath, primaryImageFile, {
          contentType: primaryImageFile.type,
          upsert: false,
        })
        .then((result) => ({
          type: "primary" as const,
          path: primaryImagePath,
          error: result.error,
        })),
    ];

    const secondaryImagePaths: string[] = [];
    if (validatedData.images && validatedData.images.length > 0) {
      validatedData.images.forEach((image, index) => {
        const ext = image.name.split(".").pop();
        const path = `${baseImagePath}/secondary_${index + 1}.${ext}`;
        secondaryImagePaths.push(path);

        uploadTasks.push(
          supabase.storage
            .from("manufacturer-assets")
            .upload(path, image, {
              contentType: image.type,
              upsert: false,
            })
            .then((result) => ({
              type: "secondary" as const,
              path,
              index,
              error: result.error,
            })),
        );
      });
    }

    const uploadResults = await Promise.all(uploadTasks);

    const uploadErrors = uploadResults.filter((result) => result.error);
    if (uploadErrors.length > 0) {
      console.error("Image upload errors:", uploadErrors);

      const successfulPaths = uploadResults
        .filter((r) => !r.error)
        .map((r) => r.path);

      if (successfulPaths.length > 0) {
        await supabase.storage
          .from("manufacturer-assets")
          .remove(successfulPaths);
      }

      return {
        success: false,
        message: "Failed to upload images",
      };
    }

    const primaryImageUrl = supabase.storage
      .from("manufacturer-assets")
      .getPublicUrl(primaryImagePath).data.publicUrl;

    const secondaryImageUrls = secondaryImagePaths.map(
      (path) =>
        supabase.storage.from("manufacturer-assets").getPublicUrl(path).data
          .publicUrl,
    );

    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        id: productId,
        manufacturer_id: session?.userId,
        name: validatedData.name,
        description: validatedData.description || null,
        primary_image: primaryImageUrl,
        images: secondaryImageUrls,
        sku: validatedData.sku,
        stock: validatedData.stock,
        min_order_quantity: validatedData.minOrderQuantity,
        regular_price: validatedData.regularPrice,
        dealer_price: validatedData.dealerPrice,
        unit_id: validatedData.unitId,
        category_id: validatedData.categoryId,
        is_active: validatedData.isActive,
        in_stock: validatedData.inStock,
      })
      .select("*")
      .single();

    if (insertError) {
      const allPaths = [primaryImagePath, ...secondaryImagePaths];
      await supabase.storage.from("manufacturer-assets").remove(allPaths);

      const isUniqueViolation =
        insertError.code === "23505" ||
        /duplicate key/i.test(insertError.message || "");

      if (isUniqueViolation) {
        return {
          success: false,
          message: "A product with this SKU already exists.",
        };
      }

      return {
        success: false,
        message: "Failed to create product",
      };
    }

    revalidatePath("/manufacturer/products");

    return {
      success: true,
      data: product,
      message: "Product added successfully",
    };
  } catch (err) {
    console.error("addProduct error:", err);
    return {
      success: false,
      message: "Unexpected server error",
    };
  }
}

export async function getManufacturerProducts(): Promise<
  ApiResponse<Product[]>
> {
  const session = await getSession(Role.MANUFACTURER);

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
          *,
          unit (
            id,
            name
          ),
          category:categories (
            id,
            name
          )
        `)
      .eq("manufacturer_id", session?.userId)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        message: "Failed to fetch products",
      };
    }

    return {
      success: true,
      data: data ?? [],
    };
  } catch (err) {
    console.error("getManufacturerProducts unexpected error:", err);
    return {
      success: false,
      message: "Unexpected server error",
    };
  }
}

export async function deleteProduct(
  productId: string,
): Promise<ApiResponse<null>> {
  const session = await getSession(Role.MANUFACTURER);

  if (!session?.userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!productId) {
    return {
      success: false,
      message: "Product ID is required",
    };
  }

  const supabase = createAdminClient();

  try {
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .eq("manufacturer_id", session.userId)
      .single();

    if (fetchError || !product) {
      return {
        success: false,
        message: "Product not found or access denied",
      };
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("manufacturer_id", session.userId);

    if (deleteError) {
      console.error("deleteProduct DB error:", deleteError);
      return {
        success: false,
        message: "Failed to delete product",
      };
    }

    const folderPath = `${session.userId}/products/${productId}`;

    const { data: files, error: listError } = await supabase.storage
      .from("manufacturer-assets")
      .list(folderPath, { limit: 100 });

    if (!listError && files?.length) {
      const paths = files.map((file) => `${folderPath}/${file.name}`);

      const { error: removeError } = await supabase.storage
        .from("manufacturer-assets")
        .remove(paths);

      if (removeError) {
        console.warn("Image cleanup failed:", removeError);
      }
    }

    revalidatePath("/manufacturer/products");

    return {
      success: true,
      message: "Product deleted successfully",
      data: null,
    };
  } catch (err) {
    console.error("deleteProduct unexpected error:", err);
    return {
      success: false,
      message: "Unexpected server error",
    };
  }
}
