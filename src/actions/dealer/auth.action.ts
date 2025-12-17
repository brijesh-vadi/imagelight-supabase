"use server";

import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { createSession } from "@/lib/supabase/session";
import {
  type SignInForm,
  type SignupForm,
  signinSchema,
  signupSchema,
} from "@/schema/dealer/auth";
import { type ApiResponse, type Dealer, type DealerUser, Role } from "@/types";

export async function signupDealer(
  data: SignupForm,
): Promise<ApiResponse<DealerUser>> {
  const supabase = await createClient();
  try {
    const parsed = signupSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Failed to validate data",
      };
    }

    const { email, mobile, password } = parsed.data;

    const { data: existing } = await supabase
      .from("dealers")
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
      .from("dealers")
      .insert({
        email,
        mobile,
        password_hash: hashedPassword,
      })
      .select("id, email, mobile, is_onboarded")
      .single();

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

export async function signInDealer(
  data: SignInForm,
): Promise<ApiResponse<DealerUser>> {
  const supabase = await createClient();
  try {
    const parsed = signinSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Failed to parse data",
      };
    }

    const { mobile, password } = parsed.data;

    const { data: user, error } = await supabase
      .from("dealers")
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
        message: "Account does not exist with this mobile number.",
      };
    }

    if (!user.is_active) {
      return {
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      };
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return {
        success: false,
        message: "Invalid mobile or password.",
      };
    }

    await createSession({
      userId: String(user.id),
      role: Role.DEALER,
    });

    const dealer: DealerUser = {
      id: String(user.id),
      email: user.email,
      mobile: user.mobile,
    };

    return {
      success: true,
      message: "Signed in successfully.",
      data: dealer,
    };
  } catch (err) {
    console.error("Sign in error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function getDealerProfile(
  userId: string,
): Promise<ApiResponse<Dealer>> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("dealers")
      .select(
        `
        id,
        email,
        mobile,
        is_email_verified,
        is_mobile_verified,
        is_onboarded,
        is_active,
        business_name,
        contact_person,
        gst_number,
        address,
        city,
        state,
        pincode,
        verification_document,
        created_at,
        updated_at
      `,
      )
      .eq("id", userId)
      .single();

    if (error || !data) {
      return {
        success: false,
        message: "Dealer profile not found.",
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
