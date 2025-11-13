"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  id: string;
  name: string;
  role: "student" | "main_admin" | "parallel_admin";
}

interface Transaction {
  id: number;
  user_id: string;
  user_name: string;
  amount: number;
  type: "online" | "offline";
  status: "pending" | "completed";
  receipt_url?: string | null;
  notes?: string | null;
  logged_by_admin?: string | null;
}

interface MakePaymentProps {
  currentUser: User;
  users: User[];
}

export default function MakePaymentClientPage({
  currentUser,
  users,
}: MakePaymentProps) {
  const supabase = createClientComponentClient();

  const isAdmin =
    currentUser.role === "main_admin" || currentUser.role === "parallel_admin";

  const [selectedUser, setSelectedUser] = useState<string | null>(
    isAdmin ? null : currentUser.id
  );
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<"online" | "offline">(
    "online"
  );
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch transactions
  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, profiles!inner(full_name)")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else
      setTransactions(
        data.map((t: any) => ({
          id: t.id,
          user_id: t.user_id,
          user_name: t.profiles.full_name,
          amount: t.amount,
          type: t.type,
          status: t.status,
          receipt_url: t.receipt_url,
          notes: t.notes,
          logged_by_admin: t.logged_by_admin_id,
        }))
      );
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async () => {
    if (!selectedUser) return alert("Please select a user");
    if (amount <= 0) return alert("Enter valid amount");

    setLoading(true);

    try {
      const { error } = await supabase.from("transactions").insert([
        {
          user_id: selectedUser,
          amount,
          type: paymentType,
          status: isAdmin || paymentType === "online" ? "completed" : "pending",
          logged_by_admin_id: isAdmin ? currentUser.id : null,
          receipt_url: paymentType === "online" ? receiptUrl : null,
          notes,
        },
      ]);

      if (error) throw error;

      alert("Transaction added successfully");
      setAmount(0);
      setNotes("");
      setReceiptUrl("");
      setSelectedUser(isAdmin ? null : currentUser.id);
      fetchTransactions();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOffline = async (id: number) => {
    const { error } = await supabase
      .from("transactions")
      .update({ status: "completed", logged_by_admin_id: currentUser.id })
      .eq("id", id);
    if (error) alert("Failed to approve");
    else fetchTransactions();
  };

  // Compute summary
  const totalAmount = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const completedCount = transactions.filter(
    (tx) => tx.status === "completed"
  ).length;
  const pendingCount = transactions.filter(
    (tx) => tx.status === "pending"
  ).length;

  return (
    <motion.div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-gray-200 shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Total Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Completed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completedCount}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Form */}
      <Card className="shadow-xl rounded-3xl border border-gray-200">
        <CardHeader>
          <CardTitle>Payment Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={isAdmin ? "add_transaction" : "online"}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-2 rounded-xl border border-gray-300 bg-transparent">
              {isAdmin ? (
                <>
                  <TabsTrigger value="add_transaction">
                    Add Transaction
                  </TabsTrigger>
                  <TabsTrigger value="make_payment">Make Payment</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="online">Online Payment</TabsTrigger>
                  <TabsTrigger value="offline_request">
                    Offline Request
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent
              value={isAdmin ? "add_transaction" : "online"}
              className="space-y-4"
            >
              {isAdmin && (
                <>
                  <Label>Contributor</Label>
                  <Select
                    value={selectedUser ?? ""}
                    onValueChange={setSelectedUser}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Contributor" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} ({u.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              <Label>Amount</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              {paymentType === "online" && (
                <>
                  <Label>Receipt URL</Label>
                  <Input
                    value={receiptUrl ?? ""}
                    onChange={(e) => setReceiptUrl(e.target.value)}
                  />
                </>
              )}

              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <Button
                className="mt-4 w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </TabsContent>

            {!isAdmin && (
              <TabsContent value="offline_request" className="space-y-4">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <Label>Reason / Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reason for offline request"
                />
                <Button
                  className="mt-4 w-full"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Request Offline Payment"}
                </Button>
              </TabsContent>
            )}
          </Tabs>

          {/* Transaction Table */}
          <ScrollArea className="mt-8 rounded-lg border">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Logged By</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>{tx.user_name}</TableCell>
                    <TableCell>${tx.amount.toFixed(2)}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Badge
                          variant={
                            tx.status === "completed" ? "green" : "yellow"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </motion.div>
                    </TableCell>
                    <TableCell>{tx.notes}</TableCell>
                    <TableCell>{tx.logged_by_admin || "-"}</TableCell>
                    {isAdmin && tx.status === "pending" && (
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleApproveOffline(tx.id)}
                        >
                          Approve
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
