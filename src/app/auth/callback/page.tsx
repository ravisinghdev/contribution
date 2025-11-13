"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-hot-toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get current session from Supabase (OAuth or email redirect already stored)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        console.log(session)

        // if (error) {
        //   toast.error(error.message);
        //   router.push("/auth");
        //   return;
        // }

        // if (session) {
        //   toast.success("Authentication successful!");
        //   router.push("/dashboard");
        // } else {
        //   toast.error("No active session found.");
        //   router.push("/auth");
        // }
      } catch (err: unknown) {
        if (err instanceof Error) toast.error(err.message);
        // router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [router, supabase]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4
      bg-background text-foreground"
    >
      <div
        className="flex flex-col items-center justify-center p-8 rounded-xl
          shadow-md bg-card border border-border max-w-md w-full"
      >
        {loading && (
          <>
            <Spinner className="mb-4 text-primary" />
            <p className="text-muted-foreground">
              Completing authentication...
            </p>
          </>
        )}
        {!loading && <p className="text-muted-foreground">Redirecting...</p>}
      </div>
    </div>
  );
}
