// src/lib/contributions.server.ts
import crypto from "crypto";
import type { Database } from "@/types/supabase";
import { createClient } from "@/lib/supabase/server"; // session-aware server client
import { createServiceClient } from "@/lib/supabase/service"; // service role client

type TxInsert = Database["public"]["Tables"]["transactions"]["Insert"];
type RazorpayOrdersInsert =
  Database["public"]["Tables"]["razorpay_orders"]["Insert"];
type RazorpayPaymentsInsert =
  Database["public"]["Tables"]["razorpay_payments"]["Insert"];
type TxRow = Database["public"]["Tables"]["transactions"]["Row"];

/**
 * Return a list of pending offline-type transactions
 * (method in ['offline','cash','upi','other'] and status = 'pending').
 * This endpoint must be called server-side by an authenticated admin.
 */
export async function serverListPendingOfflineTransactions(): Promise<
  Array<
    TxRow & {
      user_full_name?: string | null;
      logged_by_admin_name?: string | null;
    }
  >
> {
  const authUser = await getAuthenticatedUser();
  if (!(await isUserAdmin(authUser.id))) throw new Error("Not authorized");

  const supabase = await createClient();

  // Use explicit foreign key embed name to avoid embedding ambiguity
  // Relationship name in DB: tx_user_fkey (see your generated types)
  const { data, error } = await supabase
    .from("transactions")
    .select(
      `id, farewelL_id, user_id, amount, method, status, notes, created_at, payment_gateway_id, logged_by_admin_id, payment_gateway_id, updated_at, 
       profiles!tx_user_fkey(id, full_name), 
       profiles_logged_by_admin!tx_admin_fkey(id, full_name)`
    )
    .in("method", ["offline", "cash", "upi", "other"])
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(200);

  // NOTE: PostgREST relationship names can vary by project. If you see PGRST201,
  // change the embed to one of the choices reported by the error (e.g. profiles!transactions_user_id_fkey).
  if (error) throw error;

  const out = (data || []).map((row: any) => {
    return {
      ...row,
      user_full_name: row?.profiles?.full_name ?? null,
      logged_by_admin_name: row?.profiles_logged_by_admin?.full_name ?? null,
    } as TxRow & {
      user_full_name?: string | null;
      logged_by_admin_name?: string | null;
    };
  });

  return out;
}

/**
 * Reject offline payment (admin action).
 * Sets status = 'failed', logs audit entry, updates notifications.
 */
export async function serverRejectOffline(txId: number, reason?: string) {
  const authUser = await getAuthenticatedUser();
  if (!(await isUserAdmin(authUser.id))) throw new Error("Not authorized");

  const svc = createServiceClient();

  // Update status to failed
  const { error: updErr } = await svc
    .from("transactions")
    .update({ status: "failed", logged_by_admin_id: authUser.id })
    .eq("id", txId);

  if (updErr) throw updErr;

  // Insert audit log
  const { error: logErr } = await svc.from("transaction_audit_logs").insert([
    {
      transaction_id: txId,
      action: "rejected_offline",
      performed_by: authUser.id,
      metadata: { reason: reason ?? null },
    },
  ]);

  if (logErr) throw logErr;

  // Mark related notification as read (if exists)
  await svc
    .from("notifications")
    .update({ read: true })
    .eq("payload->>transaction_id", String(txId));

  return { success: true };
}

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Not authenticated");
  return data.user;
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const client = await createClient();
  const { data, error } = await client
    .from("farewell_participants")
    .select("role")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (
    !!data && (data.role === "main_admin" || data.role === "parallel_admin")
  );
}

/**
 * Upload receipt to Supabase Storage (service client).
 */
export async function serverUploadReceipt(opts: {
  buffer: Buffer;
  filename: string;
  contentType?: string | null;
}): Promise<string> {
  const svc = createServiceClient();
  const bucket = "receipts";
  const key = `receipts/${opts.filename}`;

  const { error } = await svc.storage.from(bucket).upload(key, opts.buffer, {
    contentType: opts.contentType ?? undefined,
    upsert: false,
  });
  if (error) throw error;

  const { data } = svc.storage.from(bucket).getPublicUrl(key);
  return data.publicUrl ?? "";
}

