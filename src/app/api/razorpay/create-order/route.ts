// src/app/api/razorpay/create-order/route.ts
import { NextResponse } from "next/server";
import { serverCreateRazorpayOrder } from "@/lib/contributions.server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount =
      typeof body.amount === "number" ? body.amount : Number(body.amount);
    if (!amount || amount <= 0)
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    // amount is expected in paisa
    const order = await serverCreateRazorpayOrder({
      amountInPaisa: Math.round(amount),
      currency: typeof body.currency === "string" ? body.currency : "INR",
      receipt: typeof body.receipt === "string" ? body.receipt : undefined,
      notes: typeof body.notes === "object" ? body.notes : undefined,
    });

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? String(err) },
      { status: 500 }
    );
  }
}
