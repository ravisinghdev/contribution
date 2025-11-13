"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Plus, Mail, Camera, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

import { RoleContextProvider } from "@/components/RoleContext";
import type { UserRole } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type ModalAction = "letter" | "message" | "memory" | "timeline" | null;

interface DashboardClientPageProps {
  fullName: string;
  role: UserRole;
  contributions: {
    messages: number;
    photos: number;
    letters: number;
    xp: number;
  };
  activeFarewellId: number;
}

export function DashboardClientPage({
  fullName,
  role,
  contributions,
  activeFarewellId,
}: DashboardClientPageProps) {
  const supabase = useMemo(() => createClient(), []);
  const [openModal, setOpenModal] = useState<ModalAction>(null);
  const [modalContent, setModalContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const quickActions = useMemo(
    () => [
      {
        label: "Write a Letter 💌",
        icon: Mail,
        action: "letter" as ModalAction,
      },
      {
        label: "Upload a Memory 📸",
        icon: Camera,
        action: "memory" as ModalAction,
      },
      {
        label: "Send a Message 💬",
        icon: Plus,
        action: "message" as ModalAction,
      },
      {
        label: "View Timeline 🪩",
        icon: Calendar,
        action: "timeline" as ModalAction,
      },
    ],
    []
  );

  const handleAction = (action: ModalAction) => setOpenModal(action);

  const handleSubmitModal = async () => {
    if (!openModal) return;
    setIsSubmitting(true);

    try {
      if (openModal === "letter" || openModal === "memory") {
        toast.error("This feature isn't implemented yet.");
        return;
      }

      if (openModal === "message") {
        const { error } = await supabase.from("posts").insert({
          content: modalContent,
          farewell_id: activeFarewellId,
        });
        if (error) throw error;
        toast.success("Message sent successfully!");
        setModalContent("");
        setOpenModal(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoleContextProvider role={role}>
      <div className="space-y-10 text-white">
        {/* Header */}
        <motion.div
          className="relative overflow-hidden rounded-2xl p-8 bg-black/20 border border-white/20 backdrop-blur-md shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, <span className="text-pink-400">{fullName}</span>{" "}
                👋
              </h1>
              <p className="text-white/80 mt-1">
                Your farewell world — full of messages, memories & gratitude.
              </p>
              <Badge
                variant="secondary"
                className="mt-3 capitalize bg-pink-500/20 text-pink-300 border-pink-500/30"
              >
                {role.replace("_", " ")}
              </Badge>
            </div>
            <Sparkles className="absolute top-5 right-5 opacity-20 text-pink-400 animate-spin-slow" />
          </div>

          {/* Quick Actions */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4">✨ Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((item) => (
                <motion.div
                  key={item.action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Card
                    onClick={() => handleAction(item.action)}
                    className="group cursor-pointer bg-black/20 hover:bg-black/40 backdrop-blur-lg border-white/20 text-center p-4 hover:shadow-lg transition-all"
                  >
                    <item.icon className="mx-auto w-6 h-6 mb-2 text-pink-400" />
                    <p className="font-medium group-hover:text-pink-400 transition-colors text-white/90">
                      {item.label}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Contributions */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              📊 Your Contributions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Messages", value: contributions.messages },
                { title: "Photos", value: contributions.photos },
                { title: "Letters", value: contributions.letters },
                { title: "XP", value: contributions.xp + " pts" },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Card className="bg-black/20 hover:bg-black/30 border-white/20 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle className="text-base text-white/70">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.p
                        key={item.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-3xl font-bold text-white"
                      >
                        {item.value}
                      </motion.p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Announcements */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4">📢 Announcements</h2>
            <Card className="bg-black/20 backdrop-blur-lg border-white/20">
              <CardContent className="space-y-3 text-sm mt-4 text-white/90">
                <p>🎤 Final Rehearsal — Friday 5PM</p>
                <p>🎞️ New Tribute Video Uploaded</p>
                <p>🎉 Awards Voting — Ends Tomorrow!</p>
              </CardContent>
            </Card>
          </section>

          {/* Role-Specific Section */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {role === "student"
                ? "🎓 Your Space"
                : role.includes("admin")
                ? "🛠️ Admin Panel"
                : "📚 Teacher’s Corner"}
            </h2>
            <Card className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 border-white/20">
              <CardContent className="mt-4 space-y-2 text-sm text-white/90">
                {role === "student" && (
                  <>
                    <p>💌 3 new farewell letters received!</p>
                    <p>📷 5 new photos in your album.</p>
                    <p>🪩 Tribute video uploaded!</p>
                  </>
                )}
                {(role === "main_admin" || role === "parallel_admin") && (
                  <>
                    <p>📋 2 pending event approvals.</p>
                    <p>💰 Budget tracker: 82% used.</p>
                    <p>🧍‍♂️ New volunteer request received.</p>
                  </>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <footer className="text-center pt-10 text-white/70 text-sm">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              “Every goodbye holds a promise — the memories we made stay
              forever.”
              <br />
              <span className="text-pink-400 font-medium">
                — Class of 2025 💫
              </span>
            </motion.p>
          </footer>
        </motion.div>

        {/* Modals */}
        <Dialog open={!!openModal} onOpenChange={() => setOpenModal(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {openModal === "letter"
                  ? "Write a Letter 💌"
                  : openModal === "memory"
                  ? "Upload a Memory 📸"
                  : openModal === "message"
                  ? "Send a Message 💬"
                  : "Timeline 🪩"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              {openModal === "letter" && (
                <Input placeholder="To (Name or @username)" />
              )}
              {(openModal === "letter" || openModal === "message") && (
                <Textarea
                  placeholder={
                    openModal === "letter"
                      ? "Write your heartfelt farewell letter..."
                      : "Write your short message for the memory wall..."
                  }
                  value={modalContent}
                  onChange={(e) => setModalContent(e.target.value)}
                />
              )}
              {openModal && openModal !== "timeline" && (
                <Button
                  className="w-full"
                  onClick={handleSubmitModal}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
              {openModal === "timeline" && (
                <p className="text-center text-muted-foreground">
                  🎉 Farewell Event — March 28
                  <br />
                  🏆 Voting ends in 2 days
                  <br />
                  🎬 Video Premiere — March 30
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </RoleContextProvider>
  );
}
