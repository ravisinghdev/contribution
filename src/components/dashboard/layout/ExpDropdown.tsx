'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Gift,
  Heart,
  Star,
  Medal,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

/**
 * ContributionDropdown
 * 🎓 Gamified contribution tracker for the Farewell Project
 * Shows contribution level, XP progress, and achievement options
 */

export default function ContributionDropdown() {
  const [level, setLevel] = useState(5);
  const [xp, setXp] = useState(860);
  const xpForNext = 1000;

  const progress = Math.min((xp / xpForNext) * 100, 100);
  const xpLeft = xpForNext - xp;

  return (
    <DropdownMenu>
      {/* 🔘 Trigger Button */}
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-3 px-2 py-1 rounded hover:bg-muted transition-colors text-sm font-medium"
          title="View your contribution progress"
        >
          {/* Animated progress ring */}
          <div className="relative w-8 h-8">
            <svg className="absolute inset-0" viewBox="0 0 36 36">
              <path
                d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
                fill="none"
                stroke="#6d28d9" // purple accent
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.6 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
              {level}
            </div>
          </div>

          {/* XP info */}
          <div className="flex flex-col text-left">
            <span className="text-xs text-muted-foreground">Contribution Level</span>
            <span className="text-sm font-semibold">Lvl {level}</span>
          </div>
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown content */}
      <DropdownMenuContent align="end" className="w-80 overflow-hidden">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Your Contribution Progress</span>
          <span className="text-xs text-muted-foreground">
            Next Level: {xpForNext} pts
          </span>
        </DropdownMenuLabel>

        {/* XP Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="px-4 pb-3"
        >
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium">{xp} pts</span>
            <span className="text-muted-foreground text-xs">{xpLeft} pts left</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            Keep contributing memories and support to level up! 💜
          </div>
        </motion.div>

        <DropdownMenuSeparator />

        {/* Contribution Actions */}
        <DropdownMenuItem className="flex items-center gap-2 text-sm">
          <Heart className="h-4 w-4 text-pink-500" />
          Send heartfelt messages 💌
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 text-sm">
          <Gift className="h-4 w-4 text-amber-500" />
          Upload farewell photos or videos 🎥
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-blue-500" />
          Help organize or assist in the event 🤝
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 text-yellow-500" />
          Earn recognition for top contributions 🏆
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 text-sm">
          <Medal className="h-4 w-4 text-green-500" />
          Unlock Farewell Badges & Roles 🌟
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Fun Tip */}
        <DropdownMenuItem className="text-xs text-muted-foreground">
          Tip: Stay active daily to earn “Legacy Streak” rewards 🔥
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
