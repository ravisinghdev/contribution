import MakePaymentClientPage from "./MakePaymentClientPage";
import { createClient } from "@/lib/supabase/server";

export default async function PaymentPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return <div className="text-red-500 p-4">User not authenticated</div>;
  }

  const { data: participants, error: participantsError } = await supabase
    .from("farewell_participants")
    .select("id, user_id, role, joined_at")
    .eq("farewell_id", 1);

  if (participantsError) return <div>Error fetching participants</div>;

  const currentParticipant = participants?.find((p) => p.user_id === user.id);
  const currentRole = currentParticipant?.role || "student";

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", participants?.map((p) => p.user_id) || []);

  const currentUser = {
    id: user.id,
    name: user.user_metadata?.full_name || user.email,
    role: currentRole as "student" | "main_admin" | "parallel_admin",
  };

  const users =
    profiles?.map((u) => {
      const participantRole = participants?.find(
        (p) => p.user_id === u.id
      )?.role;
      return {
        id: u.id,
        name: u.full_name || u.id,
        role: participantRole as "student" | "main_admin" | "parallel_admin",
      };
    }) || [];

  // ✅ Do NOT pass the server-side supabase client
  return <MakePaymentClientPage currentUser={currentUser} users={users} />;
}
