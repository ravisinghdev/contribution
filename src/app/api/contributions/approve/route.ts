// src/app/api/contributions/approve/route.ts
import { NextResponse } from "next/server";
import { serverApproveOffline } from "@/lib/contributions.server";

export async function POST(req: Request) {
  try {
    const { transaction_id } = await req.json();
    if (!transaction_id)
      return NextResponse.json(
        { success: false, error: "transaction_id required" },
        { status: 400 }
      );

    const res = await serverApproveOffline(Number(transaction_id));
    return NextResponse.json({ success: true, data: res });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message ?? String(err) },
      { status: 500 }
    );
  }
}
