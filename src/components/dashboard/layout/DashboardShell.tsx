"use client";

import { ReactNode, useEffect, useState } from "react";
import { RoleContextProvider } from "@/components/RoleContext";
import { SidebarProvider } from "@/components/dashboard/layout/SidebarContext";
import dynamic from "next/dynamic";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import type { Farewell } from "@/app/dashboard/layout";

const Navbar = dynamic(() => import("@/components/dashboard/layout/Navbar"), {
  ssr: false,
});
const Sidebar = dynamic(() => import("@/components/dashboard/layout/Sidebar"), {
  ssr: false,
});

interface DashboardShellProps {
  children: ReactNode;
  userProfile: { full_name: string; avatar_url: string | null };
  email: string;
  activeFarewell: Farewell | null;
  activeRole: string;
  hasNoFarewells: boolean;
}

export function DashboardShell({
  children,
  userProfile,
  email,
  activeFarewell: initialActiveFarewell,
  activeRole: initialRole,
  hasNoFarewells,
}: DashboardShellProps) {
  const [allFarewells, setAllFarewells] = useState<Farewell[]>();
  const [activeFarewell, setActiveFarewell] = useState<Farewell | null>(
    initialActiveFarewell
  );
  const [activeRole, setActiveRole] = useState<string>(initialRole);
  const [hydrated, setHydrated] = useState(false);

  // --- Load from localStorage if available ---
  useEffect(() => {
    try {
      const storedFarewells = localStorage.getItem("farewells");
      const storedActive = localStorage.getItem("activeFarewell");
      const storedRole = localStorage.getItem("activeRole");

      if (storedFarewells) setAllFarewells(JSON.parse(storedFarewells));
      if (storedActive) setActiveFarewell(JSON.parse(storedActive));
      if (storedRole) setActiveRole(storedRole);
    } catch (err) {
      console.warn("Failed to load dashboard data from localStorage:", err);
    } finally {
      setHydrated(true);
    }
  }, []);

  // --- Save to localStorage whenever values change ---
  useEffect(() => {
    try {
      localStorage.setItem("farewells", JSON.stringify(allFarewells));
      localStorage.setItem("activeFarewell", JSON.stringify(activeFarewell));
      localStorage.setItem("activeRole", activeRole);
    } catch (err) {
      console.warn("Failed to save dashboard data to localStorage:", err);
    }
  }, [allFarewells, activeFarewell, activeRole]);

  // --- Prevent flicker before hydration ---
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  return (
    <RoleContextProvider role={activeRole as any}>
      <SidebarProvider>
        <AnimatedBackground>
          <div className="h-screen flex flex-col">
            {/* If user has no farewells, show only the main content */}
            {hasNoFarewells ? (
              <main className="h-screen w-full">{children}</main>
            ) : (
              <>
                {/* ✅ Always show Navbar (handles null activeFarewell safely) */}
                <Navbar
                  user={userProfile}
                  email={email}
                />

                {/* Layout body with Sidebar + Content */}
                <div className="flex flex-1 overflow-hidden pt-14">
                  <Sidebar user={userProfile} />
                  <main className="flex-1 overflow-y-auto sm:pl-64 text-foreground">
                    <div className="p-4 sm:p-8">{children}</div>
                  </main>
                </div>
              </>
            )}
          </div>
        </AnimatedBackground>
      </SidebarProvider>
    </RoleContextProvider>
  );
}
