"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Wallet,
  Upload,
  Loader2,
  CheckCircle,
  
  Smartphone,
  Banknote,
  QrCode,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AddContributionPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [method, setMethod] = useState("");

  const handlePayNow = () => {
    if (!amount || !name) return;
    setPaymentOpen(true);
  };

  const confirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaymentOpen(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  return (
    <div
     className="min-h-screen p-6 transition-all duration-500 "
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className=" border-border/40 shadow-lg">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="text-2xl font-bold">💰 Add Contribution</span>
              <Badge
                variant="secondary"
                className="px-3 py-1 text-xs font-semibold"
              >
                {isOnline ? "Online Mode" : "Offline Mode"}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Toggle */}
            <div className="flex justify-between items-center border p-3 rounded-xl">
              <div className="flex items-center gap-3">
                {isOnline ? (
                  <CreditCard className="text-green-500" />
                ) : (
                  <Wallet className="text-yellow-500" />
                )}
                <Label className="font-medium">
                  {isOnline ? "Online Payment" : "Offline Collection"}
                </Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOnline(!isOnline)}
              >
                Switch
              </Button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Contribution Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farewell">Farewell Fund</SelectItem>
                    <SelectItem value="gift">Gift</SelectItem>
                    <SelectItem value="decor">Decoration</SelectItem>
                    <SelectItem value="food">Food / Catering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Remarks (Optional)</Label>
                <Textarea
                  placeholder="Transaction ID, extra note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="border-dashed border rounded-xl p-4 text-center space-y-2">
              <Upload className="mx-auto text-muted-foreground" />
              <Label htmlFor="receipt-upload" className="cursor-pointer">
                Upload Receipt / Proof
              </Label>
              <Input type="file" id="receipt-upload" className="hidden" />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                onClick={handlePayNow}
                disabled={!amount || !name}
                className="flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" /> Proceed to {isOnline ? "Pay" : "Add"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Modal */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Payment Method</DialogTitle>
            <DialogDescription>
              You’re contributing ₹{amount} as {name}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <Button
              variant={method === "upi" ? "default" : "outline"}
              onClick={() => setMethod("upi")}
            >
              <QrCode className="mr-2" /> UPI
            </Button>
            <Button
              variant={method === "card" ? "default" : "outline"}
              onClick={() => setMethod("card")}
            >
              <CreditCard className="mr-2" /> Card
            </Button>
            <Button
              variant={method === "wallet" ? "default" : "outline"}
              onClick={() => setMethod("wallet")}
            >
              <Smartphone className="mr-2" /> Wallet
            </Button>
          </div>

          <DialogFooter className="mt-4 flex justify-between">
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPayment} disabled={!method || loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing
                </>
              ) : (
                <>
                  <Banknote className="mr-2" /> Confirm Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Animation */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <p>Payment Successful! Receipt saved to your profile.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
