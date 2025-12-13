"use server";

import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { createSession } from "@/lib/supabase/session";
import type { AdminSigninForm } from "@/schema/admin/auth";
import { type Admin, type ApiResponse, Role } from "@/types";

export async function signInAdmin(
  data: AdminSigninForm,
): Promise<ApiResponse<Admin>> {
  const supabase = await createClient();

  try {
    const { username, password } = data;

    if (!username || !password) {
      return {
        success: false,
        message: "Username and password are required",
      };
    }

    const { data: admin, error } = await supabase
      .from("admin")
      .select(
        "id, username, password, profile_image, mobile, email , created_at, updated_at",
      )
      .eq("username", username.trim())
      .single();

    if (error || !admin) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }

    await createSession({
      userId: admin.id,
      role: Role.ADMIN,
    });

    delete admin.password;

    return {
      success: true,
      message: "Welcome Back!",
      data: admin,
    };
  } catch (err) {
    console.error("Admin sign-in error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
