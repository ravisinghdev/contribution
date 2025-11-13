import { UserRole } from "@/types/announcements";
import { createContext, useContext } from "react";

interface RoleContextType {
  role: UserRole;
}

export const RoleContext = createContext<RoleContextType | undefined>(
  undefined
);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context)
    throw new Error("useRole must be used within RoleContextProvider");
  return context.role; // <-- make sure you return the string
};
