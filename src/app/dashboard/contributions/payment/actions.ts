"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Insert transaction securely
export async function addTransaction(payload: {
  user_id: string;
  amount: number;
  type: "online" | "offline";
  notes?: string | null;
  receipt_url?: string | null;
  logged_by_admin_id?: string | null;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("transactions").insert([payload]);

  if (error) {
    console.error(error);
    return { success: false, message: error.message };
  }

  // refresh UI for server components
  revalidatePath("/dashboard/contributions/payment");

  return { success: true };
}

// Approve offline payment
export async function approveTransaction(id: number, admin_id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("transactions")
    .update({
      status: "completed",
      logged_by_admin_id: admin_id,
    })
    .eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/contributions/payment");

  return { success: true };
}
