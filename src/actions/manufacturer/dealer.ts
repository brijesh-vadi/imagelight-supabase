"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import { type DealerForm, dealerSchema } from "@/schema/manufacturer/dealer";
import type { ApiResponse } from "@/types";
import { Role } from "@/types";

export async function addDealer(data: DealerForm): Promise<ApiResponse<null>> {
  const session = await getSession(Role.MANUFACTURER);

  if (!session?.userId) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const supabase = await createClient();

  try {
    const parsed = dealerSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid dealer details",
      };
    }

    const { email, mobile, companyName, contactPerson, password } = parsed.data;

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: dealer, error } = await supabase
      .from("dealers")
      .insert({
        email,
        mobile,
        password_hash: passwordHash,
        company_name: companyName,
        contact_person: contactPerson,
        is_added_by_manufacturer: true,
        added_by_manufacturer_id: session.userId,
        is_onboarded: false,
        is_active: true,
      })
      .select("id")
      .single();

    if (error) {
      const isUniqueViolation =
        error.code === "23505" || /duplicate key/i.test(error.message || "");

      return {
        success: false,
        message: isUniqueViolation
          ? "Dealer with this email or mobile already exists."
          : "Failed to create dealer.",
      };
    }

    const { error: historyError } = await supabase
      .from("dealer_application_history")
      .insert({
        dealer_id: dealer.id,
        manufacturer_id: session.userId,
        status: "APPROVED",
        message: "Dealer added directly by manufacturer",
      });

    if (historyError) {
      console.error("dealer_application_history error:", historyError);
      return {
        success: false,
        message: "Dealer created but failed to create history entry",
      };
    }

    // 3️⃣ Revalidate correct path
    revalidatePath("/manufacturer/dealer-applications");

    return {
      success: true,
      message:
        "Dealer added successfully. Share the login credentials with the dealer.",
    };
  } catch (err) {
    console.error("addDealer error:", err);
    return {
      success: false,
      message: "Unexpected server error",
    };
  }
}
