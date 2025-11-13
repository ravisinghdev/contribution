"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Bell,
  CalendarDays,
  Star,
  MessageSquare,
  Mail,
  Image,
  Brush,
  BookOpen,
  Users,
  GraduationCap,
  User,
  UserCircle,
  PartyPopper,
  ClipboardList,
  Music,
  Palette,
  Quote,
  Film,
  Gift,
  Heart,
  ClipboardCheck,
  ListChecks,
  Wallet,
  Shield,
  LayoutTemplate,
  Music2,
  Download,
  MessageSquareHeart,
  LifeBuoy,
  Info,
  ChevronDown,
  Search,
  Sun,
  Moon,
  PiggyBank,
  Plus,
  Settings,
  Activity,
  FolderClock,
  ReceiptText,
  Trophy,
  LineChart,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Your custom routes, all defined here
export const navGroups = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Home", icon: Home },
      { href: "/dashboard/announcements", label: "Announcements", icon: Bell },
      {
        href: "/dashboard/timeline",
        label: "Farewell Timeline",
        icon: CalendarDays,
      },
      {
        href: "/dashboard/highlights",
        label: "Highlights & Updates",
        icon: Star,
      },
    ],
  },

  /* ------------------- CONTRIBUTIONS ------------------- */
  {
    title: "Contributions",
    items: [
      {
        href: "/dashboard/contributions",
        label: "Main Dashboard",
        icon: PiggyBank,
      },
      {
        href: "/dashboard/contributions/payment",
        label: "Make Payment",
        icon: Plus,
      },
      {
        href: "/dashboard/contributions/receipt",
        label: "Receipts & Downloads",
        icon: ReceiptText,
      },
      {
        href: "/dashboard/contributions/history",
        label: "Payment History",
        icon: FolderClock,
      },
      {
        href: "/dashboard/contributions/analytics",
        label: "Analytics & Insights",
        icon: LineChart,
      },
      {
        href: "/dashboard/contributions/leaderboard",
        label: "Top Contributors",
        icon: Trophy,
      },
    ],
  },

  /* ------------------- CONNECTIONS ------------------- */
  {
    title: "Connections",
    items: [
      {
        href: "/dashboard/messages",
        label: "Farewell Messages",
        icon: MessageSquare,
      },
      {
        href: "/dashboard/memories",
        label: "Photo & Video Gallery",
        icon: Image,
      },
      { href: "/dashboard/letters", label: "Letters to Seniors", icon: Mail },
      {
        href: "/dashboard/artworks",
        label: "Art & Creative Works",
        icon: Brush,
      },
      {
        href: "/dashboard/yearbook",
        label: "Digital Yearbook",
        icon: BookOpen,
      },
    ],
  },

  /* ------------------- PEOPLE ------------------- */
  {
    title: "People",
    items: [
      {
        href: "/dashboard/students",
        label: "12th Grade Students",
        icon: Users,
      },
      {
        href: "/dashboard/teachers",
        label: "Teachers & Mentors",
        icon: GraduationCap,
      },
      { href: "/dashboard/juniors", label: "Junior Contributors", icon: User },
      { href: "/dashboard/alumni", label: "Alumni Messages", icon: UserCircle },
    ],
  },

  /* ------------------- EVENTS ------------------- */
  {
    title: "Events",
    items: [
      {
        href: "/dashboard/farewell-event",
        label: "Main Farewell Event",
        icon: PartyPopper,
      },
      {
        href: "/dashboard/rehearsals",
        label: "Rehearsals & Planning",
        icon: ClipboardList,
      },
      {
        href: "/dashboard/performances",
        label: "Performances & Acts",
        icon: Music,
      },
      { href: "/dashboard/decor", label: "Decoration & Setup", icon: Palette },
      { href: "/dashboard/tasks", label: "Event Task Board", icon: ListChecks },
    ],
  },

  /* ------------------- LEGACY ------------------- */
  {
    title: "Legacy",
    items: [
      {
        href: "/dashboard/quotes",
        label: "Best Quotes & Memories",
        icon: Quote,
      },
      { href: "/dashboard/farewell-video", label: "Farewell Film", icon: Film },
      { href: "/dashboard/gift-wall", label: "Gift & Wishes Wall", icon: Gift },
      { href: "/dashboard/thankyou", label: "Thank You Notes", icon: Heart },
    ],
  },

  /* ------------------- MANAGEMENT ------------------- */
  {
    title: "Management",
    items: [
      {
        href: "/dashboard/committees",
        label: "Organizing Committees",
        icon: ClipboardCheck,
      },
      { href: "/dashboard/budget", label: "Budget & Expenses", icon: Wallet },
      { href: "/dashboard/permissions", label: "Access & Roles", icon: Shield },
      { href: "/dashboard/settings", label: "Admin Settings", icon: Settings },
      { href: "/dashboard/activity", label: "System Activity", icon: Activity },
    ],
  },

  /* ------------------- RESOURCES ------------------- */
  {
    title: "Resources",
    items: [
      {
        href: "/dashboard/templates",
        label: "Templates & Designs",
        icon: LayoutTemplate,
      },
      {
        href: "/dashboard/music-library",
        label: "Music & Backgrounds",
        icon: Music2,
      },
      { href: "/dashboard/downloads", label: "Downloads", icon: Download },
    ],
  },

  /* ------------------- COMMUNITY ------------------- */
  {
    title: "Community",
    items: [
      {
        href: "/dashboard/feedback",
        label: "Feedback & Suggestions",
        icon: MessageSquareHeart,
      },
      { href: "/dashboard/support", label: "Support Team", icon: LifeBuoy },
      { href: "/dashboard/about", label: "About Farewell Project", icon: Info },
    ],
  },
];

