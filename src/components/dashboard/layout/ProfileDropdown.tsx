"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings, HelpCircle, LogOut, Shield } from "lucide-react";
import Link from "next/link";
// import { useAuth } from '@/context/AuthContext'; // <-- Removed
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client"; // <-- Import Supabase client
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Define the props it will receive from Navbar
interface ProfileDropdownProps {
  user: {
    full_name: string;
    avatar_url: string | null;
  };
  email: string;
}

export default function ProfileDropdown({ user, email }: ProfileDropdownProps) {
  // <-- Accept props
  // const { user, logout } = useAuth(); // <-- Removed
  const router = useRouter();

  // Get initials for avatar fallback
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Could not sign out: " + error.message);
    } else {
      toast.success("Signed out");
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-muted/50 hover:ring-primary transition-all">
          <AvatarImage
            src={user.avatar_url || undefined}
            alt={user.full_name}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-3 py-2">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.avatar_url || undefined}
              alt={user.full_name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{user.full_name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center gap-2">
            <User className="h-4 w-4" /> My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>

        {/* We can hide Billing for this project */}
        {/* <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Billing
          </Link>
        </DropdownMenuItem> */}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Privacy & Security
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" /> Help Center
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {/* Changed this to use our Supabase function */}
          <Button
            onClick={handleSignOut}
            variant={"ghost"}
            className="w-full text-red-600 items-start justify-start flex p-2 h-auto text-sm"
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
