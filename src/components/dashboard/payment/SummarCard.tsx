"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  loading: boolean;
  transactions: {
    id: number;
    amount: string;
    status: string | null;
  }[];
}

export default function SummaryCards({ loading, transactions }: Props) {
  const total = transactions.reduce((n, row) => n + Number(row.amount || 0), 0);
  const completed = transactions.filter((t) => t.status === "completed").length;
  const pending = transactions.filter((t) => t.status === "pending").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Total Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {loading ? "…" : `₹${total.toLocaleString()}`}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{loading ? "…" : completed}</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{loading ? "…" : pending}</p>
        </CardContent>
      </Card>
    </div>
  );
}
