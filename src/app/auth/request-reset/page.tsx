"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RequestResetPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestReset = async () => {
    if (!email) return toast.error("Please enter your email!");
    setLoading(true);
    try {
      await axios.post("/api/auth/request-reset", { email });
      toast.success("Check your email for reset link!");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to request reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Reset Password
        </h1>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 border-gray-300 dark:border-gray-600"
        />
        <Button
          className="w-full"
          onClick={handleRequestReset}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </div>
    </div>
  );
}
