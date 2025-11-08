"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Search,
  Trash2,
  
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 🔧 Dummy history data (can later connect with Appwrite)
const historyData = [
  {
    id: 1,
    name: "Aarav Sharma",
    amount: 500,
    method: "Online",
    date: "2025-03-01",
    status: "Paid",
  },
  {
    id: 2,
    name: "Riya Patel",
    amount: 300,
    method: "Offline",
    date: "2025-03-03",
    status: "Pending",
  },
  {
    id: 3,
    name: "Aditya Mehta",
    amount: 800,
    method: "Online",
    date: "2025-03-04",
    status: "Paid",
  },
  {
    id: 4,
    name: "Neha Verma",
    amount: 400,
    method: "Offline",
    date: "2025-03-06",
    status: "Paid",
  },
  {
    id: 5,
    name: "Karan Singh",
    amount: 600,
    method: "Online",
    date: "2025-03-07",
    status: "Failed",
  },
];

export default function ContributionHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const filteredData = useMemo(() => {
    return historyData.filter(
      (item) =>
        (filter === "All" || item.status === filter) &&
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.method.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, filter]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPaid = historyData
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPending = historyData
    .filter((i) => i.status === "Pending")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/40 to-background text-foreground p-6 space-y-10">
      {/* 🔹 Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">💳 Contribution History</h1>
          <p className="text-muted-foreground">
            Track all user payments, statuses, and receipts in one place.
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter Options
        </Button>
      </motion.div>

      {/* 🔹 Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-600">Total Paid</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalPaid} ₹</CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-600">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalPending} ₹</CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-600">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {historyData.length}
          </CardContent>
        </Card>
      </div>

      {/* 🔹 Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
        <div className="flex items-center w-full sm:w-1/2 gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or payment method..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 🔹 Table Section */}
      <div className="rounded-xl overflow-hidden border border-border/40 backdrop-blur-md bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60">
              <TableHead className="w-[5%]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-accent/10 transition-all"
              >
                <TableCell>{item.id}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.amount} ₹</TableCell>
                <TableCell>{item.method}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "Paid"
                        ? "default"
                        : item.status === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 🔹 Pagination Controls */}
      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedData.length} of {filteredData.length} records
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
