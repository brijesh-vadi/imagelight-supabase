"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";
import { createAdminClient } from "@/lib/supabase/admin";
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
