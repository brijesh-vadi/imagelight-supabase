"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createSession } from "@/lib/supabase/session";
import {
  uploadManufacturerLogo,
  uploadManufacturerVerificationDocument,
} from "@/lib/supabase/upload";
import {
  type ManufacturerOnboardingForm,
  manufacturerOnboardingSchema,
} from "@/schema/manufacturer/onboard";
import type { ApiResponse } from "@/types";

interface OnboardManufacturerData {
  userId: string;
  data: ManufacturerOnboardingForm;
}

export async function onboardManufacturer({
  userId,
  data,
}: OnboardManufacturerData): Promise<ApiResponse<{ isOnboarded: boolean }>> {
  const supabase = await createClient();
  try {
    // 1. Check user exists & not already onboarded
    const { data: existingUser } = await supabase
      .from("manufacturer")
      .select("id, is_onboarded, email, mobile")
      .eq("id", userId)
      .single();

    if (!existingUser) {
      return { success: false, message: "User not found." };
    }

    if (existingUser.is_onboarded) {
      redirect("/manufacturer/dashboard");
    }

    // 2. Validate form data
    const parsed = manufacturerOnboardingSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: "Invalid data provided." };
    }
    const validatedData = parsed.data;

    // 3. Check GST duplicate
    const { data: existingGst } = await supabase
      .from("manufacturer")
      .select("id")
      .eq("gst_number", validatedData.gstNumber)
      .neq("id", userId)
      .maybeSingle();

    if (existingGst) {
      return { success: false, message: "GST number is already registered." };
    }

    // 4. Upload files → get paths only
    let companyLogoPath: string | undefined;
    let verificationDocumentPath: string | undefined;

    try {
      if (
        validatedData.companyLogo instanceof File &&
        validatedData.companyLogo.size > 0
      ) {
        companyLogoPath = await uploadManufacturerLogo(
          validatedData.companyLogo,
          userId,
        );
      }
      if (
        validatedData.verificationDocument instanceof File &&
        validatedData.verificationDocument.size > 0
      ) {
        verificationDocumentPath = await uploadManufacturerVerificationDocument(
          validatedData.verificationDocument,
          userId,
        );
      }
    } catch (uploadError: any) {
      console.error("Upload failed:", uploadError);
      return {
        success: false,
        message: "Failed to upload files. " + uploadError.message,
      };
    }

    const { error: updateError } = await supabase
      .from("manufacturer")
      .update({
        company_name: validatedData.companyName,
        contact_person: validatedData.contactPerson,
        gst_number: validatedData.gstNumber,
        company_description: validatedData.description,
        website: validatedData.website || null,
        address: validatedData.address,
        state: validatedData.state,
        city: validatedData.city,
        pincode: validatedData.pincode,
        company_logo: companyLogoPath,
        verification_document: verificationDocumentPath,
        business_type: "manufacturer",
        is_onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("DB update error:", updateError);
      return { success: false, message: "Failed to save data." };
    }

    await createSession({
      userId,
      email: existingUser.email,
      role: "MANUFACTURER",
      isOnboarded: true,
    });

    return {
      success: true,
      message: "Onboarding completed successfully!",
      data: { isOnboarded: true },
    };
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
