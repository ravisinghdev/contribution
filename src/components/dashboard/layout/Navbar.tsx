"use client";

import { useState, useEffect } from "react";
import { Menu, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from "./SidebarContext";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggler } from "@/components/theme/ThemeToggler";
import SearchBar from "./SearchBar";
import { createClient } from "@/lib/supabase/client";
import useSWR from "swr";
import toast from "react-hot-toast";
import { cookies } from "next/headers";

interface NavbarProps {
  user: {
    full_name: string;
    avatar_url: string | null;
  };
  email: string;
}

export interface Farewell {
  id: number;
  name: string;
  event_year: number;
  organizing_class: string | null;
  created_at: string;
}

// --- Supabase Fetcher ---
const fetchFarewells = async (): Promise<Farewell[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("farewells")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

export default function Navbar({ user, email }: NavbarProps) {
  const { toggle } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeFarewell, setActiveFarewell] = useState<Farewell | null>(null);
  const [farewellsCache, setFarewellsCache] = useState<Farewell[]>([]);

  // Load cached farewells from localStorage
  useEffect(() => {
    setMounted(true);
    const cached = localStorage.getItem("farewells-cache");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 10 * 60 * 1000) {
        setFarewellsCache(parsed.data);
      } else localStorage.removeItem("farewells-cache");
    }

    const savedActiveId = localStorage.getItem("active_farewell_id");
    if (savedActiveId && parsedFarewells(parsedFarewells)?.length) {
      const found = parsedFarewells(parsedFarewells).find(
        (f) => f.id === Number(savedActiveId)
      );
      if (found) setActiveFarewell(found);
    }
  }, []);

  const parsedFarewells = (f: any) => (Array.isArray(f) ? f : []);

  // SWR for real-time updates + revalidation
  const { data, isValidating } = useSWR("farewells", fetchFarewells, {
    fallbackData: farewellsCache.length ? farewellsCache : undefined,
    revalidateOnFocus: true,
    dedupingInterval: 10 * 60 * 1000,
  });

  const farewells = data || farewellsCache;

  // Persist cache on updates
  useEffect(() => {
    if (farewells && farewells.length) {
      localStorage.setItem(
        "farewells-cache",
        JSON.stringify({ data: farewells, timestamp: Date.now() })
      );
    }
  }, [farewells]);

  // Save active farewell in localStorage
  const handleFarewellSelect = (farewell: Farewell) => {
    setActiveFarewell(farewell);
    localStorage.setItem("active_farewell_id", farewell.id.toString());
  };

  const isLoading = !farewells || (isValidating && farewells.length === 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="h-14 flex items-center justify-between px-4 sm:px-6 border-b bg-background/95 backdrop-blur-sm">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={toggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Farewell switcher */}
          {isLoading ? (
            <Skeleton className="h-8 w-40 rounded-md" />
          ) : farewells.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 font-medium"
                >
                  {activeFarewell?.name || farewells[0].name}
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {farewells.map((f) => (
                  <DropdownMenuItem
                    key={f.id}
                    onClick={() => handleFarewellSelect(f)}
                    className={`cursor-pointer ${
                      activeFarewell?.id === f.id
                        ? "bg-muted text-foreground"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{f.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {f.event_year} • {f.organizing_class ?? "General"}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-sm text-muted-foreground">
              No farewells found
            </span>
          )}

          {/* Desktop Search */}
          <div className="hidden md:block ml-4 w-72">
            <SearchBar />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggler />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSearchOpen((s) => !s)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <NotificationDropdown />
          <ProfileDropdown user={user} email={email} />
        </div>
      </nav>

      {/* Mobile Search */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-background border-b px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search memories, people..." className="h-9" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
