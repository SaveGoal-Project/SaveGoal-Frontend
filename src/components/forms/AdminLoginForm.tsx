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
import { Checkbox } from "@/src/components/ui/checkbox";
import { Eye, EyeOff, Shield, Mail, Lock, Loader2 } from "lucide-react";
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
    <div className="w-full max-w-[420px] space-y-8">
      {/* Header with logo */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[#2C3466] flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SaveGoal Admin</span>
        </div>
        <p className="text-sm text-gray-500">
          Secure access to your admin dashboard
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Sign In to Dashboard</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="admin@savegoal.com"
                      className={cn(
                        "h-12 pl-10 pr-4 border-gray-200 bg-white",
                        "placeholder:text-gray-400 focus:border-[#2C3466] focus:ring-[#2C3466]"
                      )}
                      disabled={isLoading}
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
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={cn(
                        "h-12 pl-10 pr-12 border-gray-200 bg-white",
                        "placeholder:text-gray-400 focus:border-[#2C3466] focus:ring-[#2C3466]"
                      )}
                      disabled={isLoading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormLabel className="text-sm text-gray-600 font-normal cursor-pointer">
                    Remember Me
                  </FormLabel>
                </FormItem>
              )}
            />
            <a
              href="/admin/forgot-password"
              className="text-sm text-[#2C3466] font-medium hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </Button>
        </form>
      </Form>

      <div className="pt-4 space-y-4">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-700">Security Notice:</strong> All
          activity on this dashboard is monitored and logged for compliance and
          security purposes.
        </p>
        <p className="text-xs text-gray-400 text-center">
          © 2026 SaveGoal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
