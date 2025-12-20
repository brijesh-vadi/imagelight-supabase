// "use server";

// import { createClient } from "@/lib/supabase/server";
// import { getSession } from "@/lib/supabase/session";
// import { type ApiResponse, type Dealer, type Pagination, Role } from "@/types";

// export async function getDealersAppliedToManufacturer({
//   page = 1,
//   limit = 20,
// }: Pagination): Promise<ApiResponse<Dealer[]>> {
//   const supabase = await createClient();
//   const session = await getSession(Role.MANUFACTURER);
//   try {
//     const from = (page - 1) * limit;
//     const to = from + limit - 1;

//     const { data, error } = await supabase
//       .from("dealer_application_history")
//       .select(
//         `
//         dealer:dealers!dealer_application_history_dealer_id_fkey (
//           id,
//           email,
//           mobile,
//           is_email_verified,
//           is_mobile_verified,
//           is_onboarded,
//           is_active,
//           company_name,
//           company_logo,
//           contact_person,
//           gst_number,
//           address,
//           city,
//           state,
//           pincode,
//           verification_document,
//           created_at,
//           updated_at
//         )
//       `,
//         { count: "exact" },
//       )
//       .eq("manufacturer_id", session?.userId)
//       .order("created_at", { ascending: false })
//       .range(from, to);

//     if (error) {
//       console.error("Supabase error:", error);
//       return {
//         success: false,
//         message: "Failed to fetch dealers who applied.",
//       };
//     }

//     const dealers: Dealer[] =
//       data?.map((row: any) => row.dealer).filter(Boolean) ?? [];

//     return {
//       success: true,
//       data: dealers,
//     };
//   } catch (err) {
//     console.error("Unexpected error in getDealersAppliedToManufacturer:", err);
//     return {
//       success: false,
//       message: "Something went wrong. Please try again.",
//     };
//   }
// }

"use server";

import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import {
  type ApiResponse,
  type ApplicationStatus,
  type Dealer,
  type Pagination,
  Role,
} from "@/types";

export async function getDealersAppliedToManufacturer({
  page = 1,
  limit = 20,
}: Pagination): Promise<
  ApiResponse<
    {
      dealer: Dealer;
      status: ApplicationStatus;
      message: string | null;
      created_at: string;
      updated_at: string;
    }[]
  >
> {
  const supabase = await createClient();
  const session = await getSession(Role.MANUFACTURER);

  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("dealer_application_history")
      .select(
        `
        status,
        message,
        created_at,
        updated_at,
        dealer:dealers!dealer_application_history_dealer_id_fkey (
          id,
          email,
          mobile,
          is_email_verified,
          is_mobile_verified,
          is_onboarded,
          is_active,
          company_name,
          company_logo,
          contact_person,
          gst_number,
          address,
          city,
          state,
          pincode,
          verification_document,
          created_at,
          updated_at
        )
      `,
        { count: "exact" },
      )
      .eq("manufacturer_id", session?.userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch dealers who applied.",
      };
    }

    const result =
      data?.map((row: any) => ({
        dealer: row.dealer,
        status: row.status,
        message: row.message,
        created_at: row.created_at,
        updated_at: row.updated_at,
      })) ?? [];

    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
