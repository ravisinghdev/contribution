"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { Label } from "@/components/ui/label";

type TxRow = Database["public"]["Tables"]["transactions"]["Row"] & {
  user_full_name?: string | null;
};

export default function OfflineApprovalsPage() {
  const supabase = createClientComponentClient<Database>();
  const [rows, setRows] = useState<TxRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [openReject, setOpenReject] = useState(false);
  const [rejectTxId, setRejectTxId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contributions/pending");
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to fetch");
        return;
      }
      setRows(data.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();

    // Realtime subscription: listen for inserts/updates to transactions (pending)
    const channel = supabase
      .channel("public:transactions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        (payload) => {
          // If a pending transaction inserted or updated to pending, refresh
          // payload.record has the row (V2 behaviour)
          try {
            const rec = (payload as any).record;
            if (!rec) {
              fetchPending();
              return;
            }
            const methods = ["offline", "cash", "upi", "other"];
            const isOffline = methods.includes(rec.method);
            if (isOffline && rec.status === "pending") {
              // simple: refetch list
              fetchPending();
            } else {
              // if some other status changed, refetch too
              fetchPending();
            }
          } catch {
            fetchPending();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchPending, supabase]);

  const handleApprove = async (id: number) => {
    if (!confirm("Approve this offline payment?")) return;
    try {
      const res = await fetch("/api/contributions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      toast.success("Approved");
      fetchPending();
    } catch (err: any) {
      toast.error(err.message || "Approve failed");
    }
  };

  const openRejectDialog = (id: number) => {
    setRejectTxId(id);
    setRejectReason("");
    setOpenReject(true);
  };

  const doReject = async () => {
    if (!rejectTxId) return;
    try {
      const res = await fetch("/api/contributions/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: rejectTxId,
          reason: rejectReason,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      toast.success("Rejected");
      setOpenReject(false);
      fetchPending();
    } catch (err: any) {
      toast.error(err.message || "Reject failed");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Pending Offline Payments</h2>
        <div>
          <Button onClick={fetchPending} variant="outline" disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Contributor</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.user_full_name ?? r.user_id}</TableCell>
              <TableCell>{r.amount}</TableCell>
              <TableCell>{r.method}</TableCell>
              <TableCell>{r.notes ?? "-"}</TableCell>
              <TableCell>{r.created_at ?? "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(r.id)}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openRejectDialog(r.id)}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openReject} onOpenChange={setOpenReject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Reason</Label>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenReject(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={doReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
