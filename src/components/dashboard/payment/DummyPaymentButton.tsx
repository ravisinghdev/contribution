"use client";
import { useState } from "react";
import { useTransactions } from "@/context/TransactionsContext";
import { motion } from "framer-motion";

export default function DummyPaymentButton({
  farewellId = 1,
  userId = "user-123",
}: {
  farewellId?: number;
  userId?: string;
}) {
  const { addTransaction } = useTransactions();
  const [amount, setAmount] = useState(500);
  const [method, setMethod] = useState<"online" | "cash">("online");
  const [type, setType] = useState("registration");
  const [adminId, setAdminId] = useState("");

  const handlePayment = () => {
    if (method === "cash" && !adminId)
      return alert("Admin ID required for cash!");
    addTransaction({
      farewellId,
      userId,
      amount,
      method,
      type,
      loggedByAdminId: method === "cash" ? adminId : undefined,
    });
    alert("Dummy Payment Added!");
  };

  return (
    <div className="space-y-3 p-4 bg-gray-900 rounded-2xl shadow-lg border border-white/20">
      <h2 className="text-xl text-white font-bold">Add Payment</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="p-2 rounded bg-gray-800 text-white w-full"
        placeholder="Amount"
      />
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value as any)}
        className="p-2 rounded w-full bg-gray-800 text-white"
      >
        <option value="online">Online</option>
        <option value="cash">Cash</option>
      </select>
      {method === "cash" && (
        <input
          type="text"
          placeholder="Admin ID"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          className="p-2 rounded bg-gray-800 w-full text-white"
        />
      )}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="p-2 rounded w-full bg-gray-800 text-white"
      >
        <option value="registration">Registration</option>
        <option value="donation">Donation</option>
      </select>
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={handlePayment}
        className="w-full py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
      >
        Add Payment
      </motion.button>
    </div>
  );
}
