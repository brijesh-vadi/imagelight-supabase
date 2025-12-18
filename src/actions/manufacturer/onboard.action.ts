"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MANUFACTURER_PUBLIC_BUCKET } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { createSession } from "@/lib/supabase/session";
import {
  deleteManufacturerFile,
  uploadManufacturerLogo,
  uploadManufacturerVerificationDocument,
} from "@/lib/supabase/upload";
import {
  type OnboardingForm,
  onboardingSchema,
  type ResubmitOnboardingForm,
  resubmitOnboardingSchema,
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
  data: OnboardingForm;
}

interface ResubmitOnboardManufacturerData {
  userId: string;
  data: ResubmitOnboardingForm;
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
    const parsed = onboardingSchema.safeParse(data);
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

    await supabase
      .from("manufacturer_application_history")
      .insert({
        manufacturer_id: userId,
        status: "PENDING",
        admin_id: null,
        message: null,
      })
      .select();

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

export async function updateManufacturerApplication({
  userId,
  data,
}: ResubmitOnboardManufacturerData): Promise<
  ApiResponse<{ isOnboarded: boolean }>
> {
  const supabase = await createClient();

  try {
    // Fetch current manufacturer data
    const { data: existingUser, error: fetchError } = await supabase
      .from("manufacturer")
      .select("id, is_onboarded, company_logo, verification_document")
      .eq("id", userId)
      .single();

    if (fetchError || !existingUser) {
      return { success: false, message: "Manufacturer profile not found." };
    }

    // Validate form data
    const parsed = resubmitOnboardingSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: "Invalid data provided." };
    }
    const validatedData = parsed.data;

    // Check GST duplicate
    const { data: existingGst } = await supabase
      .from("manufacturer")
      .select("id")
      .eq("gst_number", validatedData.gstNumber)
      .neq("id", userId)
      .maybeSingle();

    if (existingGst) {
      return { success: false, message: "GST number is already registered." };
    }

    // Keep existing values by default
    let companyLogoUrl = existingUser.company_logo; // public URL string (or null)
    let verificationDocumentPath = existingUser.verification_document; // private path string (or null)

    // Helper: Convert public URL → storage path
    const publicUrlToPath = (url: string | null | undefined): string | null => {
      if (!url) return null;
      try {
        const parsed = new URL(url);
        return decodeURIComponent(
          parsed.pathname.replace(
            `/storage/v1/object/public/${MANUFACTURER_PUBLIC_BUCKET}/`,
            "",
          ),
        );
      } catch {
        console.warn("Invalid logo URL format:", url);
        return null;
      }
    };

    // === Update Company Logo ===
    if (
      validatedData.companyLogo instanceof File &&
      validatedData.companyLogo.size > 0
    ) {
      // Delete old logo from PUBLIC bucket
      if (existingUser.company_logo) {
        const oldPath = publicUrlToPath(existingUser.company_logo);
        if (oldPath) {
          try {
            await deleteManufacturerFile(oldPath, false); // false = public bucket
          } catch (err) {
            console.warn("Failed to delete old logo (continuing anyway):", err);
            // Don't block update if cleanup fails
          }
        }
      }

      // Upload new logo → returns new public URL
      try {
        companyLogoUrl = await uploadManufacturerLogo(
          validatedData.companyLogo,
          userId,
        );
      } catch (err) {
        console.error("Failed to upload new logo:", err);
        return { success: false, message: "Failed to upload company logo." };
      }
    }

    // === Update Verification Document ===
    if (
      validatedData.verificationDocument instanceof File &&
      validatedData.verificationDocument.size > 0
    ) {
      // Delete old document from PRIVATE bucket
      if (existingUser.verification_document) {
        try {
          await deleteManufacturerFile(
            existingUser.verification_document,
            true,
          ); // true = private bucket
        } catch (err) {
          console.warn("Failed to delete old verification document:", err);
        }
      }

      // Upload new document → returns private path
      try {
        verificationDocumentPath = await uploadManufacturerVerificationDocument(
          validatedData.verificationDocument,
          userId,
        );
      } catch (err) {
        console.error("Failed to upload verification document:", err);
        return {
          success: false,
          message: "Failed to upload verification document.",
        };
      }
    }

    // Update database record
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
        verification_document: verificationDocumentPath,
        business_type: "manufacturer",
        application_status: "PENDING",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Database update failed:", updateError);
      return { success: false, message: "Failed to update application." };
    }

    // Record resubmission in history
    await supabase.from("manufacturer_application_history").insert({
      manufacturer_id: userId,
      status: "PENDING",
      admin_id: null,
      message: "Application resubmitted after rejection",
    });

    revalidatePath("/manufacturer/dashboard");

    return {
      success: true,
      message: "Application updated and resubmitted successfully!",
      data: { isOnboarded: true },
    };
  } catch (err: any) {
    console.error("Unexpected error in updateManufacturerApplication:", err);
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
