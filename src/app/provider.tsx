"use client";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ReactNode, FC } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { TransactionsProvider } from "@/context/TransactionsContext";

interface IProviderProps {
  children: ReactNode;
}

const Provider: FC<IProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TransactionsProvider>{children}</TransactionsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Provider;
