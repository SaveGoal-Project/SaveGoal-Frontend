"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/contexts/AuthContext";
import { LoginRequest } from "@/src/domains/auth/auth.types";

const loginSchema = z.object({
  phoneOrEmail: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type AccountType = "buyer" | "merchant";

export function LoginForm() {
  const [accountType, setAccountType] = useState<AccountType>("buyer");
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading, error, clearError } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneOrEmail: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    
    try {
      const loginData: LoginRequest = {
        phoneOrEmail: data.phoneOrEmail,
        password: data.password,
      };
      
      await login(loginData);
      // Redirect is handled in AuthContext based on user role
    } catch (err) {
      // Error is already handled in AuthContext and stored in error state
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="w-full max-w-[420px] space-y-8">
      {/* Back to home link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      {/* Header */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>

        {/* Account Type Tabs */}
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setAccountType("buyer")}
            className={cn(
              "pb-2 text-base font-medium transition-all border-b-2",
              accountType === "buyer"
                ? "text-gray-900 border-gray-900"
                : "text-gray-500 border-transparent hover:text-gray-700"
            )}
          >
            Buyer account
          </button>
          <button
            type="button"
            onClick={() => setAccountType("merchant")}
            className={cn(
              "pb-2 text-base font-medium transition-all border-b-2",
              accountType === "merchant"
                ? "text-gray-900 border-gray-900"
                : "text-gray-500 border-transparent hover:text-gray-700"
            )}
          >
            Merchant account
          </button>
        </div>

        {/* Sign in with email text */}
        <p className="text-gray-400 text-sm">Sign in with email or phone</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phoneOrEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Email or Phone</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="example@gmail.com or +233501234567"
                    className="h-12 border-gray-200 bg-white placeholder:text-gray-400 focus:border-[#2C3466] focus:ring-[#2C3466]"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="h-12 pr-12 border-gray-200 bg-white placeholder:text-gray-400 focus:border-[#2C3466] focus:ring-[#2C3466]"
                      disabled={isLoading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forgot password link */}
          <div className="text-center">
            <span className="text-gray-500 text-sm">Forgot your password? </span>
            <Link
              href="/forgot-password"
              className="text-[#2C3466] text-sm font-semibold hover:underline"
            >
              Click here
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>

      {/* Sign up link */}
      <div className="text-center text-gray-500 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#2C3466] hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
