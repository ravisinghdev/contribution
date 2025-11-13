"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center
      bg-background text-foreground"
    >
      <div
        className="bg-card p-8 rounded-xl shadow-md max-w-md w-full
        border border-border"
      >
        {/* Optional icon or illustration */}
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto w-16 h-16 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12l-4-4-4 4m0 0l4 4 4-4m-4-4v8"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-foreground">
          Verify Your Email
        </h1>

        <p className="mb-4 text-muted-foreground">
          Thank you for registering! A confirmation email has been sent to{" "}
          <span className="font-semibold text-foreground">{email}</span>.
        </p>

        <p className="mb-6 text-muted-foreground">
          Please check your inbox (and spam folder) and click the link to verify
          your email.
        </p>

        <Button onClick={() => router.push("/auth")} className="w-full">
          Back to Login
        </Button>
      </div>
    </div>
  );
}
