"use server";

import { createClient } from "@/lib/supabase/server";

export async function createAnnouncementAction(
  title: string,
  content: string,
  isUrgent: boolean,
  farewellId: number
) {
  const supabase = await createClient();

  if (isNaN(farewellId)) throw new Error("Invalid farewell ID.");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated.");

  const { data: roleData, error: roleError } = await supabase
    .from("farewell_participants")
    .select("role")
    .eq("user_id", user.id)
    .eq("farewell_id", farewellId)
    .maybeSingle();

  if (roleError) throw roleError;

  const allowedRoles = ["main_admin", "parallel_admin", "organizer"];
  if (!roleData || !allowedRoles.includes(roleData.role)) {
    throw new Error("You are not authorized to create announcements.");
  }

  const { data, error } = await supabase
    .from("announcements")
    .insert([
      {
        farewell_id: farewellId,
        user_id: user.id,
        title,
        content,
        is_urgent: isUrgent,
      },
    ])
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
