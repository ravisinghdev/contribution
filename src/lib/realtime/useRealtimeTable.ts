// src/lib/realtime/useRealtimeTable.ts
"use client";

import { useEffect } from "react";
import type {
  RealtimePostgresChangesPayload,
  SupabaseClient,
} from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

type Row<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

type EventType = "INSERT" | "UPDATE" | "DELETE";

interface Params<T extends keyof Database["public"]["Tables"]> {
  supabase: SupabaseClient<Database>;
  table: T;
  onInsert?: (row: Row<T>) => void;
  onUpdate?: (row: Row<T>) => void;
  onDelete?: (row: Row<T>) => void;
}

export function useRealtimeTable<T extends keyof Database["public"]["Tables"]>({
  supabase,
  table,
  onInsert,
  onUpdate,
  onDelete,
}: Params<T>) {
  useEffect(() => {
    type Payload = RealtimePostgresChangesPayload<Row<T>>;

    const channel = supabase.channel(`public:${String(table)}`).subscribe();

    // subscribe to postgres_changes
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: String(table) },
      (payload: Payload) => {
        const eventType = payload.eventType as EventType;

        if (eventType === "INSERT") {
          const row = payload.new;
          if (row && typeof row === "object" && "id" in row) onInsert?.(row);
          return;
        }

        if (eventType === "UPDATE") {
          const row = payload.new;
          if (row && typeof row === "object" && "id" in row) onUpdate?.(row);
          return;
        }

        if (eventType === "DELETE") {
          const row = payload.old;
          if (row && typeof row === "object" && "id" in row) onDelete?.(row);
          return;
        }
      }
    );

    return () => {
      channel.unsubscribe().catch(() => {});
    };
  }, [supabase, table, onInsert, onUpdate, onDelete]);
}
