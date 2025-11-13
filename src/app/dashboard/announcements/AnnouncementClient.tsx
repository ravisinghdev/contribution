"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Loader2,
  Pin,
  Trash,
  Search,
  Edit2,
} from "lucide-react";
import { createAnnouncementAction } from "./actions";
import toast from "react-hot-toast";

type Announcement = {
  id: number;
  farewell_id: number;
  user_id: string;
  title: string;
  content: string;
  is_urgent: boolean;
  pinned: boolean;
  created_at: string;
};

export default function AnnouncementsClientPage() {
  const supabase = createClient();

  const [farewellId, setFarewellId] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [editTarget, setEditTarget] = useState<Announcement | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    isUrgent: false,
  });

  // Load active farewell from localStorage + user role
  useEffect(() => {
    const storedFarewellId = localStorage.getItem("active_farewell_id");
    if (storedFarewellId) {
      const id = Number(storedFarewellId);
      setFarewellId(id);

      (async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: participant } = await supabase
          .from("farewell_participants")
          .select("role")
          .eq("user_id", user.id)
          .eq("farewell_id", id)
          .single();

        setRole(participant?.role || null);
      })();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch announcements
  const fetchAnnouncements = async () => {
    if (!farewellId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("farewell_id", farewellId)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error && data) setAnnouncements(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [farewellId]);

  // Realtime updates
  useEffect(() => {
    if (!farewellId) return;

    const channel = supabase
      .channel(`farewell-${farewellId}-announcements`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements",
          filter: `farewell_id=eq.${farewellId}`,
        },
        (payload) => {
          const newData = payload.new as Announcement;
          const oldData = payload.old as Announcement;

          setAnnouncements((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [newData, ...prev].sort(
                  (a, b) => Number(b.pinned) - Number(a.pinned)
                );
              case "UPDATE":
                return prev
                  .map((a) => (a.id === newData.id ? newData : a))
                  .sort((a, b) => Number(b.pinned) - Number(a.pinned));
              case "DELETE":
                if (!oldData) return prev;
                return prev.filter((a) => a.id !== oldData.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [farewellId]);

  // Filter + search
  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchUrgent = filterUrgent ? a.is_urgent : true;
      return matchSearch && matchUrgent;
    });
  }, [announcements, searchTerm, filterUrgent]);

  // Create announcement
  async function handleCreate() {
    if (!newAnnouncement.title || !newAnnouncement.content || !farewellId)
      return;
    setIsCreating(true);
    try {
      await createAnnouncementAction(
        newAnnouncement.title,
        newAnnouncement.content,
        newAnnouncement.isUrgent,
        farewellId
      );
      toast.success("Announcement posted");
      setNewAnnouncement({ title: "", content: "", isUrgent: false });
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.message);
    }
    setIsCreating(false);
  }

  // Delete
  async function confirmDelete() {
    if (!deleteTarget) return;
    setActionLoading(true);
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", deleteTarget.id);
    setActionLoading(false);
    setDeleteTarget(null);
    if (error) toast.error("Failed to delete");
    else toast.success("Deleted successfully");
  }

  // Pin/unpin
  async function handlePin(id: number, pinned: boolean) {
    setActionLoading(true);
    const { error } = await supabase
      .from("announcements")
      .update({ pinned: !pinned })
      .eq("id", id);
    setActionLoading(false);
    if (error) toast.error("Failed to pin");
  }

  // Edit
  async function handleEdit() {
    if (!editTarget) return;
    setActionLoading(true);
    const { error } = await supabase
      .from("announcements")
      .update({
        title: editTarget.title,
        content: editTarget.content,
        is_urgent: editTarget.is_urgent,
      })
      .eq("id", editTarget.id);
    setActionLoading(false);
    setEditTarget(null);
    if (error) toast.error("Failed to edit");
    else toast.success("Edited successfully");
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gray-500 h-6 w-6" />
        <span className="ml-2 text-gray-500">Loading announcements...</span>
      </div>
    );

  if (!farewellId)
    return (
      <div className="text-center py-20 text-gray-500">
        No active farewell selected.
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-semibold">📢 Announcements</h1>

        {(role === "main_admin" ||
          role === "parallel_admin" ||
          role === "organizer") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create New</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Title"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement((p) => ({ ...p, title: e.target.value }))
                  }
                />
                <textarea
                  placeholder="Content"
                  className="w-full p-2 border rounded-md text-sm"
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement((p) => ({
                      ...p,
                      content: e.target.value,
                    }))
                  }
                />
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newAnnouncement.isUrgent}
                    onChange={(e) =>
                      setNewAnnouncement((p) => ({
                        ...p,
                        isUrgent: e.target.checked,
                      }))
                    }
                  />
                  <span>Mark as urgent</span>
                </label>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={isCreating}>
                  {isCreating && (
                    <Loader2 className="mr-2 animate-spin h-4 w-4" />
                  )}
                  Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant={filterUrgent ? "default" : "outline"}
          onClick={() => setFilterUrgent((p) => !p)}
        >
          Urgent Only
        </Button>
      </div>

      {/* Announcement List */}
      <AnimatePresence>
        {filtered.map((a) => (
          <motion.div
            key={a.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card
              className={`border ${
                a.is_urgent ? "border-red-400" : "border-gray-200"
              }`}
            >
              <CardHeader className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{a.title}</h2>
                  <p className="text-xs text-gray-400">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
                {(role === "main_admin" ||
                  role === "parallel_admin" ||
                  role === "organizer") && (
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={actionLoading}
                      onClick={() => handlePin(a.id, a.pinned)}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Pin
                          className={`h-4 w-4 ${
                            a.pinned ? "text-yellow-500" : "text-gray-400"
                          }`}
                        />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={actionLoading}
                      onClick={() => setEditTarget(a)}
                    >
                      <Edit2 className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={actionLoading}
                      onClick={() => setDeleteTarget(a)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>{a.content}</CardContent>
              {a.is_urgent && (
                <CardFooter className="text-red-500 text-sm flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" /> Urgent
                </CardFooter>
              )}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No announcements found.
        </p>
      )}

      {/* Delete Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Delete <strong>{deleteTarget?.title}</strong>?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={actionLoading}
            >
              {actionLoading && (
                <Loader2 className="mr-2 animate-spin h-4 w-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Title"
              value={editTarget?.title || ""}
              onChange={(e) =>
                setEditTarget((p) => (p ? { ...p, title: e.target.value } : p))
              }
            />
            <textarea
              placeholder="Content"
              className="w-full p-2 border rounded-md text-sm"
              value={editTarget?.content || ""}
              onChange={(e) =>
                setEditTarget((p) =>
                  p ? { ...p, content: e.target.value } : p
                )
              }
            />
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={editTarget?.is_urgent}
                onChange={(e) =>
                  setEditTarget((p) =>
                    p ? { ...p, is_urgent: e.target.checked } : p
                  )
                }
              />
              <span>Mark as urgent</span>
            </label>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditTarget(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={actionLoading}>
              {actionLoading && (
                <Loader2 className="mr-2 animate-spin h-4 w-4" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
