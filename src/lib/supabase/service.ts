// server-only Supabase service client using the SERVICE ROLE KEY
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export function createServiceClient() {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (server environment only)"
    );
  }

  return createClient<Database>(url, key);
}
