"use client";
import { motion } from "framer-motion";

export default function DashboardCard({
  title,
  value,
  gradient,
}: {
  title: string;
  value: string | number;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm ${gradient} text-white`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}
