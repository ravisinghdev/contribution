"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { format, isAfter, parseISO } from "date-fns";
import {
  Plus,
  Search,
  Filter,
  Clock,
  Pin,
  Trash2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button"; // adjust imports if necessary
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Role = "student" | "junior" | "teacher" | "organizer" | "admin";
type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string; // ISO
  pinned?: boolean;
  author?: string;
};

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "Final Farewell Rehearsal — Friday 5PM",
    body: "All performers, please arrive at 4:00 PM. Soundcheck at 4:15 PM.",
    date: "2025-11-14T17:00:00.000Z",
    pinned: true,
    author: "Organizing Committee",
  },
  {
    id: "a2",
    title: "New Tribute Video Uploaded 🎞️",
    body: "The tribute video has been uploaded. Watch it in Media > Tribute.",
    date: "2025-11-06T09:00:00.000Z",
    pinned: false,
    author: "Media Team",
  },
  {
    id: "a3",
    title: "Dress Code Reminder — Pastel Theme",
    body: "Reminder: Farewell dress code is pastel colors for the group photos.",
    date: "2025-11-18T08:00:00.000Z",
    pinned: false,
    author: "Organizers",
  },
];


const fakeFetchAnnouncements = (delay = 800) =>
  new Promise<Announcement[]>((res) => {
    setTimeout(
      () =>
        res(
          [...MOCK_ANNOUNCEMENTS].sort(
            (a, b) => +new Date(b.date) - +new Date(a.date)
          )
        ),
      delay
    );
  });

const fakeCreateAnnouncement = (ann: Announcement, delay = 600) =>
  new Promise<Announcement>((res) => {
    setTimeout(() => res(ann), delay);
  });

const fakeDeleteAnnouncement = (id: string, delay = 400) =>
  new Promise<string>((res) => {
    setTimeout(() => res(id), delay);
  });

