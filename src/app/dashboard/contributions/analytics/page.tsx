"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Download, PieChart, LineChart } from "lucide-react";
import {
  LineChart as RLineChart,
  Line,
  PieChart as RPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, randomColor, getProgressStatus, generateCSV } from "@/lib/contrib-utils";

export default function ContributionAnalyticsPage() {
  const [data] = useState([
    { month: "Jan", paid: 40000, assigned: 50000 },
    { month: "Feb", paid: 48000, assigned: 52000 },
    { month: "Mar", paid: 52000, assigned: 55000 },
    { month: "Apr", paid: 56000, assigned: 56000 },
  ]);

  const [categoryData] = useState([
    { name: "Students", value: 65 },
    { name: "Teachers", value: 20 },
    { name: "Admins", value: 15 },
  ]);

  const [exporting, setExporting] = useState(false);

  const totalPaid = useMemo(
    () => data.reduce((acc, val) => acc + val.paid, 0),
    [data]
  );
  const totalAssigned = useMemo(
    () => data.reduce((acc, val) => acc + val.assigned, 0),
    [data]
  );
  const progress = Math.round((totalPaid / totalAssigned) * 100);

  const handleExport = () => {
    setExporting(true);
    generateCSV(data, "contribution-analytics");
    setTimeout(() => setExporting(false), 1000);
  };

  const status = getProgressStatus(progress);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-muted/50 p-6 text-foreground space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold">📊 Contribution Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Insightful overview of payments, categories, and growth.
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {exporting ? "Exporting..." : "Export CSV"}
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-border/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalAssigned)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-border/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-border/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${status.color}`}
              ></div>
              <p className="text-2xl font-bold">{progress}%</p>
              <span className="text-xs text-muted-foreground">{status.label}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Smooth Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-card/50 backdrop-blur-lg border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-pink-500" /> Monthly Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <RLineChart data={data}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30,30,30,0.8)",
                      borderRadius: "10px",
                      border: "none",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="assigned"
                    stroke="#c084fc"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={900}
                  />
                  <Line
                    type="monotone"
                    dataKey="paid"
                    stroke="#fb7185"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    animationDuration={900}
                  />
                </RLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-card/50 backdrop-blur-lg border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-400" /> Contribution by Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <RPieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={5}
                    label
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={randomColor()} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
