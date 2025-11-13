import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClientPage } from "./DashboardClientPage";
import { cookies } from "next/headers";
import { UserRole } from "@/lib/permissions"; // Role type

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  // 1️⃣ Get the authenticated user
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data) {
    redirect("/auth");
  }

  // 2️⃣ Fetch all participations for the user
  const { data: participations } = await supabase
    .from("farewell_participants")
    .select("farewell_id, role")
    .eq("user_id", data.user.id);

  if (!participations || participations.length === 0) {
    redirect("/dashboard/welcome");
  }

  // 3️⃣ Determine current active farewell & role
  const activeFarewellIdFromCookie =
    cookieStore.get("active_farewell_id")?.value;
  const activeParticipation = activeFarewellIdFromCookie
    ? participations.find(
        (p) => p.farewell_id.toString() === activeFarewellIdFromCookie
      )
    : undefined;

  const currentParticipation = activeParticipation ?? participations[0];

  const currentFarewellId: number = currentParticipation.farewell_id;
  const currentRole: UserRole = currentParticipation.role as UserRole;

  // 4️⃣ Fetch all page data concurrently
  const [profileRes, postsRes, galleryRes, slamsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", data.user?.id)
      .single(),
    supabase
      .from("posts")
      .select("id", { count: "exact" })
      .eq("user_id", data.user?.id)
      .eq("farewell_id", currentFarewellId),
    supabase
      .from("gallery_uploads")
      .select("id", { count: "exact" })
      .eq("user_id", data.user?.id)
      .eq("farewell_id", currentFarewellId),
    supabase
      .from("slams")
      .select("id", { count: "exact" })
      .eq("from_user_id", data.user?.id)
      .eq("farewell_id", currentFarewellId),
  ]);

  //  Process contributions
  const contributions = {
    messages: postsRes.count ?? 0,
    photos: galleryRes.count ?? 0,
    letters: slamsRes.count ?? 0,
    xp:
      (postsRes.count ?? 0) * 10 +
      (galleryRes.count ?? 0) * 20 +
      (slamsRes.count ?? 0) * 15,
  };

  // 7️⃣ Pass all data to client component
  return (
    <DashboardClientPage
      fullName={data.user.user_metadata.full_name}
      role={currentRole}
      contributions={contributions}
      activeFarewellId={currentFarewellId}
    />
    // <div>Hello world</div>
  );
}
