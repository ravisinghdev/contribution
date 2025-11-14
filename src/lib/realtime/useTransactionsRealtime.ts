// src/lib/realtime/useTransactionsRealtime.ts
"use client";

import type { Database } from "@/types/supabase";
import { useRealtimeTable } from "./useRealtimeTable";

type TxRow = Database["public"]["Tables"]["transactions"]["Row"];

export function useTransactionsRealtime(
  supabase: Parameters<typeof useRealtimeTable>[0]["supabase"],
  setTransactions: (updater: (prev: TxRow[]) => TxRow[]) => void
) {
  useRealtimeTable({
    supabase,
    table: "transactions",
    onInsert(row: TxRow) {
      setTransactions((prev) => {
        if (prev.some((tx) => tx.id === row.id)) return prev;
        return [row, ...prev];
      });
    },
    onUpdate(row: TxRow) {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === row.id ? { ...tx, ...row } : tx))
      );
    },
    onDelete(row: TxRow) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== row.id));
    },
  });
}
