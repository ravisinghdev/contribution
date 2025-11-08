"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Star,
  PartyPopper,
  Camera,
  Mic,
  Gift,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FarewellTimelinePage() {
  const [selected, setSelected] = useState<number | null>(null);

  const events = [
    {
      time: "March 20",
      title: "Farewell Week Kickoff 🎉",
      description: "Start of Farewell Week — announcements and preparations begin!",
      icon: PartyPopper,
      color: "from-pink-500/40 to-purple-500/40",
    },
    {
      time: "March 22",
      title: "Memory Wall Uploads 📸",
      description:
        "Students begin uploading their favorite memories and photos.",
      icon: Camera,
      color: "from-blue-500/40 to-cyan-500/40",
    },
    {
      time: "March 25",
      title: "Letter Writing Drive 💌",
      description:
        "Write letters to your favorite teachers and classmates.",
      icon: Star,
      color: "from-amber-400/40 to-orange-500/40",
    },
    {
      time: "March 27",
      title: "Rehearsal & Setup 🪩",
      description:
        "Final stage rehearsals and decoration setup for the main event.",
      icon: Mic,
      color: "from-green-500/40 to-emerald-500/40",
    },
    {
      time: "March 28",
      title: "Main Farewell Event 🎓",
      description:
        "The grand celebration with performances, speeches, and memories.",
      icon: Gift,
      color: "from-purple-500/40 to-fuchsia-500/40",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/60 text-foreground px-6 py-10">
      {/* Header */}
      <motion.div
        className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-border shadow-md mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-pink-500" />
              Farewell Timeline
            </h1>
            <p className="text-muted-foreground mt-1">
              Keep track of every moment leading up to the big day ✨
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Class of 2025 • Timeline
          </Badge>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-5xl mx-auto">
        {/* Central line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-pink-400/50 to-purple-400/50 h-full rounded-full"></div>

        <div className="flex flex-col gap-16 mt-10 relative">
          {events.map((event, index) => {
            const Icon = event.icon;
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`relative flex flex-col md:flex-row ${
                  isLeft ? "md:justify-start" : "md:justify-end"
                }`}
              >
                {/* Connector Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-600 text-white shadow-lg border border-border">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`md:w-1/2 ${
                    isLeft
                      ? "md:pr-16 md:text-right"
                      : "md:pl-16 md:text-left"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Card
                      onClick={() =>
                        setSelected(selected === index ? null : index)
                      }
                      className={`bg-gradient-to-br ${event.color} border-border/40 backdrop-blur-md shadow-md hover:shadow-xl transition-all cursor-pointer ${
                        selected === index ? "scale-[1.02]" : ""
                      }`}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold flex justify-between items-center">
                          {event.title}
                          <span className="text-xs text-muted-foreground">
                            {event.time}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: selected === index ? 1 : 0.8,
                          }}
                          transition={{ duration: 0.3 }}
                          className="text-sm leading-relaxed"
                        >
                          {event.description}
                        </motion.p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-20 text-muted-foreground text-sm">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          🌸 Every day brings us closer to a memory worth cherishing forever.  
          <br />
          <span className="text-pink-500 font-medium">
            — Farewell Journey, Class of 2025
          </span>
        </motion.p>
      </footer>
    </div>
  );
}
