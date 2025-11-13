"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// --- TYPES ---
interface ActionResult {
  success?: boolean;
  id?: number;
  error?: string;
}

// --- ACTION 1: CREATE A FAREWELL ---
export async function createFarewellAction(
  name: string,
  year: number
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found");

    const { data: newFarewell, error: farewellError } = await supabase
      .from("farewells")
      .insert({ name, event_year: year })
      .select("id")
      .single();

    if (farewellError) throw farewellError;
    if (!newFarewell) throw new Error("Failed to create farewell");

    const { error: participantError } = await supabase
      .from("farewell_participants")
      .insert({
        user_id: user.id,
        farewell_id: newFarewell.id,
        role: "main_admin",
      });

    if (participantError) throw participantError;

    cookieStore.set("active_farewell_id", newFarewell.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    revalidatePath("/dashboard", "layout");

    return { success: true, id: newFarewell.id };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

// --- ACTION 2: JOIN A FAREWELL ---
export async function joinFarewellAction(
  inviteCode: string
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found");

    if (!inviteCode || inviteCode.length < 8) {
      throw new Error("Invalid invite code. Must be 8 characters.");
    }
    console.log(inviteCode)

    const { data: farewell, error: farewellError } = await supabase
      .from("farewells")
      .select("id")
      .eq("invite_code", inviteCode)
      .single();

    if (farewellError || !farewell) {
      console.log(farewellError)
      throw new Error("Farewell not found. Please check the code.");
    }

    const { error: participantError } = await supabase
      .from("farewell_participants")
      .insert({
        user_id: user.id,
        farewell_id: farewell.id,
        role: "student",
      });

    // Ignore "already exists" error (unique constraint)
    if (participantError && participantError.code !== "23505") {
      throw participantError;
    }

    cookieStore.set("active_farewell_id", farewell.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    revalidatePath("/dashboard", "layout");

    return { success: true, id: farewell.id };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

// --- ACTION 3: SWITCH FAREWELLS ---
export async function switchFarewell(farewellId: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set("active_farewell_id", farewellId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}
