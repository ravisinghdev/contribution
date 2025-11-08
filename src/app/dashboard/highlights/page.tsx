"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Camera, Film, Gift, Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const [selected, setSelected] = useState<number | null>(null);

  const highlights = [
    {
      title: "Top Contributor 🏅",
      description: "Priya has sent the most farewell messages this week!",
      icon: Star,
      color: "from-yellow-400/30 to-orange-500/30",
    },
    {
      title: "Memory of the Week 📸",
      description: "Aarav shared a photo album full of unforgettable moments.",
      icon: Camera,
      color: "from-blue-400/30 to-cyan-500/30",
    },
    {
      title: "Tribute Video 🎞️",
      description: "A new tribute video has been uploaded by the juniors.",
      icon: Film,
      color: "from-purple-400/30 to-fuchsia-500/30",
    },
    {
      title: "Gift & Wishes Wall 🎁",
      description: "See all the heartfelt messages and gifts collected so far.",
      icon: Gift,
      color: "from-green-400/30 to-emerald-500/30",
    },
    {
      title: "Teacher’s Pick ❤️",
      description: "Mrs. Gupta highlighted some creative letters from students.",
      icon: Heart,
      color: "from-pink-400/30 to-rose-500/30",
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
              <Star className="h-6 w-6 text-yellow-400" />
              Highlights & Updates
            </h1>
            <p className="text-muted-foreground mt-1">
              Celebrate the most memorable moments and top contributors ✨
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Class of 2025 • Highlights
          </Badge>
        </div>
      </motion.div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {highlights.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Card
                onClick={() => setSelected(selected === index ? null : index)}
                className={`cursor-pointer backdrop-blur-md border border-border/40 bg-gradient-to-br ${item.color} hover:shadow-lg transition-all`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    {item.title}
                    <Icon className="h-5 w-5 text-foreground/70" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.p
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: selected === index ? 1 : 0.85 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm leading-relaxed"
                  >
                    {item.description}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 text-muted-foreground text-sm">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          🌸 Every highlight is a memory worth keeping forever.  
          <br />
          <span className="text-pink-500 font-medium">
            — Farewell Highlights, Class of 2025
          </span>
        </motion.p>
      </footer>
    </div>
  );
}
