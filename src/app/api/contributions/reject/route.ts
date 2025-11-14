// src/app/api/contributions/reject/route.ts
import { NextResponse } from "next/server";
import { serverRejectOffline } from "@/lib/contributions.server";

export async function POST(req: Request) {
  try {
    const { transaction_id, reason } = await req.json();
    if (!transaction_id)
      return NextResponse.json(
        { success: false, error: "transaction_id required" },
        { status: 400 }
      );

    const res = await serverRejectOffline(
      Number(transaction_id),
      typeof reason === "string" ? reason : undefined
    );
    return NextResponse.json({ success: true, data: res });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message ?? String(err) },
      { status: 500 }
    );
  }
}
