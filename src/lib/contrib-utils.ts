// lib/contrib-utils.ts

/**
 * Formats any number into an INR currency string.
 * e.g. 2500 -> ₹2,500
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Random color generator for charts or badges.
 */
export function randomColor(): string {
  const colors = ["#f472b6", "#a78bfa", "#38bdf8", "#34d399", "#fb923c"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Converts numeric percentage progress to label and color
 * e.g. 75 → { label: "On Track", color: "bg-green-500" }
 */
export function getProgressStatus(percent: number): { label: string; color: string } {
  if (percent >= 90) return { label: "Completed", color: "bg-green-500" };
  if (percent >= 60) return { label: "On Track", color: "bg-yellow-500" };
  return { label: "Pending", color: "bg-red-500" };
}

/**
 * Exports array data to CSV file
 */
export function generateCSV<T extends Record<string, any>>(data: T[], filename: string): void {
  if (!data || data.length === 0) return;

  const csvRows: string[] = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  for (const row of data) {
    csvRows.push(
      headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
    );
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Formats a receipt ID like: RCPT-2025-00023
 */
export function formatReceiptID(id: number): string {
  const year = new Date().getFullYear();
  return `RCPT-${year}-${String(id).padStart(5, "0")}`;
}
