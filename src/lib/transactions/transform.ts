// src/lib/transactions/transform.ts
import type { Database } from "@/types/supabase";

type TxRow = Database["public"]["Tables"]["transactions"]["Row"];

export function txRowToView(row: TxRow) {
  return {
    id: row.id,
    user_id: row.user_id,
    user_name: (row as any).user_name ?? null,
    amount: String(row.amount),
    type: row.type,
    status: row.status,
    receipt_url: row.receipt_url,
    notes: row.notes,
    logged_by_admin_id: row.logged_by_admin_id,
    created_at: row.created_at,
  };
}
