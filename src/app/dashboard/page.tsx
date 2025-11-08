"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Sparkles,
  Loader2,
  Plus,
  Mail,
  Camera,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("student"); // dynamically fetched later
  const [contributions, setContributions] = useState({
    messages: 0,
    photos: 0,
    letters: 0,
    xp: 0,
  });

  useEffect(() => {
    // simulate fetch
    setTimeout(() => {
      setContributions({
        messages: 8,
        photos: 16,
        letters: 5,
        xp: 240,
      });
      setLoading(false);
    }, 1200);
  }, []);

  const quickActions = [
    {
      label: "Write a Letter 💌",
      icon: Mail,
      action: "letter",
    },
    {
      label: "Upload a Memory 📸",
      icon: Camera,
      action: "memory",
    },
    {
      label: "Send a Message 💬",
      icon: Plus,
      action: "message",
    },
    {
      label: "View Timeline 🪩",
      icon: Calendar,
      action: "timeline",
    },
  ];

  // modal state
  const [openModal, setOpenModal] = useState<string | null>(null);

  const handleAction = (type: string) => {
    setOpenModal(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/60 text-foreground p-6 space-y-10">
      {/* Header */}
      <motion.div
        className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-border shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, <span className="text-pink-500">John Doe</span> 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here’s your farewell world — full of messages, laughter & gratitude.
            </p>
            <Badge variant="secondary" className="mt-3">
              {role === "student"
                ? "Class 12 • Senior"
                : role === "teacher"
                ? "Mentor"
                : "Organizer"}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full backdrop-blur-md"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-400" />
            )}
          </Button>
        </div>
        <Sparkles className="absolute top-5 right-5 opacity-20 text-pink-400 animate-spin-slow" />
      </motion.div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">✨ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Card
                onClick={() => handleAction(item.action)}
                className="group cursor-pointer bg-card/60 hover:bg-accent/20 backdrop-blur-lg border-border/40 text-center p-4 hover:shadow-md transition-all"
              >
                <item.icon className="mx-auto w-6 h-6 mb-2 text-pink-500" />
                <p className="font-medium group-hover:text-pink-500 transition-colors">
                  {item.label}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contribution Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📊 Your Contributions</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Messages", value: contributions.messages },
              { title: "Photos", value: contributions.photos },
              { title: "Letters", value: contributions.letters },
              { title: "XP", value: contributions.xp + " pts" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="bg-gradient-to-br from-pink-500/5 to-purple-600/10 hover:from-pink-500/10 hover:to-purple-500/20 border-border/40">
                  <CardHeader>
                    <CardTitle className="text-base text-muted-foreground">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.p
                      key={item.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-3xl font-bold"
                    >
                      {item.value}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Announcements */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📢 Announcements</h2>
        <Card className="bg-card/70 backdrop-blur-lg border-border/40">
          <CardContent className="space-y-3 text-sm mt-4">
            <p>🎤 Final Rehearsal — Friday 5PM</p>
            <p>🎞️ New Tribute Video Uploaded</p>
            <p>🎉 Awards Voting — Ends Tomorrow!</p>
          </CardContent>
        </Card>
      </section>

      {/* Role-Specific Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          {role === "student"
            ? "🎓 Your Space"
            : role === "organizer"
            ? "🛠️ Organizer Panel"
            : "📚 Teacher’s Corner"}
        </h2>

        {role === "student" && (
          <Card className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 backdrop-blur-md border-border/40">
            <CardContent className="mt-4 space-y-2 text-sm">
              <p>💌 3 new farewell letters received!</p>
              <p>📷 5 new photos in your album.</p>
              <p>🪩 Tribute video uploaded!</p>
            </CardContent>
          </Card>
        )}

        {role === "organizer" && (
          <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10">
            <CardContent className="mt-4 space-y-2 text-sm">
              <p>📋 2 pending event approvals.</p>
              <p>💰 Budget tracker: 82% used.</p>
              <p>🧍‍♂️ New volunteer request received.</p>
            </CardContent>
          </Card>
        )}

        {role === "teacher" && (
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10">
            <CardContent className="mt-4 space-y-2 text-sm">
              <p>📝 Write farewell notes for students.</p>
              <p>💬 Review 4 pending submissions.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center pt-10 text-muted-foreground text-sm">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          “Every goodbye holds a promise — the memories we made stay forever.”  
          <br />
          <span className="text-pink-500 font-medium">— Class of 2025 💫</span>
        </motion.p>
      </footer>

      {/* Dynamic Modals */}
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
              <>
                <Input placeholder="To (Name)" />
                <Textarea placeholder="Write your heartfelt farewell letter..." />
                <Button className="w-full">Send Letter</Button>
              </>
            )}

            {openModal === "memory" && (
              <>
                <Input type="file" />
                <Textarea placeholder="Write a short caption..." />
                <Button className="w-full">Upload Memory</Button>
              </>
            )}

            {openModal === "message" && (
              <>
                <Textarea placeholder="Write your short message..." />
                <Button className="w-full">Send Message</Button>
              </>
            )}

            {openModal === "timeline" && (
              <p className="text-center text-muted-foreground">
                🎉 Farewell Event — March 28  
                <br />🏆 Voting ends in 2 days  
                <br />🎬 Video Premiere — March 30
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
