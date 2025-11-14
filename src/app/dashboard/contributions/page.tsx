"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts";

import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  IndianRupee,
} from "lucide-react";

const chartData = [
  { date: "Mon", amount: 4500 },
  { date: "Tue", amount: 7000 },
  { date: "Wed", amount: 3200 },
  { date: "Thu", amount: 8200 },
  { date: "Fri", amount: 6000 },
  { date: "Sat", amount: 9000 },
  { date: "Sun", amount: 7500 },
];

const recent = [
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
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [page, setPage] = useState(1);
  const perPage = 8;

  const allTransactions = [
    {
      id: 1,
      user: "Aarav Sharma",
      amount: 800,
      method: "UPI",
      status: "success",
      date: "Nov 14, 10:21 AM",
      transaction_id: "TXN_23987ABC",
    },
    {
      id: 2,
      user: "Bro",
      amount: 500,
      method: "Cash",
      status: "pending",
      date: "Nov 14, 9:40 AM",
      transaction_id: "TXN_23987ABD",
    },
    {
      id: 3,
      user: "Priya Singh",
      amount: 1500,
      method: "Razorpay",
      status: "success",
      date: "Nov 13, 11:30 AM",
      transaction_id: "TXN_993843HHS",
    },
  ];

  return (
    <div className="space-y-8 relative z-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">
          Contributions Overview
        </h1>

        <div className="flex gap-3">
          <Button className="rounded-xl">Add Contribution</Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-xl flex items-center gap-2"
              >
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

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl futuristic-bg shadow-md">
          <CardHeader>
            <CardTitle>Total Contributions</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold flex items-center gap-2">
            <IndianRupee className="w-6 h-6" /> 78,900
          </CardContent>
        </Card>

        <Card className="rounded-2xl futuristic-bg shadow-md">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">12</CardContent>
        </Card>

        <Card className="rounded-2xl futuristic-bg shadow-md">
          <CardHeader>
            <CardTitle>Unique Contributors</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">48</CardContent>
        </Card>
      </div>

      {/* SPLIT GRAPH + RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAPH (2/3) */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl futuristic-bg shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">
                Weekly Contribution Trends
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorAmount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="10%" stopOpacity={0.6} />
                        <stop offset="90%" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="amount"
                      strokeWidth={3}
                      fill="url(#colorAmount)"
                      fillOpacity={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RECENT CONTRIBUTIONS (1/3) */}
        <div>
          <Card className="rounded-2xl futuristic-bg shadow-md h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Recent Contributions</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-auto">
              <div className="flex justify-end mb-4">
                <Input
                  placeholder="Search contributor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-60 rounded-xl"
                />
              </div>

              {/* SHADCN TABLE */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {recent
                      .filter((t) =>
                        t.user.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">
                            {tx.user}
                          </TableCell>
                          <TableCell className="font-semibold flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" /> {tx.amount}
                          </TableCell>
                          <TableCell>{tx.method}</TableCell>
                          <TableCell className="capitalize">
                            {tx.status}
                          </TableCell>
                          <TableCell>{tx.date}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          {/* FULL WIDTH TRANSACTIONS TABLE */}
          <Card className="rounded-2xl futuristic-bg shadow-xl mt-8">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-xl">All Transactions</CardTitle>

              <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                {/* Search */}
                <Input
                  placeholder="Search by user or method..."
                  className="w-60 rounded-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {/* Method Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-xl flex items-center gap-2"
                    >
                      Method
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setMethodFilter("ALL")}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMethodFilter("UPI")}>
                      UPI
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setMethodFilter("Cash")}>
                      Cash
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setMethodFilter("Razorpay")}
                    >
                      Razorpay
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-xl flex items-center gap-2"
                    >
                      Status
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("success")}
                    >
                      Success
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter("pending")}
                    >
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("failed")}>
                      Failed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-white/10 backdrop-blur">
                <Table>
                  <TableHeader className="sticky top-0 bg-black/20 backdrop-blur z-10">
                    <TableRow>
                      <TableHead className="min-w-[180px]">User</TableHead>
                      <TableHead className="min-w-[120px]">Amount</TableHead>
                      <TableHead className="min-w-[120px]">Method</TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[180px]">Date</TableHead>
                      <TableHead className="min-w-[200px]">
                        Transaction ID
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {allTransactions
                      .filter(
                        (tx) =>
                          tx.user
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          tx.method.toLowerCase().includes(search.toLowerCase())
                      )
                      .filter((tx) =>
                        methodFilter === "ALL"
                          ? true
                          : tx.method === methodFilter
                      )
                      .filter((tx) =>
                        statusFilter === "ALL"
                          ? true
                          : tx.status === statusFilter
                      )
                      .slice((page - 1) * perPage, page * perPage)
                      .map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">
                            {tx.user}
                          </TableCell>

                          <TableCell className="font-bold flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" /> {tx.amount}
                          </TableCell>

                          <TableCell>{tx.method}</TableCell>

                          <TableCell className="capitalize">
                            {tx.status}
                          </TableCell>

                          <TableCell>{tx.date}</TableCell>

                          <TableCell className="font-mono text-xs opacity-70">
                            {tx.transaction_id}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* PAGINATION */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>

                <p className="opacity-70 text-sm">
                  Page {page} of {Math.ceil(allTransactions.length / perPage)}
                </p>

                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() =>
                    setPage((p) =>
                      p < Math.ceil(allTransactions.length / perPage)
                        ? p + 1
                        : p
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
