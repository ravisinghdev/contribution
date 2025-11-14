// src/app/api/contributions/add/route.ts
import { NextResponse } from "next/server";
import { serverAddTransaction } from "@/lib/contributions.server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user_id = typeof body.user_id === "string" ? body.user_id : null;
    const amount = body.amount;
    const type = typeof body.type === "string" ? body.type : undefined;
    const notes = typeof body.notes === "string" ? body.notes : null;
    const receipt_url =
      typeof body.receipt_url === "string" ? body.receipt_url : null;
    const logged_by_admin_id =
      typeof body.logged_by_admin_id === "string"
        ? body.logged_by_admin_id
        : null;

    if (
      !user_id ||
      (typeof amount !== "number" && typeof amount !== "string")
    ) {
      return NextResponse.json(
        { error: "Invalid payload: user_id & amount required" },
        { status: 400 }
      );
    }

    await serverAddTransaction({
      user_id,
      amount,
      type,
      notes,
      receipt_url,
      logged_by_admin_id,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
