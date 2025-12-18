"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DEALER_PUBLIC_BUCKET } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { createSession } from "@/lib/supabase/session";
import {
  deleteDealerFile,
  uploadDealerLogo,
  uploadDealerVerificationDocument,
} from "@/lib/supabase/upload";
import {
  type DealerOnboardingForm,
  dealerOnboardingSchema,
} from "@/schema/dealer/onboard";
import { type ApiResponse, Role } from "@/types";

interface OnboardDealerData {
  userId: string;
  data: DealerOnboardingForm;
}

export async function onboardDealer({
  userId,
  data,
}: OnboardDealerData): Promise<ApiResponse<{ isOnboarded: boolean }>> {
  const supabase = await createClient();
  try {
    // 1. Check user exists & not already onboarded
    const { data: existingUser } = await supabase
      .from("dealers")
      .select("id, is_onboarded, email, mobile")
      .eq("id", userId)
      .single();

    if (!existingUser) {
      return { success: false, message: "User not found." };
    }

    if (existingUser.is_onboarded) {
      redirect("/dealer/dashboard");
    }

    // 2. Validate form data
    const parsed = dealerOnboardingSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: "Invalid data provided." };
    }
    const validatedData = parsed.data;

    // 3. Check GST duplicate (if provided)
    if (validatedData.gstNumber) {
      const { data: existingGst } = await supabase
        .from("dealer")
        .select("id")
        .eq("gst_number", validatedData.gstNumber)
        .neq("id", userId)
        .maybeSingle();

      if (existingGst) {
        return { success: false, message: "GST number is already registered." };
      }
    }

    // 4. Upload files → get paths only
    let companyLogoPath: string | undefined;
    let verificationDocumentPath: string | undefined;

    try {
      if (
        validatedData.companyLogo instanceof File &&
        validatedData.companyLogo.size > 0
      ) {
        companyLogoPath = await uploadDealerLogo(
          validatedData.companyLogo,
          userId,
        );
      }
      if (
        validatedData.verificationDocument instanceof File &&
        validatedData.verificationDocument.size > 0
      ) {
        verificationDocumentPath = await uploadDealerVerificationDocument(
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

    // 5. Update dealer record
    const { error: updateError } = await supabase
      .from("dealers")
      .update({
        company_name: validatedData.companyName,
        contact_person: validatedData.contactPerson,
        gst_number: validatedData.gstNumber || null,
        address: validatedData.address,
        state: validatedData.state,
        city: validatedData.city,
        pincode: validatedData.pincode,
        company_logo: companyLogoPath,
        verification_document: verificationDocumentPath,
        is_onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    console.log("updateError", updateError);

    if (updateError) {
      return { success: false, message: "Failed to save data." };
    }

    // 6. Create session
    await createSession({
      userId,
      role: Role.DEALER,
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

export async function updateDealerProfile({
  userId,
  data,
}: OnboardDealerData): Promise<ApiResponse<{ isOnboarded: boolean }>> {
  const supabase = await createClient();

  try {
    // Fetch current dealer data
    const { data: existingUser, error: fetchError } = await supabase
      .from("dealer")
      .select("id, is_onboarded, company_logo, verification_document")
      .eq("id", userId)
      .single();

    if (fetchError || !existingUser) {
      return { success: false, message: "Dealer profile not found." };
    }

    // Validate form data
    const parsed = dealerOnboardingSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, message: "Invalid data provided." };
    }
    const validatedData = parsed.data;

    // Check GST duplicate (if provided)
    if (validatedData.gstNumber) {
      const { data: existingGst } = await supabase
        .from("dealer")
        .select("id")
        .eq("gst_number", validatedData.gstNumber)
        .neq("id", userId)
        .maybeSingle();

      if (existingGst) {
        return { success: false, message: "GST number is already registered." };
      }
    }

    // Keep existing values by default
    let companyLogoUrl = existingUser.company_logo;
    let verificationDocumentPath = existingUser.verification_document;

    // Helper: Convert public URL → storage path
    const publicUrlToPath = (url: string | null | undefined): string | null => {
      if (!url) return null;
      try {
        const parsed = new URL(url);
        return decodeURIComponent(
          parsed.pathname.replace(
            `/storage/v1/object/public/${DEALER_PUBLIC_BUCKET}/`,
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
            await deleteDealerFile(oldPath, false); // false = public bucket
          } catch (err) {
            console.warn("Failed to delete old logo (continuing anyway):", err);
          }
        }
      }

      // Upload new logo → returns new public URL
      try {
        companyLogoUrl = await uploadDealerLogo(
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
          await deleteDealerFile(existingUser.verification_document, true); // true = private bucket
        } catch (err) {
          console.warn("Failed to delete old verification document:", err);
        }
      }

      // Upload new document → returns private path
      try {
        verificationDocumentPath = await uploadDealerVerificationDocument(
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
      .from("dealer")
      .update({
        company_name: validatedData.companyName,
        contact_person: validatedData.contactPerson,
        gst_number: validatedData.gstNumber || null,
        address: validatedData.address,
        state: validatedData.state,
        city: validatedData.city,
        pincode: validatedData.pincode,
        company_logo: companyLogoUrl,
        verification_document: verificationDocumentPath,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Database update failed:", updateError);
      return { success: false, message: "Failed to update profile." };
    }

    revalidatePath("/dealer/dashboard");

    return {
      success: true,
      message: "Profile updated successfully!",
      data: { isOnboarded: true },
    };
  } catch (err: any) {
    console.error("Unexpected error in updateDealerProfile:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
