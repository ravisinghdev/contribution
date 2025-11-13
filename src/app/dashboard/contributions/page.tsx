"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { dummyTransactions } from "@/data/dummyTransactions";
import { DownloadCloud } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContributionsDashboard() {
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState<
    "all" | "online" | "offline"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed" | "failed"
  >("all");

  const filteredTransactions = useMemo(() => {
    return dummyTransactions.filter((t) => {
      const matchesSearch = t.user_name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesMethod = filterMethod === "all" || t.method === filterMethod;
      const matchesStatus = filterStatus === "all" || t.status === filterStatus;
      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [search, filterMethod, filterStatus]);

  const totalContributions = filteredTransactions.reduce(
    (a, t) => a + t.total_amount,
    0
  );

  return (
    <motion.div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Total Contributions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ${totalContributions.toFixed(2)}
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Online Contributions</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            $
            {filteredTransactions
              .filter((t) => t.method === "online")
              .reduce((a, t) => a + t.total_amount, 0)
              .toFixed(2)}
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Offline Contributions</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            $
            {filteredTransactions
              .filter((t) => t.method === "offline")
              .reduce((a, t) => a + t.total_amount, 0)
              .toFixed(2)}
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {filteredTransactions.filter((t) => t.status === "pending").length}
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Input
          placeholder="Search by contributor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        <div className="flex gap-2">
          {/* Method Filter */}
          <Select
            value={filterMethod}
            onValueChange={(value) =>
              setFilterMethod(value as "all" | "online" | "offline")
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filterStatus}
            onValueChange={(value) =>
              setFilterStatus(
                value as "all" | "pending" | "completed" | "failed"
              )
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg mt-4">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <TableRow key={tx.id} className="transition-colors">
                <TableCell>{tx.id}</TableCell>
                <TableCell>{tx.user_name}</TableCell>
                <TableCell>${tx.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={tx.method === "online" ? "green" : "yellow"}>
                    {tx.method.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      tx.status === "completed"
                        ? "green"
                        : tx.status === "pending"
                        ? "yellow"
                        : "red"
                    }
                  >
                    {tx.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{tx.logged_by_admin ?? "-"}</TableCell>
                <TableCell>
                  {tx.receipt_url ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={tx.receipt_url} target="_blank" rel="noreferrer">
                        View
                      </a>
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {new Date(tx.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