export default function AnnouncementsPage() {
  const auth = { user: { name: "Riya Sharma", role: "student" as Role } };
  const role = auth?.user?.role ?? ("student" as Role);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "pinned">("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newDate, setNewDate] = useState<string>("");

  // optimistic deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fakeFetchAnnouncements().then((data) => {
      if (!mounted) return;
      setAnnouncements(data);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // derived filtered + searched announcements
  const filtered = useMemo(() => {
    let list = [...announcements];

    if (filter === "pinned") list = list.filter((a) => a.pinned);
    if (filter === "upcoming")
      list = list.filter((a) => isAfter(parseISO(a.date), new Date()));

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.body.toLowerCase().includes(q) ||
          (a.author ?? "").toLowerCase().includes(q)
      );
    }

    // sort pinned first, then newest
    list.sort((a, b) => {
      if ((a.pinned ? 1 : 0) !== (b.pinned ? 1 : 0))
        return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      return +new Date(b.date) - +new Date(a.date);
    });

    return list;
  }, [announcements, filter, query]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // handlers
  const handleCreate = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setCreating(true);

    const newAnn: Announcement = {
      id: `a_${Date.now()}`,
      title: newTitle,
      body: newBody,
      date: newDate
        ? new Date(newDate).toISOString()
        : new Date().toISOString(),
      pinned: false,
      author: auth.user.name ?? "Unknown",
    };

    // optimistic update
    setAnnouncements((s) => [newAnn, ...s]);
    setCreateOpen(false);
    setNewTitle("");
    setNewBody("");
    setNewDate("");

    try {
      await fakeCreateAnnouncement(newAnn);
      // success — already added optimistically
    } catch (err) {
      // rollback on error
      setAnnouncements((s) => s.filter((a) => a.id !== newAnn.id));
      console.error("Create failed", err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    setDeletingId(id);
    // optimistic remove
    const prev = announcements;
    setAnnouncements((s) => s.filter((a) => a.id !== id));
    try {
      await fakeDeleteAnnouncement(id);
    } catch (err) {
      // rollback
      setAnnouncements(prev);
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  const togglePin = (id: string) => {
    setAnnouncements((s) =>
      s.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
  };

  // UX: reset page when filters/search changes
  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  // small motion presets
  const cardMotion = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
  };

  return (
    <main className="min-h-screen sm:p-6 p-0">
      <div
        className={cn(
          "min-h-[70vh] p-6 rounded-2xl shadow-lg",
          "bg-[image:var(--farewell-bg)] bg-cover bg-center", 
          "backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                Announcements
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Stay updated — important notices and event information will
                appear here.
              </p>
            </div>

            <div className="flex items-center w-[100%] gap-3 flex-col sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search announcements, authors..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 items-center">
                <Button
                  variant={filter === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "upcoming" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("upcoming")}
                >
                  <Clock className="mr-2 h-4 w-4" /> Upcoming
                </Button>
                <Button
                  variant={filter === "pinned" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter("pinned")}
                >
                  <Pin className="mr-2 h-4 w-4" /> Pinned
                </Button>
              </div>

              {/* Create (only for organizer/admin/teacher) */}
              {["organizer", "admin", "teacher"].includes(role) && (
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus /> New
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create Announcement</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                      <Input
                        placeholder="Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <Input
                        type="datetime-local"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                      />
                      <textarea
                        rows={5}
                        placeholder="Write announcement..."
                        className="w-full rounded-md p-2 border border-border bg-background text-foreground"
                        value={newBody}
                        onChange={(e) => setNewBody(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => setCreateOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={creating}>
                          {creating ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            "Create"
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Announcements list */}
            <section className="lg:col-span-2 space-y-4">
              {/* Loading state */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                </div>
              ) : filtered.length === 0 ? (
                <Card>
                  <CardContent>
                    <div className="py-8 text-center text-muted-foreground">
                      No announcements match your filters.
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {paged.map((a) => (
                    <motion.article
                      key={a.id}
                      {...cardMotion}
                      className="relative"
                    >
                      <Card className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                  {a.title}
                                  {a.pinned && (
                                    <Badge variant="secondary">Pinned</Badge>
                                  )}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {a.author} •{" "}
                                  {format(parseISO(a.date), "PPpp")}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* pin toggle — role-limited */}
                                {["organizer", "admin"].includes(role) && (
                                  <IconButton
                                    title={a.pinned ? "Unpin" : "Pin"}
                                    onClick={() => togglePin(a.id)}
                                  >
                                    <Pin className="h-4 w-4" />
                                  </IconButton>
                                )}

                                {/* delete — admin only */}
                                {role === "admin" && (
                                  <IconButton
                                    title="Delete"
                                    onClick={() => handleDelete(a.id)}
                                    disabled={deletingId === a.id}
                                  >
                                    {deletingId === a.id ? (
                                      <Loader2 className="animate-spin h-4 w-4" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </IconButton>
                                )}
                              </div>
                            </div>

                            <p className="mt-3 text-sm leading-relaxed">
                              {a.body}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.article>
                  ))}

                  {/* Pagination / Load more */}
                  <div className="flex justify-center mt-2">
                    {page * PAGE_SIZE < filtered.length ? (
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Load more
                      </Button>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        No more announcements
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Right: Sidebar widgets */}
            <aside className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <button
                      className={cn(
                        "text-left p-2 rounded-md",
                        filter === "all"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                      onClick={() => setFilter("all")}
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>All Announcements</span>
                      </div>
                    </button>

                    <button
                      className={cn(
                        "text-left p-2 rounded-md",
                        filter === "pinned"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                      onClick={() => setFilter("pinned")}
                    >
                      <div className="flex items-center gap-2">
                        <Pin className="h-4 w-4" />
                        <span>Pinned</span>
                      </div>
                    </button>

                    <button
                      className={cn(
                        "text-left p-2 rounded-md",
                        filter === "upcoming"
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                      onClick={() => setFilter("upcoming")}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Upcoming</span>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pinned Notice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The pinned announcements stay at the top. Organizers &
                    Admins can pin/unpin items. Use this space to promote the
                    most important updates.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    If something looks off or you need assistance, open a
                    support ticket from the sidebar → Community → Support Team.
                  </p>
                  <div className="mt-3">
                    <Button asChild>
                      <a href="/dashboard/support">Contact Support</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

// -----------------------------
// Small UI helpers (simple fallbacks — replace with your project's components)
// -----------------------------
function IconButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground",
        props.className || ""
      )}
    >
      {children}
    </button>
  );
}
