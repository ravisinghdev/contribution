import { AuthForm } from "@/components/auth/AuthForm";
import { supabase } from "@/lib/supabase/supabaseClient"; // Our *server* client!
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <AuthForm />
    </div>
  );
}
