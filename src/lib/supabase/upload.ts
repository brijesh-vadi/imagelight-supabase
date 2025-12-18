"use server";

import { v4 as uuid } from "uuid";
import {
  DEALER_PRIVATE_BUCKET,
  DEALER_PUBLIC_BUCKET,
  MANUFACTURER_PRIVATE_BUCKET,
  MANUFACTURER_PUBLIC_BUCKET,
} from "../constants";
import { createAdminClient } from "./admin";

function generateFileName(originalName: string): string {
  const ext = originalName.split(".").pop() || "";
  const name = originalName.slice(0, originalName.lastIndexOf(".")) || "file";
  return `${uuid()}-${name}.${ext}`;
}

// PUBLIC: Company logo
export async function uploadManufacturerLogo(
  file: File,
  userId: string,
): Promise<string> {
  const supabase = createAdminClient();
  const fileName = generateFileName(file.name);
  const path = `${userId}/logo/${fileName}`;

  const { error } = await supabase.storage
    .from(MANUFACTURER_PUBLIC_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from(MANUFACTURER_PUBLIC_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}

// PRIVATE: Verification document (GST, PAN, etc.)
export async function uploadManufacturerVerificationDocument(
  file: File,
  userId: string,
): Promise<string> {
  const supabase = createAdminClient();
  const fileName = generateFileName(file.name);
  const path = `${userId}/documents/${fileName}`;

  const { error } = await supabase.storage
    .from(MANUFACTURER_PRIVATE_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) throw error;

  return path;
}

// PUBLIC: Product images
export async function uploadProductImages(
  files: File[],
  userId: string,
  productId: string,
): Promise<string[]> {
  const supabase = createAdminClient();

  const results = await Promise.all(
    files.map(async (file) => {
      const fileName = generateFileName(file.name);
      const path = `${userId}/products/${productId}/${fileName}`;

      const { error } = await supabase.storage
        .from(MANUFACTURER_PUBLIC_BUCKET)
        .upload(path, file, { contentType: file.type });

      if (error) throw error;

      const { data } = supabase.storage
        .from(MANUFACTURER_PUBLIC_BUCKET)
        .getPublicUrl(path);
      return data.publicUrl;
    }),
  );

  return results;
}

// Delete file from any bucket
export async function deleteManufacturerFile(
  filePath: string,
  isPrivate: boolean = false,
) {
  const supabase = createAdminClient();
  const bucket = isPrivate
    ? MANUFACTURER_PRIVATE_BUCKET
    : MANUFACTURER_PUBLIC_BUCKET;
  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) throw error;
}

// ============ DEALER UPLOAD FUNCTIONS ============

// PUBLIC: Dealer company logo
export async function uploadDealerLogo(
  file: File,
  userId: string,
): Promise<string> {
  const supabase = createAdminClient();
  const fileName = generateFileName(file.name);
  const path = `${userId}/logo/${fileName}`;

  const { error } = await supabase.storage
    .from(DEALER_PUBLIC_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from(DEALER_PUBLIC_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}

// PRIVATE: Dealer verification document
export async function uploadDealerVerificationDocument(
  file: File,
  userId: string,
): Promise<string> {
  const supabase = createAdminClient();
  const fileName = generateFileName(file.name);
  const path = `${userId}/documents/${fileName}`;

  const { error } = await supabase.storage
    .from(DEALER_PRIVATE_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) throw error;

  return path;
}

// Delete dealer file from any bucket
export async function deleteDealerFile(
  filePath: string,
  isPrivate: boolean = false,
) {
  const supabase = createAdminClient();
  const bucket = isPrivate ? DEALER_PRIVATE_BUCKET : DEALER_PUBLIC_BUCKET;
  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) throw error;
}
