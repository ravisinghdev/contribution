"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Announcement, AnnouncementRead } from "@/types/announcements";
import { toast } from "react-hot-toast";

export function useAnnouncements(farewellId: number, userId: string) {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [reads, setReads] = useState<AnnouncementRead[]>([]);

  // Fetch initial data
  const fetchAnnouncements = async () => {
    const { data: annData, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("farewell_id", farewellId)
      .order("created_at", { ascending: false });

    const { data: readData } = await supabase
      .from("announcement_reads")
      .select("*")
      .eq("user_id", userId);

    if (error) return toast.error(error.message);

    setAnnouncements(annData || []);
    setReads(readData || []);
  };

  useEffect(() => {
    fetchAnnouncements();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel(`public:announcements:farewell_id=eq.${farewellId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [farewellId, userId, fetchAnnouncements, supabase]);

  const markAsRead = async (announcementId: number) => {
    const alreadyRead = reads.find((r) => r.announcement_id === announcementId);
    if (alreadyRead) return;

    const { error } = await supabase.from("announcement_reads").insert({
      announcement_id: announcementId,
      user_id: userId,
    });
    if (error) return toast.error(error.message);

    setReads([
      ...reads,
      {
        id: Date.now(),
        announcement_id: announcementId,
        user_id: userId,
        read_at: new Date().toISOString(),
      },
    ]);
  };

  return { announcements, reads, markAsRead, refetch: fetchAnnouncements };
}
