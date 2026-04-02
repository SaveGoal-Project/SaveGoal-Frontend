"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
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
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";
import { cn } from "@/src/lib/utils";

const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { adminLogin, isLoading, error, clearError } = useAuth();

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    clearError();
    try {
      await adminLogin({ email: data.email, password: data.password });
    } catch (err) {
      console.error("Admin login failed:", err);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="space-y-5">
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              SaveGoal Admin
            </p>
            <p className="text-sm font-medium text-slate-950">
              Restricted access portal
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Sign in to the dashboard
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Use your admin email and password to continue to the platform
            control center.
          </p>
        </div>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50 text-red-700 [&>svg]:text-red-700"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-slate-800">
                  Email address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="admin@savegoal.com"
                      className={cn(
                        "h-12 rounded-xl border-slate-200 bg-slate-50 pl-10 pr-4",
                        "placeholder:text-slate-400 focus-visible:border-slate-950 focus-visible:ring-slate-950/20"
                      )}
                      disabled={isLoading}
                      autoComplete="email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <FormLabel className="text-sm font-medium text-slate-800">
                    Password
                  </FormLabel>
                  <Link
                    href="/admin/forgot-password"
                    className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={cn(
                        "h-12 rounded-xl border-slate-200 bg-slate-50 pl-10 pr-12",
                        "placeholder:text-slate-400 focus-visible:border-slate-950 focus-visible:ring-slate-950/20"
                      )}
                      disabled={isLoading}
                      autoComplete="current-password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                      disabled={isLoading}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer text-sm font-normal text-slate-700">
                    Keep me signed in on this device
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-slate-950 text-base font-semibold text-white hover:bg-slate-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Continue to admin dashboard"
            )}
          </Button>
        </form>
      </Form>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">Security notice</p>
        <p className="mt-2 leading-6">
          Access is restricted to approved staff accounts. Sign-in activity may
          be logged for audit, security, and incident response purposes.
        </p>
      </div>

      <p className="text-center text-xs text-slate-500">
        Copyright 2026 SaveGoal. Protected admin access.
      </p>
    </div>
  );
}
