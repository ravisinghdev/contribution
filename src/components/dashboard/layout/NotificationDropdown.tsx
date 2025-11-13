"use client";

import { useEffect, useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  AlertTriangle,
  MessageSquare,
  Eye,
  EyeOff,
  Trash2,
  Filter,
  CheckCircle2,
  Check,
  X,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { format, isToday, isYesterday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Announcement {
  id: number;
  title: string;
  content: string;
  is_urgent: boolean;
  created_at: string;
  profiles?: { full_name: string };
}

export default function AnnouncementDropdown() {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<"all" | "urgent" | "general">("all");
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState<number[]>([]);

  // --- Fetch announcements dynamically
  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // get one of user's farewells
      const { data: part } = await supabase
        .from("farewell_participants")
        .select("farewell_id")
        .eq("user_id", user.id)
        .single();

      if (!part) return;

      const { data } = await supabase
        .from("announcements")
        .select("id, title, content, is_urgent, created_at, profiles(full_name)")
        .eq("farewell_id", part.farewell_id)
        .order("created_at", { ascending: false })
        .limit(20);

      setAnnouncements(data || []);
      setLoading(false);
    };
    load();

    // --- Live updates
    const channel = supabase
      .channel("announcements")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "announcements" },
        (payload) => {
          setAnnouncements((prev) => [payload.new as Announcement, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // --- Filters
  const filtered = useMemo(() => {
    let list = announcements;
    if (filter === "urgent") list = list.filter((a) => a.is_urgent);
    else if (filter === "general") list = list.filter((a) => !a.is_urgent);
    return list;
  }, [filter, announcements]);

  const grouped = useMemo(() => {
    const today: Announcement[] = [];
    const yesterday: Announcement[] = [];
    const earlier: Announcement[] = [];
    filtered.forEach((a) => {
      const d = new Date(a.created_at);
      if (isToday(d)) today.push(a);
      else if (isYesterday(d)) yesterday.push(a);
      else earlier.push(a);
    });
    return { today, yesterday, earlier };
  }, [filtered]);

  const unread = announcements.filter((a) => !readIds.includes(a.id));
  const unreadCount = unread.length;

  // --- Local actions
  const toggleRead = (id: number) => {
    setReadIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const markAllRead = () => setReadIds(announcements.map((a) => a.id));
  const clearAll = () => setAnnouncements([]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-md hover:bg-zinc-800/50 transition">
          <Bell className="h-5 w-5 text-zinc-300" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-pink-500 rounded-full w-2 h-2 animate-ping" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[25rem] p-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-md shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <DropdownMenuLabel className="text-sm font-semibold text-white/80">
            Announcements
          </DropdownMenuLabel>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-white/20 text-white/80"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-36 bg-zinc-900/90 text-white/80"
              >
                <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("urgent")}>Urgent</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("general")}>General</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              disabled={!unreadCount}
              className="text-xs border-white/20 text-white/80 hover:bg-white/10"
            >
              <Check className="h-3 w-3 mr-1" /> Read All
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-xs border-white/20 text-white/80 hover:bg-white/10"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Clear
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 text-zinc-400" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[25rem] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8 text-zinc-500 text-sm">
              Loading announcements...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-zinc-400 text-sm">
              <CheckCircle2 className="h-6 w-6 mb-2 opacity-70" />
              No announcements
            </div>
          ) : (
            <>
              {["today", "yesterday", "earlier"].map((section) => {
                const list = (grouped as any)[section];
                if (!list.length) return null;
                return (
                  <div key={section}>
                    <div className="px-4 pt-2 text-xs uppercase text-zinc-500 font-medium">
                      {section}
                    </div>
                    <AnimatePresence>
                      {list.map((a) => (
                        <motion.div
                          key={a.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <AnnouncementItem
                            data={a}
                            read={readIds.includes(a.id)}
                            onToggleRead={toggleRead}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="text-center text-sm w-full py-3 hover:bg-white/10 font-medium text-white/80"
        >
          <a href="/dashboard/announcements">View all</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AnnouncementItem({
  data,
  read,
  onToggleRead,
}: {
  data: Announcement;
  read: boolean;
  onToggleRead: (id: number) => void;
}) {
  const Icon = data.is_urgent ? AlertTriangle : MessageSquare;

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 border-b border-white/10 transition-colors group",
        read ? "hover:bg-white/5" : "bg-white/5 hover:bg-white/10"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-full flex items-center justify-center",
          data.is_urgent ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 text-sm text-white/90">
        <div className="flex justify-between items-start">
          <span className="font-medium">{data.title}</span>
          <span className="text-[10px] text-zinc-500 ml-2 whitespace-nowrap">
            {format(new Date(data.created_at), "MMM d, h:mm a")}
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{data.content}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-white/10">
            <MoreHorizontal className="h-4 w-4 text-zinc-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36 bg-zinc-900/90">
          <DropdownMenuItem onClick={() => onToggleRead(data.id)}>
            {read ? (
              <>
                <Eye className="h-4 w-4 mr-2" /> Mark Unread
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 mr-2" /> Mark Read
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
