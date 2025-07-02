// src/components/login-form.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/lib/api/auth";
import { LogIn } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const login = useLogin();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login.mutate(
      { email },
      {
        onSuccess: () => {
          // navigate into your protected app
          router.push("/");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your approved email below to login
        </p>
      </div>

      <div className="grid gap-6">
        {/* Email input */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g. jerryhuang@college.harvard.edu"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Error message */}
        {login.isError && (
          <p className="text-red-600 text-sm">
            {(login.error as Error).message}
          </p>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full border bg-purple-900/30 border-purple-600 text-white hover:bg-purple-700/40 hover: hover:border-purple-400 transition-colors flex items-center justify-center gap-2 font-semibold py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={login.isPending}
        >
          {login.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Logging in…</span>
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
