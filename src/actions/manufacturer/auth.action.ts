"use server";

import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { createSession } from "@/lib/supabase/session";
import {
  type SignInForm,
  type SignUpForm,
  signInSchema,
  signupSchema,
} from "@/schema/manufacturer/auth";
import {
  type ApiResponse,
  type Manufacturer,
  type ManufacturerUser,
  Role,
} from "@/types";

export async function signupManufacturer(
  data: SignUpForm,
): Promise<ApiResponse<ManufacturerUser>> {
  const supabase = await createClient();
  try {
    const parsed = signupSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Failed to parse data",
      };
    }

    const { email, mobile, password } = parsed.data;

    const { data: existing } = await supabase
      .from("manufacturer")
      .select("id")
      .or(`email.eq.${email},mobile.eq.${mobile}`)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        message: "Account with this email or mobile already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: user, error: insertError } = await supabase
      .from("manufacturer")
      .insert({
        email,
        mobile,
        password_hash: hashedPassword,
      })
      .select("id, email, mobile, is_onboarded")
      .single();

    console.log("insertError", insertError);

    if (insertError) {
      return {
        success: false,
        message: insertError.message || "Failed to create account.",
      };
    }

    return {
      success: true,
      message: "Account created successfully!",
      data: user,
    };
  } catch (err) {
    console.error("Sign up error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function signInManufacturer(
  data: SignInForm,
): Promise<ApiResponse<ManufacturerUser>> {
  const supabase = await createClient();
  try {
    const parsed = signInSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Failed to parse data",
      };
    }

    const { mobile, password } = parsed.data;

    const { data: user, error } = await supabase
      .from("manufacturer")
      .select("id, email, mobile, password_hash, is_onboarded, is_active")
      .eq("mobile", mobile)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }

    if (!user) {
      return {
        success: false,
        message: "Account does not exists with this mobile number.",
      };
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    await createSession({
      userId: String(user.id),
      role: Role.MANUFACTURER,
    });

    const manufacturer: ManufacturerUser = {
      id: String(user.id),
      email: user.email,
      mobile: user.mobile,
    };

    return {
      success: true,
      message: "Signed in successfully.",
      data: manufacturer,
    };
  } catch (err) {
    console.error("Sign in error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function getManufacturerProfile(
  userId: string,
): Promise<ApiResponse<Manufacturer>> {
  const supabase = await createClient();
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
        business_type,
        website,
        gst_number,
        company_description,
        verification_document,
        address,
        city,
        state,
        pincode,
        is_onboarded,
        is_verified,
        is_active,
        is_email_verified,
        is_mobile_verified,
        created_at,
        updated_at
      `,
      )
      .eq("id", userId)
      .single();

    if (error || !data) {
      return {
        success: false,
        message: "Manufacturer profile not found.",
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
