"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, Plus, Check, ChevronDown } from "lucide-react";
import { createFarewellAction, joinFarewellAction } from "../actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const MIN_FAREWELL_NAME_LENGTH = 5;

interface ActionResult {
  error?: string;
  data?: any;
  success?: boolean;
  id?: number;
}

interface Farewell {
  id: string;
  name: string;
  event_year: number;
  invite_code: string;
  organizing_class?: string | null;
}

// --- Reusable Form Field ---
interface FormFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, ...props }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} {...props} />
  </div>
);

export default function WelcomePage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingState, setLoadingState] = useState({
    create: false,
    join: false,
  });

  const [farewellName, setFarewellName] = useState("");
  const [farewellYear, setFarewellYear] = useState(
    new Date().getFullYear() + 1
  );

  const [availableFarewells, setAvailableFarewells] = useState<Farewell[]>([]);
  const [selectedFarewell, setSelectedFarewell] = useState<Farewell | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // --- Redirect if user already in a farewell ---
  useEffect(() => {
    const checkUserFarewells = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/auth");
        return;
      }

      const { count } = await supabase
        .from("farewell_participants")
        .select("id", { count: "exact" })
        .eq("user_id", user.id);

      if (count && count > 0) {
        router.push("/dashboard");
      } else {
        setIsLoading(false);
      }
    };

    checkUserFarewells();
  }, [supabase, router]);

  // --- Fetch Farewells ---
  useEffect(() => {
    const fetchFarewells = async () => {
      const { data, error } = await supabase
        .from("farewells")
        .select("id, name, event_year, invite_code, organizing_class")
        .order("event_year", { ascending: true });

      if (error) {
        console.error("Error fetching farewells:", error);
        toast.error("Failed to fetch farewells.");
        return;
      }

      console.log("✅ Fetched Farewells:", data);
      setAvailableFarewells(data || []);
    };

    fetchFarewells();
  }, [supabase]);

  useEffect(() => {
    console.log("🎯 Selected Farewell Updated:", selectedFarewell);
  }, [selectedFarewell]);

  // --- Create Farewell Handler ---
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (farewellName.trim().length < MIN_FAREWELL_NAME_LENGTH) {
      toast.error(
        `Farewell name must be at least ${MIN_FAREWELL_NAME_LENGTH} characters long.`
      );
      return;
    }

    setLoadingState((prev) => ({ ...prev, create: true }));

    const result: ActionResult = await createFarewellAction(
      farewellName,
      farewellYear
    );

    setLoadingState((prev) => ({ ...prev, create: false }));

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Farewell created successfully!");
      router.push("/dashboard");
    }
  };

  // --- Join Farewell Handler (Corrected) ---
  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFarewell) {
      toast.error("Please select a farewell to join.");
      return;
    }

    if (!selectedFarewell.invite_code) {
      toast.error("Selected farewell has no invite code!");
      console.error("🚨 Missing invite code:", selectedFarewell);
      return;
    }

    console.log("🚀 Sending invite code:", selectedFarewell.invite_code);

    setLoadingState((prev) => ({ ...prev, join: true }));

    const result: ActionResult = await joinFarewellAction(
      selectedFarewell.invite_code
    );

    console.log("✅ joinFarewellAction result:", result);

    setLoadingState((prev) => ({ ...prev, join: false }));

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Successfully joined farewell! Redirecting...");
      router.push("/dashboard");
    }
  };

  const filteredFarewells = searchQuery
    ? availableFarewells.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableFarewells;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <Card className="w-full max-w-md shadow-lg border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Welcome to the Farewell App
          </CardTitle>
          <CardDescription className="text-center pt-2 text-muted-foreground">
            You aren&apos;t part of a farewell event yet.
            <br />
            Join an existing one or create a new one to get started.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="join">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="join">
                <Users className="w-4 h-4 mr-2" /> Join Farewell
              </TabsTrigger>
              <TabsTrigger value="create">
                <Plus className="w-4 h-4 mr-2" /> Create New
              </TabsTrigger>
            </TabsList>

            {/* --- JOIN TAB --- */}
            <TabsContent value="join">
              <form onSubmit={handleJoin} className="space-y-4 pt-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedFarewell
                        ? `${selectedFarewell.name} (${selectedFarewell.event_year})`
                        : "Select Farewell"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search farewells..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                      />
                      <CommandEmpty>No farewells found.</CommandEmpty>

                      <CommandGroup>
                        {filteredFarewells.map((f) => (
                          <CommandItem
                            key={f.id}
                            onSelect={() => {
                              setSelectedFarewell(f);
                              setSearchQuery("");
                            }}
                          >
                            {f.name} ({f.event_year})
                            {selectedFarewell?.id === f.id && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedFarewell && (
                  <div className="text-sm text-muted-foreground text-center mt-1">
                    Invite Code:{" "}
                    <span className="font-mono">
                      {selectedFarewell.invite_code}
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loadingState.join || !selectedFarewell}
                >
                  {loadingState.join && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  {loadingState.join ? "Joining..." : "Join Event"}
                </Button>
              </form>
            </TabsContent>

            {/* --- CREATE TAB --- */}
            <TabsContent value="create">
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <FormField
                  id="farewell-name"
                  label="Farewell Name"
                  value={farewellName}
                  onChange={(e) => setFarewellName(e.target.value)}
                  placeholder="e.g., Farewell for Class of 2025"
                />
                <FormField
                  id="farewell-year"
                  label="Event Year"
                  type="number"
                  value={farewellYear}
                  onChange={(e) =>
                    setFarewellYear(
                      Number(e.target.value) || new Date().getFullYear() + 1
                    )
                  }
                  placeholder="e.g., 2025"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loadingState.create}
                >
                  {loadingState.create && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  {loadingState.create ? "Creating..." : "Create Event"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
