"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Pencil,
  Search,
  Filter,
  Receipt,
  Wallet,
  Coins,
  Users,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function ContributePage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"assigned" | "paid">("assigned");

  const [data, setData] = useState([
    { id: 1, name: "John Doe", assigned: 1000, paid: 400, status: "Partial" },
    { id: 2, name: "Ava Sharma", assigned: 1400, paid: 400, status: "Paid" },
    { id: 3, name: "Ravi Kumar", assigned: 1600, paid: 300, status: "Pending" },
    { id: 4, name: "Neha Singh", assigned: 1500, paid: 500, status: "Paid" },
  ]);

  // 🧠 Derived values update automatically when data changes
  const totalAssigned = useMemo(
    () => data.reduce((a, b) => a + b.assigned, 0),
    [data]
  );
  const totalPaid = useMemo(() => data.reduce((a, b) => a + b.paid, 0), [data]);
  const totalRemaining = totalAssigned - totalPaid;
  const contributors = data.length;

  const filteredData = useMemo(() => {
    return data
      .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [search, sortBy, data]);

  // 🪄 Update assigned or paid dynamically
  const handleUpdate = (
    id: number,
    field: "assigned" | "paid",
    value: number
  ) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              status:
                value === item.assigned
                  ? "Paid"
                  : value > 0
                  ? "Partial"
                  : "Pending",
            }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/60 text-foreground p-6 space-y-10">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold">💰 Contributions Overview</h1>
          <p className="text-muted-foreground">
            Manage, update, and monitor all contribution records.
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            const newId = data.length + 1;
            setData([
              ...data,
              {
                id: newId,
                name: `User ${newId}`,
                assigned: 0,
                paid: 0,
                status: "Pending",
              },
            ]);
          }}
        >
          <Plus className="w-4 h-4" /> Add Contribution
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: "Total Assigned",
            value: `₹${totalAssigned}`,
            icon: Wallet,
            color: "from-blue-500/20 to-blue-700/20",
          },
          {
            title: "Total Paid",
            value: `₹${totalPaid}`,
            icon: Coins,
            color: "from-green-500/20 to-green-700/20",
          },
          {
            title: "Remaining",
            value: `₹${totalRemaining}`,
            icon: Receipt,
            color: "from-red-500/20 to-red-700/20",
          },
          {
            title: "Contributors",
            value: contributors,
            icon: Users,
            color: "from-purple-500/20 to-purple-700/20",
          },
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }}>
            <Card
              className={cn(
                "bg-gradient-to-br",
                item.color,
                "backdrop-blur-md border-border/40 hover:shadow-lg transition-all"
              )}
            >
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-base text-muted-foreground">
                  {item.title}
                </CardTitle>
                <item.icon className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{item.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-6">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contributor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={sortBy === "assigned" ? "default" : "secondary"}
            onClick={() => setSortBy("assigned")}
          >
            Assigned
          </Button>
          <Button
            variant={sortBy === "paid" ? "default" : "secondary"}
            onClick={() => setSortBy("paid")}
          >
            Paid
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      {/* SHADCN TABLE */}
      <div className="rounded-xl border border-border/40 backdrop-blur-md bg-card/50 mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Assigned (₹)</TableHead>
              <TableHead>Paid (₹)</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((c, i) => {
              const remaining = c.assigned - c.paid;
              return (
                <TableRow key={c.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      value={c.assigned}
                      onChange={(e) =>
                        handleUpdate(c.id, "assigned", Number(e.target.value))
                      }
                      className="w-24"
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      value={c.paid}
                      onChange={(e) =>
                        handleUpdate(c.id, "paid", Number(e.target.value))
                      }
                      className="w-24"
                    />
                  </TableCell>

                  <TableCell>₹{remaining}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        c.status === "Paid"
                          ? "default"
                          : c.status === "Partial"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Receipt className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() =>
                        setData((prev) =>
                          prev.filter((item) => item.id !== c.id)
                        )
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Overall Progress */}
      <Card className="mt-10 bg-card/60 backdrop-blur-lg border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            📊 Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={(totalPaid / totalAssigned) * 100} />
            <p className="text-sm text-muted-foreground">
              {((totalPaid / totalAssigned) * 100).toFixed(1)}% of total
              contributions completed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
