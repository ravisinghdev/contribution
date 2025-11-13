"use client";

import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check, Loader2, PartyPopper } from "lucide-react";
import { switchFarewell } from "@/app/dashboard/actions";
import type { Farewell } from "@/app/dashboard/layout";

interface FarewellSwitcherProps {
  allFarewells: Farewell[];
  activeFarewell?: Farewell; // 👈 made optional to prevent undefined errors
}

export function FarewellSwitcher({
  allFarewells,
  activeFarewell,
}: FarewellSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (farewellId: string) => {
    startTransition(() => {
      switchFarewell(farewellId);
    });
  };

  // 👇 handle empty or undefined activeFarewell
  const currentFarewell = activeFarewell ?? allFarewells[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-lg font-semibold px-2"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PartyPopper className="h-5 w-5 text-pink-400" />
          )}
          <span className="truncate max-w-[200px]">
            {currentFarewell ? currentFarewell.name : "Select Farewell"}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Select Farewell</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allFarewells.length > 0 ? (
          allFarewells.map((farewell) => (
            <DropdownMenuItem
              key={farewell.id}
              disabled={isPending}
              onSelect={() => handleSwitch(farewell.id.toString())}
              className="flex justify-between"
            >
              <div>
                <p className="font-medium">{farewell.name}</p>
                <p className="text-xs text-muted-foreground">
                  {farewell.event_year}
                </p>
              </div>
              {currentFarewell &&
                farewell.id === currentFarewell.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No farewells found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
