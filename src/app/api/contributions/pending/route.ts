// src/app/api/contributions/pending/route.ts
import { NextResponse } from "next/server";
import { serverListPendingOfflineTransactions } from "@/lib/contributions.server";

export async function GET() {
  try {
    const rows = await serverListPendingOfflineTransactions();
    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message ?? String(err) },
      { status: 403 }
    );
  }
}
