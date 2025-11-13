"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Transaction = {
  id: number;
  farewellId: number;
  userId: string;
  amount: number;
  type: string;
  method: "online" | "cash";
  status: "success";
  isDummy: boolean;
  loggedByAdminId?: string;
  createdAt: string;
};

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id" | "createdAt" | "status" | "isDummy">) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Load from localStorage if exists
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dummyTransactions");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const addTransaction = (t: Omit<Transaction, "id" | "createdAt" | "status" | "isDummy">) => {
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      createdAt: new Date().toISOString(),
      status: "success",
      isDummy: true,
      ...t,
    };
    setTransactions((prev) => {
      const updated = [...prev, newTransaction];
      localStorage.setItem("dummyTransactions", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) throw new Error("useTransactions must be used within TransactionsProvider");
  return context;
};
