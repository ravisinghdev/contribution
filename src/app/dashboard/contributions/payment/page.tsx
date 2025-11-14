// src/app/dashboard/contributions/payment/page.tsx
import MakePaymentClientPage from "./MakePaymentClientPage";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

export default async function PaymentPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return <div className="text-red-500 p-4">User not authenticated</div>;
  }

  // fetch participants for the current farewell (example farewell_id = 1)
  const { data: participants, error: participantsError } = await supabase
    .from("farewell_participants")
    .select("user_id, role")
    .eq("farewell_id", 1);

  if (participantsError) {
    console.error(participantsError);
    return <div className="text-red-500 p-4">Error fetching participants</div>;
  }

  // fetch profiles for those participants
  const participantIds = (participants || []).map(
    (p: any) => p.user_id
  ) as string[];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", participantIds.length ? participantIds : [""]);

  const currentRole =
    (participants || []).find((p: any) => p.user_id === user.id)?.role ??
    "student";

  const currentUser = {
    id: user.id,
    name: (user.user_metadata as any)?.full_name ?? user.email ?? user.id,
    role: currentRole as "student" | "main_admin" | "parallel_admin",
  };

  const users =
    (profiles || []).map((u: any) => ({
      id: u.id,
      name: u.full_name ?? u.id,
      role: (participants || []).find((p: any) => p.user_id === u.id)?.role,
    })) || [];

  return <MakePaymentClientPage currentUser={currentUser} users={users} />;
}
