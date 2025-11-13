"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleRegister = async () => {
    if (!email || !name || !password || !confirmPassword)
      return toast.error("Please fill in all fields!");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match!");

    setLoading(true);
    try {
      await axios.post("/api/auth/register", {
        email,
        password,
        metadata: { name }, // You can add more user metadata here
      });
      toast.success("Registration successful! Please verify your email.");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Register
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </Button>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-gray-300 dark:border-gray-600"
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-gray-300 dark:border-gray-600"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-gray-300 dark:border-gray-600"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-gray-300 dark:border-gray-600"
          />
        </div>

        <Button
          className="mt-6 w-full py-3 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <span
            className="text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
