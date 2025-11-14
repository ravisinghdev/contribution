"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Props:
 * - currentUser: { id, name, role }
 * - users: Array<{ id, name, role }>
 * - refreshTransactions: optional callback to refresh parent transaction list
 */
export default function MakePaymentClientPage({
  currentUser,
  users,
  refreshTransactions,
}: {
  currentUser: { id: string; name: string; role: string };
  users: Array<{ id: string; name: string; role: string }>;
  refreshTransactions?: () => void;
}) {
  const isAdmin =
    currentUser.role === "main_admin" || currentUser.role === "parallel_admin";

  const [selectedUser, setSelectedUser] = useState<string>(
    isAdmin ? "" : currentUser.id
  );
  const [amount, setAmount] = useState<number>(0); // rupees
  const [notes, setNotes] = useState<string>("");
  const [method, setMethod] = useState<
    "online" | "offline" | "cash" | "upi" | "other"
  >("online");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) setSelectedUser(currentUser.id);
  }, [currentUser, isAdmin]);

  // Helper: create razorpay order (expects paisa integer)
  async function createOrder(amountPaisa: number) {
    const res = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountPaisa, currency: "INR" }),
    });
    return res.json();
  }

  // Online payment flow
  async function handleOnlinePay() {
    if (!selectedUser) return toast.error("Select a user");
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");
    setLoading(true);

    try {
      const amountPaisa = Math.round(amount * 100);
      const order = await createOrder(amountPaisa);
      if (!order || !order.id)
        throw new Error(order.error || "Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Farewell Contribution",
        prefill: { name: currentUser.name },
      };

      const rzp = new (window as any).Razorpay({
        ...options,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify-and-capture", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                selected_user: selectedUser,
                metadata: { amount, notes },
              }),
            });

            const data = await verifyRes.json();
            if (!verifyRes.ok || !data.success) {
              throw new Error(data.error || "Verification failed");
            }

            toast.success("Payment verified and saved");
            refreshTransactions?.();
          } catch (err: any) {
            toast.error(err.message || "Verification error");
          }
        },
      });

      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  // Offline/cash/upi flow (creates server-side transaction)
  async function handleOfflineSave() {
    if (!selectedUser) return toast.error("Select a user");
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");
    setLoading(true);
    try {
      const res = await fetch("/api/contributions/offline-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedUser,
          amount,
          notes,
          logged_by_admin_id: isAdmin ? currentUser.id : null,
          method: method === "offline" ? "offline" : method, // allow cash/upi/other
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to save offline payment");
      toast.success("Offline payment saved");
      refreshTransactions?.();
    } catch (err: any) {
      toast.error(err.message || "Offline save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 rounded-xl border ">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      {isAdmin && (
        <div className="mb-4">
          <Label>Select User</Label>
          <Select
            value={selectedUser}
            onValueChange={(v) => setSelectedUser(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select contributor" />
            </SelectTrigger>
            <SelectContent>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="mb-3">
        <Label>Amount (INR)</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={0}
          step="0.01"
        />
      </div>

      <div className="mb-3">
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div className="mb-4">
        <Label>Payment Method</Label>
        <div className="flex gap-2 items-center mt-2">
          <select
            className="p-2 border rounded w-full"
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
          >
            <option value="online">Online (Razorpay)</option>
            <option value="offline">Offline (generic)</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {method === "online" ? (
          <Button onClick={handleOnlinePay} disabled={loading}>
            {loading ? "Processing..." : "Pay Online (Razorpay)"}
          </Button>
        ) : (
          <Button onClick={handleOfflineSave} disabled={loading}>
            {loading
              ? "Saving..."
              : isAdmin
              ? "Add Offline Payment (Admin)"
              : "Request Offline Payment"}
          </Button>
        )}
      </div>
    </div>
  );
}
