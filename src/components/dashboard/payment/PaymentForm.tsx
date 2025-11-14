"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function PaymentForm({
  currentUser,
  users,
  onSuccess,
  onError,
}: {
  currentUser: any;
  users: any[];
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}) {
  const isAdmin =
    currentUser.role === "main_admin" || currentUser.role === "parallel_admin";

  const [selectedUser, setSelectedUser] = useState<string>(
    isAdmin ? "" : currentUser.id
  );
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) setSelectedUser(currentUser.id);
  }, [currentUser, isAdmin]);

  async function createOrder(amountPaisa: number) {
    const res = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountPaisa, currency: "INR" }),
    });
    return res.json();
  }

  async function handleOnline() {
    if (!selectedUser) return toast.error("Select a user");
    if (!amount || amount <= 0) return toast.error("Enter valid amount");
    setLoading(true);
    try {
      const amountPaisa = Math.round(amount * 100);
      const order = await createOrder(amountPaisa);
      if (!order || !order.id)
        throw new Error(order.error || "Failed to create order");

      // open Razorpay checkout
      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Farewell Contribution",
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
            let data: any;
            try {
              data = await verifyRes.json();
            } catch {
              const txt = await verifyRes.text();
              throw new Error("Invalid server response: " + txt);
            }
            if (!verifyRes.ok || !data.success) {
              throw new Error(data.error || "Verification failed");
            }
            toast.success("Payment verified & saved");
            onSuccess?.();
          } catch (err: any) {
            toast.error(err.message || "Verification error");
            onError?.(err.message ?? "Verification error");
          }
        },
        prefill: { name: currentUser.name },
      });

      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
      onError?.(err.message ?? "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleOffline() {
    if (!selectedUser) return toast.error("Select a user");
    if (!amount || amount <= 0) return toast.error("Enter valid amount");
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success(
        "Offline payment recorded (pending approval if student-created)"
      );
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Offline save failed");
      onError?.(err.message ?? "Offline save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ensure Razorpay script is loaded */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <div className="p-4 rounded-xl border">
        {isAdmin && (
          <div className="mb-3">
            <Label>Select User</Label>
            <Select
              value={selectedUser ?? ""}
              onValueChange={(v) => setSelectedUser(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u: any) => (
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
          />
        </div>

        <div className="mb-3">
          <Label>Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <Tabs defaultValue="online">
          <TabsList>
            <TabsTrigger value="online">Online</TabsTrigger>
            <TabsTrigger value="offline">Offline</TabsTrigger>
          </TabsList>

          <TabsContent value="online">
            <Button
              className="w-full"
              onClick={handleOnline}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Online (Razorpay)"}
            </Button>
          </TabsContent>

          <TabsContent value="offline">
            <Button
              className="w-full"
              onClick={handleOffline}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isAdmin
                ? "Add Offline Payment (Admin)"
                : "Request Offline Payment"}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
