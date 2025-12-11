"use server";

import { createClient } from "@supabase/supabase-js";
import { uploadDocument, uploadImage } from "@/lib/upload";
import {
  type ManufacturerOnboardingForm,
  manufacturerOnboardingSchema,
} from "@/schema/manufacturer/onboard";
import type { ApiResponse } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
);

interface OnboardManufacturerData {
  userId: string;
  data: ManufacturerOnboardingForm;
  // formData: FormData;
}

export async function onboardManufacturer({
  userId,
  data,
}: OnboardManufacturerData): Promise<ApiResponse<{ isOnboarded: boolean }>> {
  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from("manufacturer")
      .select("id, is_onboarded")
      .eq("id", userId)
      .single();

    if (fetchError || !existingUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (existingUser.is_onboarded) {
      return {
        success: false,
        message: "User is already onboarded.",
      };
    }

    const parsed = manufacturerOnboardingSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        message: "Failed to validate the data.",
      };
    }

    const validatedData = parsed.data;

    const { data: existingGst } = await supabase
      .from("manufacturer")
      .select("id")
      .eq("gst_number", validatedData.gstNumber)
      .neq("id", userId)
      .maybeSingle();

    if (existingGst) {
      return {
        success: false,
        message: "GST number is already registered.",
      };
    }

    let companyLogoUrl: string | undefined;
    let verificationDocumentUrl: string | undefined;

    try {
      if (validatedData.companyLogo instanceof File) {
        companyLogoUrl = await uploadImage(
          validatedData.companyLogo,
          `manufacturers/${userId}/logo`,
        );
      }

      if (validatedData.verificationDocument instanceof File) {
        verificationDocumentUrl = await uploadDocument(
          validatedData.verificationDocument,
          `manufacturers/${userId}/documents`,
        );
      }
    } catch (uploadError) {
      console.error("File upload error:", uploadError);
      return {
        success: false,
        message: "Failed to upload files. Please try again.",
      };
    }

    if (!companyLogoUrl || !verificationDocumentUrl) {
      return {
        success: false,
        message: "Company logo and verification document are required.",
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
        company_logo: companyLogoUrl,
        verification_document: verificationDocumentUrl,
        business_type: "manufacturer",
        is_onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Database update error:", updateError);
      return {
        success: false,
        message: updateError.message || "Failed to complete onboarding.",
      };
    }

    return {
      success: true,
      message: "Onboarding completed successfully!",
      data: { isOnboarded: true },
    };
  } catch (err) {
    console.error("Onboarding error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function getManufacturerProfile(
  userId: string,
): Promise<ApiResponse<any>> {
  try {
    const { data, error } = await supabase
      .from("manufacturer")
      .select(
        `
        id,
        email,
        mobile,
        company_name,
        company_logo,
        contact_person,
        website,
        gst_number,
        company_description,
        address,
        city,
        state,
        pincode,
        is_onboarded,
        is_verified,
        is_active,
        created_at
      `,
      )
      .eq("id", userId)
      .single();

    if (error || !data) {
      return {
        success: false,
        message: "Profile not found.",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("Get profile error:", err);
    return {
      success: false,
      message: "Failed to fetch profile.",
    };
  }
}
