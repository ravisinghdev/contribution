// src/app/api/razorpay/verify-and-capture/route.ts
import { NextResponse } from "next/server";
import { serverVerifyAndPersistRazorpay } from "@/lib/contributions.server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const razorpay_order_id =
      typeof body.razorpay_order_id === "string"
        ? body.razorpay_order_id
        : null;
    const razorpay_payment_id =
      typeof body.razorpay_payment_id === "string"
        ? body.razorpay_payment_id
        : null;
    const razorpay_signature =
      typeof body.razorpay_signature === "string"
        ? body.razorpay_signature
        : null;
    const selected_user =
      typeof body.selected_user === "string" ? body.selected_user : null;
    const metadata = typeof body.metadata === "object" ? body.metadata : null;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required Razorpay fields" },
        { status: 400 }
      );
    }

    const res = await serverVerifyAndPersistRazorpay({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      selected_user_id: selected_user,
      metadata,
    });

    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message ?? String(err) },
      { status: 500 }
    );
  }
}