/* ------------------- MAIN SIDEBAR COMPONENT ------------------- */

// Define the props it will receive from the layout
interface SidebarProps {
  user: {
    full_name: string;
    avatar_url: string | null;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  // <-- Accept props
  const { open, close } = useSidebar();

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={close}>
        <SheetContent side="left" className="p-0 w-72">
          <VisuallyHidden>
            <DialogTitle>Mobile Sidebar Navigation</DialogTitle>
          </VisuallyHidden>
          <SidebarContent mobile onClose={close} user={user} />{" "}
          {/* <-- Pass user down */}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex flex-col w-64 fixed top-14 left-0 h-[calc(100vh-3.5rem)] border-r bg-background z-40">
        <SidebarContent user={user} /> {/* <-- Pass user down */}
      </aside>
    </>
  );
}

/* ------------------- SIDEBAR CONTENT ------------------- */

function SidebarContent({
  mobile,
  onClose,
  user,
}: {
  mobile?: boolean;
  onClose?: () => void;
  user: SidebarProps["user"]; // <-- Define prop type
}) {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Search bar */}
      <div className="px-3 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-sm bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {navGroups.map((group) => {
          const filtered = group.items.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase())
          );
          if (filtered.length === 0) return null;

          return (
            <SidebarGroup
              key={group.title}
              title={group.title}
              items={filtered}
              onClose={onClose}
            />
          );
        })}
      </div>

      {/* Pass the user prop down to the footer */}
      <SidebarFooter mobile={mobile} onClose={onClose} user={user} />
    </div>
  );
}

/* ------------------- SIDEBAR GROUP ------------------- */

function SidebarGroup({
  title,
  items,
  onClose,
}: {
  title: string;
  items: { href: string; label: string; icon: any }[];
  onClose?: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname(); // <-- This hook gets the current URL

  return (
    <div className="px-3 mb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
      >
        {title}
        <motion.div
          animate={{ rotate: expanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-1 space-y-1 overflow-hidden"
          >
            {items.map(({ href, label, icon: Icon }) => {
              // This is where the "active state" is handled
              const active = pathname === href;
              return (
                <motion.li key={label} layout>
                  <Link
                    href={href}
                    onClick={() => onClose && onClose()} // This handles mobile close on nav
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 relative",
                      // This conditionally applies your active styles
                      active
                        ? "bg-primary/10 text-primary font-medium border-l-4 border-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active && "text-primary")} />
                    <span>{label}</span>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------- SIDEBAR FOOTER ------------------- */

function SidebarFooter({
  mobile,
  onClose,
  user,
}: {
  mobile?: boolean;
  onClose?: () => void;
  user: SidebarProps["user"]; // <-- Define prop type
}) {
  const { theme, setTheme } = useTheme();

  // Get initials for avatar fallback
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="border-t px-4 py-3 bg-background/80 backdrop-blur-sm">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-purple-400/30 ring-1 ring-border overflow-hidden">
          <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-muted/50 hover:ring-primary transition-all">
            <AvatarImage
              src={user.avatar_url || undefined}
              alt={user.full_name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          {/* Use the real user data passed as a prop */}
          <p className="text-sm font-medium leading-tight">{user.full_name}</p>
          {/* We will fetch/pass the role later */}
          <p className="text-xs text-muted-foreground">Organizer</p>
        </div>
        {mobile && (
          <Button
            size="icon"
            variant="ghost"
            className="ml-auto"
            onClick={onClose}
          >
            ✕
          </Button>
        )}
      </div>

      {/* Theme Switch */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
        >
          {theme === "light" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          Switch Theme
        </button>
        <Link
          href="/dashboard/profile" // <-- Example link
          className="text-[11px] text-primary hover:underline"
        >
          View Profile
        </Link>
      </div>

      {/* Footer Text */}
      <div className="text-[10px] text-center text-muted-foreground mt-2">
        © {new Date().getFullYear()} Farewell Contribution Project
      </div>
    </div>
  );
}