/**
 * Create a Razorpay order and persist a copy in `razorpay_orders`.
 * amountInPaisa must be a number (integer).
 */
export async function serverCreateRazorpayOrder(opts: {
  amountInPaisa: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, unknown>;
}) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret)
    throw new Error("Razorpay credentials not configured");

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const resp = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: opts.amountInPaisa,
      currency: opts.currency ?? "INR",
      receipt: opts.receipt ?? `rcpt_${Date.now()}`,
      payment_capture: 1,
      notes: opts.notes ?? {},
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Razorpay order create failed: ${txt}`);
  }

  const order = await resp.json();

  // Persist a copy to razorpay_orders using service client (bypass RLS)
  try {
    const svc = createServiceClient();
    const insert: RazorpayOrdersInsert = {
      id: String(order.id),
      amount: Number(order.amount),
      currency: String(order.currency),
      receipt: order.receipt ?? null,
      status: order.status ?? null,
      metadata: (order.notes ?? null) as any,
    };
    await svc.from("razorpay_orders").upsert(insert, { onConflict: "id" });
  } catch {
    // non-fatal
  }

  return {
    id: String(order.id),
    amount: Number(order.amount),
    currency: String(order.currency),
    key_id: keyId,
  } as const;
}

/**
 * Insert a transaction server-side.
 * - Ensure farewell_id is derived from the target user via farewell_participants.
 * - amount must be a number (rupees).
 *
 * If logged_by_admin_id is set, the caller must be that admin (enforced by getAuthenticatedUser + isUserAdmin).
 */
export async function serverAddTransaction(payload: {
  user_id: string;
  amount: number;
  method?: Database["public"]["Enums"]["transaction_method"];
  notes?: string | null;
  receipt_url?: string | null;
  logged_by_admin_id?: string | null;
}) {
  const authUser = await getAuthenticatedUser();
  const client = await createClient();
  const svc = createServiceClient();
  const callerIsAdmin = await isUserAdmin(authUser.id);

  if (
    payload.logged_by_admin_id &&
    payload.logged_by_admin_id !== authUser.id
  ) {
    throw new Error("logged_by_admin_id must match authenticated user");
  }
  if (payload.logged_by_admin_id && !callerIsAdmin) {
    throw new Error("Unauthorized: admin required to log as admin");
  }

  // find farewell_id for the target user
  const { data: fp, error: fpErr } = await client
    .from("farewell_participants")
    .select("farewell_id")
    .eq("user_id", payload.user_id)
    .limit(1)
    .maybeSingle();
  if (fpErr) throw fpErr;
  if (!fp) throw new Error("Target user is not part of any farewell");

  const farewell_id: number = fp.farewell_id;

  // Build TxInsert following the generated types (amount: number)
  const insert: TxInsert = {
    user_id: payload.user_id,
    farewell_id,
    amount: payload.amount,
    type: "contribution",
    method:
      payload.method ?? (payload.logged_by_admin_id ? "offline" : "offline"),
    status:
      payload.logged_by_admin_id ||
      payload.method === "cash" ||
      payload.method === "upi"
        ? "completed"
        : payload.method === "offline"
        ? "pending"
        : "pending",
    notes: payload.notes ?? null,
    receipt_url: payload.receipt_url ?? null,
    logged_by_admin_id: payload.logged_by_admin_id ?? null,
    currency: "INR",
  };

  const { error } = await svc.from("transactions").insert([insert]);
  if (error) throw error;
  return { success: true };
}

/**
 * Approve offline transaction using DB rpc (admin).
 * The DB function `approve_offline_payment(p_tx_id bigint, p_admin uuid)` returns Json.
 */
export async function serverApproveOffline(txId: number) {
  const authUser = await getAuthenticatedUser();
  const svc = createServiceClient();
  const admin = authUser.id;

  // call RPC; types generated should match, but cast to any to be safe with Supabase client typing
  const { data, error } = await svc.rpc("approve_offline_payment", {
    p_tx_id: txId,
    p_admin: admin,
  } as unknown as Record<string, unknown>);

  if (error) throw error;
  return data;
}

/**
 * Verify Razorpay signature and persist payment.
 * - Fetches payment details
 * - Persists razorpay_payments
 * - Finds effective user and farewell_id
 * - Inserts a transactions row (method=online, status=completed)
 */
export async function serverVerifyAndPersistRazorpay(opts: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  selected_user_id?: string | null;
  metadata?: { amount?: number; notes?: string | null } | null;
}) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keySecret || !keyId)
    throw new Error("Razorpay credentials not configured");

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = opts;

  // 1. verify signature
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (expected !== razorpay_signature)
    throw new Error("Invalid Razorpay signature");

  // 2. fetch order (server-side double-check)
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const orderResp = await fetch(
    `https://api.razorpay.com/v1/orders/${razorpay_order_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!orderResp.ok) {
    const txt = await orderResp.text();
    throw new Error(`Failed to fetch Razorpay order: ${txt}`);
  }
  const orderJson = await orderResp.json();
  const amountPaisa = Number(orderJson.amount ?? 0);
  if (!amountPaisa || amountPaisa <= 0)
    throw new Error("Invalid Razorpay order amount");

  // 3. fetch payment details
  const payResp = await fetch(
    `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!payResp.ok) {
    const txt = await payResp.text();
    throw new Error(`Failed to fetch Razorpay payment: ${txt}`);
  }
  const payJson = await payResp.json();

  // 4. persist payment into razorpay_payments
  try {
    const svc = createServiceClient();
    const rpi: RazorpayPaymentsInsert = {
      id: razorpay_payment_id,
      order_id: razorpay_order_id,
      amount: Number(payJson.amount ?? amountPaisa),
      currency: payJson.currency ?? orderJson.currency ?? "INR",
      method: payJson.method ?? null,
      status: payJson.status ?? null,
      bank: payJson.bank ?? null,
      vpa: payJson.vpa ?? null,
      captured: payJson.captured ?? null,
      raw: (payJson as any) ?? null,
    };
    await svc.from("razorpay_payments").upsert(rpi, { onConflict: "id" });
  } catch {
    // non-fatal
  }

  // 5. determine effective user: if selected_user_id provided and caller is admin, allow; otherwise authenticated user
  const authUser = await getAuthenticatedUser();
  const callerIsAdmin = await isUserAdmin(authUser.id);
  let effectiveUser = authUser.id;
  if (opts.selected_user_id && opts.selected_user_id !== authUser.id) {
    if (!callerIsAdmin)
      throw new Error("Not authorized to create transaction for another user");
    effectiveUser = opts.selected_user_id;
  }

  // 6. fetch farewell_id for effectiveUser
  const client = await createClient();
  const { data: fp, error: fpErr } = await client
    .from("farewell_participants")
    .select("farewell_id")
    .eq("user_id", effectiveUser)
    .limit(1)
    .maybeSingle();
  if (fpErr) throw fpErr;
  if (!fp) throw new Error("User not associated with any farewell");
  const farewell_id = fp.farewell_id;

  // 7. prepare and insert transaction (service client)
  const svc = createServiceClient();

  const txInsert: TxInsert = {
    user_id: effectiveUser,
    farewell_id,
    amount: Number(payJson.amount ?? amountPaisa) / 100, // convert paisa->rupees
    currency: payJson.currency ?? orderJson.currency ?? "INR",
    type: "contribution",
    method: "online",
    status: "completed",
    notes: opts.metadata?.notes ?? null,
    payment_gateway_id: razorpay_payment_id,
    logged_by_admin_id:
      callerIsAdmin &&
      opts.selected_user_id &&
      opts.selected_user_id !== authUser.id
        ? authUser.id
        : null,
    metadata: (opts.metadata ?? null) as any,
  };

  const { error: insertError } = await svc
    .from("transactions")
    .insert([txInsert]);
  if (insertError) throw insertError;

  return { success: true, saved: txInsert };
}
