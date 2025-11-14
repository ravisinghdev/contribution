// src/app/api/contributions/offline-payment/route.ts
import { NextResponse } from "next/server";
import { serverAddTransaction } from "@/lib/contributions.server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user_id = String(body.user_id);
    const amount = body.amount;
    const notes = body.notes ?? null;

    if (!user_id || !amount)
      return NextResponse.json(
        { error: "Missing user_id or amount" },
        { status: 400 }
      );

    const res = await serverAddTransaction({
      user_id,
      amount,
      type: "offline",
      notes,
      logged_by_admin_id: body.logged_by_admin_id ?? null,
    });

    return NextResponse.json({ success: true, data: res });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? String(err) },
      { status: 500 }
    );
  }
}
