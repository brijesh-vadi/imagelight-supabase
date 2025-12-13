"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/supabase/session";
import { type UnitForm, unitSchema } from "@/schema/manufacturer/unit";
import { type ApiResponse, Role, type Unit } from "@/types";

export async function addUnit(data: UnitForm): Promise<ApiResponse<Unit>> {
  const session = await getSession(Role.MANUFACTURER);
  const supabase = await createClient();
  try {
    const parsed = unitSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Failed to validate",
      };
    }

    const { name } = parsed.data;

    const { data: unit, error } = await supabase
      .from("unit")
      .insert({ name, manufacturer_id: session?.userId })
      .select()
      .single();

    if (error) {
      const isUniqueViolation =
        error.code === "23505" || /duplicate key/i.test(error.message || "");
      if (isUniqueViolation) {
        return {
          success: false,
          message: "A unit with this name already exists.",
        };
      }
      return {
        success: false,
        message: "Failed to create unit.",
      };
    }

    revalidatePath("/manufacturer/units");

    return { success: true, data: unit, message: "Unit added successfully" };
  } catch (err) {
    console.error("addUnitAction error:", err);
    return { success: false, message: "Unexpected server error" };
  }
}

export async function getUnits(): Promise<ApiResponse<Unit[]>> {
  try {
    const session = await getSession(Role.MANUFACTURER);
    const supabase = await createClient();

    if (!session?.userId) {
      return { success: true, data: [] };
    }

    const { data, error } = await supabase
      .from("unit")
      .select("id, name, created_at, updated_at, manufacturer_id")
      .eq("manufacturer_id", session?.userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getUnits Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch units",
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (err) {
    console.error("getUnits unexpected error:", err);
    return {
      success: false,
      message: "Something went wrong on our side",
    };
  }
}

export async function deleteUnit(unitId: string): Promise<ApiResponse<null>> {
  try {
    const session = await getSession(Role.MANUFACTURER);
    const supabase = await createClient();

    const { data: unit, error: fetchError } = await supabase
      .from("unit")
      .select("id")
      .eq("id", unitId)
      .eq("manufacturer_id", session?.userId)
      .maybeSingle();

    if (fetchError || !unit) {
      return {
        success: false,
        message: "Unit not found or you don't have permission to delete it",
      };
    }
    const { error } = await supabase.from("unit").delete().eq("id", unitId);

    if (error) {
      return {
        success: false,
        message: "Failed to delete unit",
      };
    }

    revalidatePath("/manufacturer/units");

    return {
      success: true,
      message: "Unit deleted successfully",
    };
  } catch (err) {
    console.error("deleteUnit unexpected error:", err);
    return {
      success: false,
      message: "Something went wrong while deleting the unit",
    };
  }
}

export async function updateUnit(
  unitId: string,
  data: UnitForm,
): Promise<ApiResponse<Unit>> {
  try {
    const session = await getSession(Role.MANUFACTURER);
    const supabase = await createClient();

    const parsed = unitSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Failed to validate data",
      };
    }

    const { name } = parsed.data;

    const { data: duplicate } = await supabase
      .from("unit")
      .select("id")
      .eq("manufacturer_id", session?.userId)
      .ilike("name", name)
      .neq("id", unitId)
      .limit(1);

    if (duplicate && duplicate.length > 0) {
      return {
        success: false,
        message: "A unit with this name already exists",
      };
    }

    const { data: updatedUnit, error } = await supabase
      .from("unit")
      .update({ name })
      .eq("id", unitId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: "Failed to update unit",
      };
    }

    revalidatePath("/manufacturer/units");

    return {
      success: true,
      data: updatedUnit,
      message: "Unit updated successfully",
    };
  } catch (err) {
    console.error("updateUnit unexpected error:", err);
    return {
      success: false,
      message: "Something went wrong while updating the unit",
    };
  }
}
