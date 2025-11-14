// src/app/api/contributions/upload-receipt/route.ts
import { NextResponse } from "next/server";
import { serverUploadReceipt } from "@/lib/contributions.server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const form = await (req as any).formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `receipt-${Date.now()}-${(file as any).name ?? "upload"}`;

    const publicUrl = await serverUploadReceipt({
      buffer,
      filename,
      contentType: (file as any).type ?? undefined,
    });

    return NextResponse.json({ publicUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
