"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Crown,
  Medal,
  Search,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dummy data (to be replaced by Appwrite query)
const leaderboardData = [
  { id: 1, name: "Aarav Sharma", amount: 2500, contributions: 8 },
  { id: 2, name: "Riya Patel", amount: 1800, contributions: 5 },
  { id: 3, name: "Aditya Mehta", amount: 1500, contributions: 6 },
  { id: 4, name: "Neha Verma", amount: 1200, contributions: 4 },
  { id: 5, name: "Karan Singh", amount: 1000, contributions: 3 },
  { id: 6, name: "Ishita Rao", amount: 900, contributions: 3 },
  { id: 7, name: "Ananya Das", amount: 800, contributions: 2 },
  { id: 8, name: "Rahul Khanna", amount: 700, contributions: 2 },
  { id: 9, name: "Amit Raj", amount: 600, contributions: 2 },
  { id: 10, name: "Sneha Gupta", amount: 500, contributions: 1 },
];

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedData = useMemo(() => {
    return [...leaderboardData]
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount
      );
  }, [searchTerm, sortOrder]);

  const topThree = sortedData.slice(0, 3);

  const totalAmount = leaderboardData.reduce((sum, x) => sum + x.amount, 0);
  const totalContributors = leaderboardData.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/40 to-background text-foreground p-6 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Track and celebrate our top contributors 💖
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            setSortOrder(sortOrder === "desc" ? "asc" : "desc")
          }
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="w-4 h-4" /> Sort by Amount ({sortOrder})
        </Button>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-600">Total Donated</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalAmount} ₹</CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-indigo-600">Total Contributors</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalContributors}
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-emerald-600">Top Donor</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{topThree[0].name}</CardContent>
        </Card>
      </div>

      {/* Podium for Top 3 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative flex justify-center items-end gap-6 my-10"
      >
        {topThree.map((user, idx) => (
          <motion.div
            key={user.id}
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 + idx * 0.2 }}
            className={`flex flex-col items-center bg-card/70 backdrop-blur-md p-4 rounded-2xl border ${
              idx === 0
                ? "border-yellow-400 shadow-lg shadow-yellow-500/30 scale-110"
                : "border-border"
            }`}
          >
            {idx === 0 ? (
              <Crown className="text-yellow-400 w-8 h-8 mb-2" />
            ) : (
              <Medal className="text-muted-foreground w-6 h-6 mb-2" />
            )}
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="text-sm text-muted-foreground">
              ₹{user.amount} — {user.contributions} contributions
            </div>
            <Badge
              variant={idx === 0 ? "default" : "secondary"}
              className="mt-2"
            >
              #{idx + 1}
            </Badge>
          </motion.div>
        ))}
      </motion.div>

      {/* Search Bar */}
      <div className="flex justify-between items-center gap-3 flex-col sm:flex-row">
        <div className="flex items-center w-full sm:w-1/2 gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contributors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl overflow-hidden border border-border/40 backdrop-blur-md bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60">
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contributions</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Achievements</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((user, idx) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-accent/10 transition-all"
              >
                <TableCell>
                  <span
                    className={`font-bold ${
                      idx === 0
                        ? "text-yellow-500"
                        : idx === 1
                        ? "text-gray-400"
                        : idx === 2
                        ? "text-amber-700"
                        : "text-foreground"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.contributions}</TableCell>
                <TableCell>{user.amount} ₹</TableCell>
                <TableCell>
                  {user.amount > 2000 ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Top Donor
                    </Badge>
                  ) : user.contributions > 5 ? (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="w-3 h-3" /> Consistent
                    </Badge>
                  ) : (
                    <Badge variant="outline">Supporter</Badge>
                  )}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
