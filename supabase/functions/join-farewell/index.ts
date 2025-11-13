import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import type { Database } from "../../../lib/database.types.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { invite_code } = await req.json();

    // --- THIS IS THE FIX ---
    // Create an admin client to bypass RLS
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    // ----------------------

    // Create a user-level client to get the user's ID
    const userClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();
    if (authError || !user) throw new Error("User not found");

    if (!invite_code) throw new Error("Invite code is required");

    // This query will now run as admin and bypass RLS
    const { data: farewell, error: farewellError } = await supabaseClient
      .from("farewells")
      .select("id")
      .eq("invite_code", invite_code)
      .single();

    if (farewellError)
      throw new Error("Invalid invite code or farewell not found");

    // This insert will also run as admin
    const { error: participantError } = await supabaseClient
      .from("farewell_participants")
      .insert({
        user_id: user.id,
        farewell_id: farewell.id,
        role: "student",
      });

    if (participantError) {
      if (participantError.code === "23505") {
        throw new Error("You are already a member of this farewell.");
      }
      throw participantError;
    }

    return new Response(
      JSON.stringify({ success: true, farewell_id: farewell.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
