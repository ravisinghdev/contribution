"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Printer,
  CreditCard,
  Wallet,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ✅ Define the shape of each receipt
interface IReceipt {
  id: string;
  name: string;
  amount: number;
  mode: "online" | "offline";
  status: "paid" | "pending";
  date: string;
  note: string;
}

export default function ReceiptsPage() {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "online" | "offline">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending">("all");
  const [selectedReceipt, setSelectedReceipt] = useState<IReceipt | null>(null);

  // ✅ Dummy receipt data
  const receipts: IReceipt[] = [
    {
      id: "RCPT001",
      name: "Riya Sharma",
      amount: 500,
      mode: "online",
      status: "paid",
      date: "2025-02-21",
      note: "UPI Payment via PhonePe",
    },
    {
      id: "RCPT002",
      name: "Aarav Verma",
      amount: 300,
      mode: "offline",
      status: "pending",
      date: "2025-02-22",
      note: "Cash collected by class rep",
    },
    {
      id: "RCPT003",
      name: "Priya Patel",
      amount: 800,
      mode: "online",
      status: "paid",
      date: "2025-02-20",
      note: "Netbanking (SBI)",
    },
  ];

  // ✅ Filtering logic
  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesMode = filterMode === "all" || r.mode === filterMode;
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesMode && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/60 p-6 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">🧾 Receipts & Records</h1>
          <p className="text-muted-foreground text-sm">
            View, search, and download all contribution receipts here.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" /> Export All
          </Button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between"
      >
        <div className="flex gap-3 w-full md:w-auto">
          <Select onValueChange={(v: "all" | "online" | "offline") => setFilterMode(v)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Payment Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(v: "all" | "paid" | "pending") => setFilterStatus(v)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      {/* Receipts Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {filteredReceipts.map((receipt) => (
          <motion.div
            key={receipt.id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => setSelectedReceipt(receipt)}
          >
            <Card className="cursor-pointer bg-card/60 backdrop-blur-lg border-border/40 hover:border-pink-500/50 hover:shadow-md transition-all">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-pink-500" /> {receipt.name}
                </CardTitle>
                <Badge
                  variant={receipt.status === "paid" ? "secondary" : "outline"}
                  className={
                    receipt.status === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {receipt.status === "paid" ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <Clock className="w-3 h-3 mr-1" />
                  )}
                  {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold text-pink-600">
                    ₹{receipt.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="capitalize flex items-center gap-1">
                    {receipt.mode === "online" ? (
                      <CreditCard className="w-3 h-3 text-green-500" />
                    ) : (
                      <Wallet className="w-3 h-3 text-yellow-500" />
                    )}
                    {receipt.mode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-pink-400" />
                    {receipt.date}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Receipt Detail Dialog */}
      <Dialog
        open={selectedReceipt !== null}
        onOpenChange={(open) => !open && setSelectedReceipt(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-500" />
              Receipt Details
            </DialogTitle>
          </DialogHeader>

          {selectedReceipt && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Name:</strong> {selectedReceipt.name}
              </p>
              <p>
                <strong>Amount:</strong> ₹{selectedReceipt.amount}
              </p>
              <p>
                <strong>Mode:</strong> {selectedReceipt.mode}
              </p>
              <p>
                <strong>Status:</strong> {selectedReceipt.status}
              </p>
              <p>
                <strong>Date:</strong> {selectedReceipt.date}
              </p>
              <p>
                <strong>Note:</strong> {selectedReceipt.note}
              </p>

              <Button variant="outline" className="w-full mt-2 gap-2">
                <Download className="w-4 h-4" /> Download Receipt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
