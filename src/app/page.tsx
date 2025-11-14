"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } 
  from "@/components/ui/dropdown-menu";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Search, Filter, Calendar, ChevronDown, IndianRupee } from "lucide-react";

// Dummy data (replace later with Supabase)
const chartData = [
  { date: "Mon", amount: 4500 },
  { date: "Tue", amount: 7000 },
  { date: "Wed", amount: 3200 },
  { date: "Thu", amount: 8200 },
  { date: "Fri", amount: 6000 },
  { date: "Sat", amount: 9000 },
  { date: "Sun", amount: 7500 },
];

const recentTransactions = [
  {
    id: 1,
    user: "Aarav Sharma",
    amount: 500,
    method: "UPI",
    status: "success",
    date: "Nov 13, 9:12 AM",
  },
  {
    id: 2,
    user: "Bro",
    amount: 1000,
    method: "Cash",
    status: "pending",
    date: "Nov 13, 8:40 AM",
  },
  {
    id: 3,
    user: "Priya Singh",
    amount: 1500,
    method: "Razorpay",
    status: "success",
    date: "Nov 12, 6:15 PM",
  },
];

export default function ContributionDashboard() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8 relative z-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Contributions Overview</h1>

        <div className="flex gap-3">
          <Button className="rounded-xl">Add Contribution</Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Today</DropdownMenuItem>
              <DropdownMenuItem>This Week</DropdownMenuItem>
              <DropdownMenuItem>This Month</DropdownMenuItem>
              <DropdownMenuItem>This Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-md futuristic-bg">
          <CardHeader>
            <CardTitle>Total Contributions</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold flex items-center gap-2">
            <IndianRupee className="w-6 h-6" /> 78,900
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md futuristic-bg">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">12</CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md futuristic-bg">
          <CardHeader>
            <CardTitle>Unique Contributors</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">48</CardContent>
        </Card>
      </div>

      {/* CHART SECTION */}
      <Card className="rounded-2xl shadow-xl futuristic-bg">
        <CardHeader>
          <CardTitle className="text-xl">Weekly Contribution Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorContribution" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopOpacity={0.7} />
                    <stop offset="95%" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  strokeWidth={3}
                  fillOpacity={0.4}
                  fill="url(#colorContribution)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* RECENT CONTRIBUTIONS */}
      <Card className="rounded-2xl shadow-md futuristic-bg">
        <CardHeader>
          <CardTitle className="text-xl">Recent Contributions</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex justify-end mb-4">
            <Input
              placeholder="Search contributor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-60 rounded-xl"
            />
          </div>

          <div className="space-y-3">
            {recentTransactions
              .filter((t) => t.user.toLowerCase().includes(search.toLowerCase()))
              .map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-white/5 dark:bg-black/20 rounded-xl border border-white/10 backdrop-blur"
                >
                  <div>
                    <p className="font-semibold">{tx.user}</p>
                    <p className="text-sm opacity-70">{tx.date}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold flex items-center justify-end gap-1">
                      <IndianRupee className="w-4 h-4" /> {tx.amount}
                    </p>
                    <p className="text-xs opacity-70">{tx.method}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
