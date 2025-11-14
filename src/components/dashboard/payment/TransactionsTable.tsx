"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type TxView = {
  id: number;
  user_id: string;
  user_name: string | null;
  amount: string;
  type: string | null;
  status: string | null;
  notes: string | null;
  receipt_url: string | null;
  logged_by_admin_id: string | null;
};

type User = {
  id: string;
  name: string;
  role: "student" | "main_admin" | "parallel_admin";
};

export default function TransactionTable({
  currentUser,
  transactions,
  onApprove,
  onError,
}: {
  currentUser: User;
  transactions: TxView[];
  onApprove: () => void;
  onError: (msg: string) => void;
}) {
  const isAdmin =
    currentUser.role === "main_admin" || currentUser.role === "parallel_admin";

  async function approve(id: number) {
    try {
      const resp = await fetch("/api/contributions/approve", {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      onApprove();
    } catch (err: any) {
      onError(err.message || "Approve failed");
    }
  }

  return (
    <div className="border rounded-xl p-3 shadow-md space-y-4">
      <h3 className="font-semibold text-lg">Recent Transactions</h3>

      <div className="overflow-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Receipt</TableHead>
              {isAdmin && <TableHead>Action</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.user_name ?? "Unknown"}</TableCell>
                <TableCell>₹{tx.amount}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      tx.status === "completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {tx.status}
                  </span>
                </TableCell>
                <TableCell>{tx.notes ?? "-"}</TableCell>
                <TableCell>
                  {tx.receipt_url ? (
                    <a
                      href={tx.receipt_url}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {isAdmin && (
                  <TableCell>
                    {tx.status === "pending" ? (
                      <Button size="sm" onClick={() => approve(tx.id)}>
                        Approve
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
