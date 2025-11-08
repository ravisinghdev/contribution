"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSidebar } from "./SidebarContext";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { motion, AnimatePresence } from "framer-motion";
import ExpDropdown from "./ExpDropdown";
import { ThemeToggler } from "@/components/theme/ThemeToggler";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { toggle } = useSidebar();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // simple mount guard for any client-only libs
  useEffect(() => setMounted(true), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="h-14 flex items-center justify-between px-4 sm:px-6 bg-background/95 backdrop-blur border-b">
        {/* left: menu + brand */}
        <div className="flex items-center gap-3">
          {/* mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={toggle}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/"
            className="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition-opacity"
          >
            NEET&nbsp;OS
          </Link>

          {/* desktop inline search */}
          <div className="hidden md:flex items-center ml-6 relative w-72">
            <SearchBar />
          </div>
        </div>

        {/* right: actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* small inline gamified items (hide on very small screens) */}
          <div className="hidden sm:flex items-center gap-3">
            <ExpDropdown />
            <ThemeToggler />
          </div>

          {/* mobile search toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobileSearchOpen((s) => !s)}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notification & Profile components */}
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </nav>

      {/* mobile search dropdown */}
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
              <Input
                aria-label="Mobile search"
                placeholder="Search topics, questions..."
                className="h-9"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
