import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import type { Database } from "../../../lib/database.types.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, year } = await req.json();

    // --- THIS IS THE FIX ---
    // We create a new client using the SERVICE_ROLE_KEY to bypass RLS
    // We MUST pass auth.persistSession: false
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    // ----------------------

    // We still need to get the user's ID, so we use the user's token
    // to create a *second* client just for that.
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

    if (!name || !year) throw new Error("Missing farewell name or year");

    // This operation will now run as an admin and bypass RLS
    const { data: newFarewell, error: farewellError } = await supabaseClient
      .from("farewells")
      .insert({ name: name, event_year: year })
      .select("id")
      .single();

    if (farewellError) throw farewellError;
    if (!newFarewell) throw new Error("Failed to create farewell");

    // This operation will also run as an admin
    const { error: participantError } = await supabaseClient
      .from("farewell_participants")
      .insert({
        user_id: user.id,
        farewell_id: newFarewell.id,
        role: "main_admin",
      });

    if (participantError) throw participantError;

    return new Response(JSON.stringify({ success: true, id: newFarewell.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
