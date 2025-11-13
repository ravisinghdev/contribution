import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import type { Database } from "@/lib/database.types";

export type Farewell = Database["public"]["Tables"]["farewells"]["Row"];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {console.log("user not found")}

  return (
    <DashboardShell
      userProfile={{
        full_name: user?.user_metadata.full_name,
        avatar_url: user?.user_metadata.avatar_url,
      }}
      email={user?.email || ""}
      activeFarewell={null}
      activeRole={user?.role!}
      hasNoFarewells={false}
    >
      {children}
    </DashboardShell>
  );
}
