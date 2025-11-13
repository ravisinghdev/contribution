"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Reusable input component
interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  name: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ id, label, ...props }) => (
  <div className="grid gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} {...props} />
  </div>
);

export function AuthForm() {
  const router = useRouter();
  const supabase = createClient();

  // --- State ---
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  // --- Handlers ---
  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignInLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (error) toast.error(error.message);
      else {
        toast.success("Logged in successfully!");
        router.refresh();
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignUpLoading(true);

    try {
      if (signUpData.password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        setSignUpLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.fullName,
            username: signUpData.username,
          },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) toast.error(error.message);
      else {
        toast.success("Check your email for confirmation link!");
        router.push(
          `/auth/check-email?email=${encodeURIComponent(signUpData.email)}`
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${location.origin}/auth/callback` },
      });
      if (error) toast.error(error.message);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  // --- Input Change Handlers ---
  const handleSignInChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSignInData({ ...signInData, [e.target.name]: e.target.value });

  const handleSignUpChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Login / Sign Up</CardTitle>
        <CardDescription>
          Enter your credentials or sign up for a new account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In */}
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <div className="grid gap-4 mt-4">
                <AuthInput
                  id="email-signin"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={signInData.email}
                  onChange={handleSignInChange}
                />
                <AuthInput
                  id="password-signin"
                  name="password"
                  label="Password"
                  type="password"
                  required
                  value={signInData.password}
                  onChange={handleSignInChange}
                />
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={signInLoading}
                >
                  {signInLoading && <Spinner />}
                  {signInLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Sign Up */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <div className="grid gap-4 mt-4">
                <AuthInput
                  id="full_name-signup"
                  name="fullName"
                  label="Full Name"
                  type="text"
                  placeholder="Your Name"
                  required
                  value={signUpData.fullName}
                  onChange={handleSignUpChange}
                />
                <AuthInput
                  id="username-signup"
                  name="username"
                  label="Username"
                  placeholder="your_name_123"
                  required
                  value={signUpData.username}
                  onChange={handleSignUpChange}
                />
                <AuthInput
                  id="email-signup"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                />
                <AuthInput
                  id="password-signup"
                  name="password"
                  label="Password (min. 6 chars)"
                  type="password"
                  required
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                />
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={signUpLoading}
                >
                  {signUpLoading && <Spinner />}
                  {signUpLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        {/* Divider */}
        <div className="flex items-center my-4">
          <span className="flex-1 border-t border-gray-300" />
          <span className="px-3 text-gray-500 uppercase text-xs">
            Or continue with
          </span>
          <span className="flex-1 border-t border-gray-300" />
        </div>

        {/* Google */}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </Button>
      </CardContent>
    </Card>
  );
}
