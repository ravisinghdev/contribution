"use client";

import { useTransactions } from "@/context/TransactionsContext";

export default function PaymentHistoryPage() {
  const { transactions } = useTransactions();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Payment History</h1>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((t) => (
          <div key={t.id} className="p-2 border rounded">
            <p>ID: {t.id}</p>
            <p>Amount: {t.amount}</p>
            <p>Method: {t.method}</p>
            <p>Status: {t.status}</p>
            <p>Type: {t.type}</p>
            <p>Dummy: {t.isDummy ? "Yes" : "No"}</p>
            {t.loggedByAdminId && <p>Admin: {t.loggedByAdminId}</p>}
            <p>Date: {new Date(t.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
