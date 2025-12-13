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
import {
  type ApiResponse,
  type ApplicationHistoryEntry,
  type ApplicationStatus,
  type ApplicationStatusData,
  Role,
} from "@/types";

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
    } catch (uploadError) {
      return {
        success: false,
        message: "Failed to upload files.",
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
        application_status: "PENDING",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      return { success: false, message: "Failed to save data." };
    }

    console.log("About to insert pending history for user:", userId);

    const { data: historyData, error: historyError } = await supabase
      .from("manufacturer_application_history")
      .insert({
        manufacturer_id: userId,
        status: "PENDING",
        admin_id: null,
        message: null,
      })
      .select();

    if (historyError) {
      console.error("History insert failed:", historyError);
    } else {
      console.log("History inserted successfully:", historyData);
    }

    await createSession({
      userId,
      role: Role.MANUFACTURER,
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

export async function getManufacturerApplicationStatus(
  manufacturerId: string,
): Promise<ApiResponse<ApplicationStatusData>> {
  const supabase = await createClient();

  try {
    const { data: manufacturer, error: manufacturerError } = await supabase
      .from("manufacturer")
      .select("application_status, is_onboarded")
      .eq("id", manufacturerId)
      .single();

    if (manufacturerError || !manufacturer) {
      console.error("Failed to fetch manufacturer status:", manufacturerError);
      return {
        success: false,
        message: "Failed to load application status.",
      };
    }

    if (!manufacturer.is_onboarded) {
      return {
        success: true,
        data: {
          currentStatus: null,
          history: [],
        },
      };
    }

    const historyResult =
      await getManufacturerApplicationHistory(manufacturerId);

    return {
      success: true,
      data: {
        currentStatus: manufacturer.application_status as ApplicationStatus,
        history: historyResult.data ?? [],
      },
    };
  } catch (err) {
    console.error("Unexpected error in getManufacturerApplicationStatus:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function getManufacturerApplicationHistory(
  manufacturerId: string,
): Promise<ApiResponse<ApplicationHistoryEntry[]>> {
  const supabase = await createClient();

  try {
    const { data: history, error } = await supabase
      .from("manufacturer_application_history")
      .select(`
        id,
        status,
        message,
        created_at,
        admin:admin_id (
            id,
            username,
            email,
            mobile,
            profile_image,
            created_at,
            updated_at
          )
      `)
      .eq("manufacturer_id", manufacturerId)
      .order("created_at", { ascending: true });

    if (error) {
      return {
        success: false,
        message: "Failed to fetch application history.",
      };
    }

    return {
      success: true,
      data: history ?? [],
    };
  } catch (err) {
    console.error("Get application history error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
