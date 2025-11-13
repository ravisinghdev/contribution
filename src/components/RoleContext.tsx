"use client";

import { createContext, useContext } from "react";
import type { UserRole } from "@/lib/permissions";

interface RoleContextType {
  role: UserRole;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleContextProvider({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextType {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleContextProvider");
  return ctx;
}