'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Flame, Trophy, Calendar, History } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * StreakDropdown
 * - Gamified streak system for NEET prep
 * - Shows current streak, XP reward progress, and quick actions
 */
export default function StreakDropdown() {
  const [streak, setStreak] = useState(14);
  const nextReward = 20; // Example: reward every 20-day streak
  const progress = Math.min((streak / nextReward) * 100, 100);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted transition-colors text-sm font-medium"
          title="View your streak"
        >
          <Flame className="text-orange-500 h-4 w-4 animate-pulse" />
          <span>{streak}d</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 overflow-hidden"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Your Streak</span>
          <span className="text-xs text-muted-foreground">
            Next goal: {nextReward}d
          </span>
        </DropdownMenuLabel>

        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="px-4 pb-3"
        >
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium">{streak} days</span>
            <span className="text-muted-foreground text-xs">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            Keep your streak alive to earn extra XP daily!
          </div>
        </motion.div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2 text-sm">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Claim daily reward
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-blue-500" />
          View streak calendar
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 text-sm">
          <History className="h-4 w-4 text-muted-foreground" />
          Streak history
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-xs text-muted-foreground">
          Tip: Consistency earns you bonus XP 🔥
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
