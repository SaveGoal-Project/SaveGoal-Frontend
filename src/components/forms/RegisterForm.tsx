"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/src/domains/auth/auth.validators";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/contexts/AuthContext";
import { usePhoneVerification } from "@/src/domains/auth/auth.hooks";
import { RegisterRequest } from "@/src/domains/auth/auth.types";

type AccountType = "buyer" | "merchant";

interface RegisterFormProps {
  accountType: AccountType;
  onAccountTypeChange: (type: AccountType) => void;
}

export function RegisterForm({ accountType, onAccountTypeChange }: RegisterFormProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const { register, isLoading, error, clearError } = useAuth();
  const {
    isLoading: isVerifying,
    isCodeSent,
    isVerified,
    sendVerificationCode,
    error: verificationError,
  } = usePhoneVerification();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      terms: false,
    },
    mode: "onChange",
  });

  const { trigger, watch, getValues } = form;
  const password = watch("password", "");

  const handleVerifyPhone = async () => {
    const phone = getValues("phoneNumber");
    if (!phone) {
      form.setError("phoneNumber", { message: "Please enter a phone number" });
      return;
    }
    try {
      await sendVerificationCode(phone);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleContinue = async () => {
    const valid = await trigger(["firstName", "lastName", "phoneNumber", "email"]);
    if (valid) {
      setStep(2);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    clearError();

    try {
      const registerData: RegisterRequest = {
        phone: data.phoneNumber,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      await register(registerData);
      // Redirect is handled in AuthContext
    } catch (err) {
      // Error is already handled in AuthContext
      console.error("Registration failed:", err);
    }
  };

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-2 text-sm">
      <div
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full border",
          met
            ? "border-[#2c3466] bg-transparent text-[#2c3466]"
            : "border-gray-300 bg-transparent text-transparent"
        )}
      >
        {met && <Check className="h-2.5 w-2.5" />}
      </div>
      <span className={cn(met ? "text-[#2c3466] font-medium" : "text-gray-500")}>
        {text}
      </span>
    </div>
  );

  // Step Indicator Component
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-8 mb-8">
      {[1, 2].map((s) => (
        <div key={s} className="flex flex-col items-center">
          <div
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
              step === s
                ? "border-[#2C3466] bg-[#2C3466]"
                : step > s
                ? "border-[#2C3466] bg-transparent"
                : "border-gray-300 bg-transparent"
            )}
          >
            {step === s && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <span className={cn(
            "text-sm mt-1",
            step === s ? "text-gray-900 font-medium" : "text-gray-400"
          )}>
            Step {s}
          </span>
        </div>
      ))}
    </div>
  );

  // Account Type Tabs
  const AccountTypeTabs = () => (
    <div className="flex gap-6 mb-6">
      <button
        type="button"
        onClick={() => onAccountTypeChange("buyer")}
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
        onClick={() => onAccountTypeChange("merchant")}
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
  );

  return (
    <div className="w-full max-w-[550px] space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
        <p className="text-gray-400 text-sm">
          {step === 1
            ? "Let's get you started with SaveGoal"
            : "Set a strong password"}
        </p>
      </div>

      {/* Account Type Tabs */}
      <div className="flex justify-center">
        <AccountTypeTabs />
      </div>

      {/* Step Indicator */}
      <StepIndicator />

      {/* Step Title */}
      <h2 className="text-xl font-semibold text-gray-900 text-center">
        {step === 1 ? "Basic Information" : "Secure Your Account"}
      </h2>

      {/* Error Alert */}
      {(error || verificationError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error || verificationError}
        </div>
      )}

      {/* Phone Verification Success */}
      {isVerified && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          Phone number verified successfully!
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Kofi"
                          className="h-12 border-gray-200"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mensah"
                          className="h-12 border-gray-200"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex gap-3">
                        <Input
                          placeholder="+233 2000 765 54"
                          className="h-12 border-gray-200 flex-1"
                          disabled={isLoading || isVerifying}
                          {...field}
                        />
                        <Button
                          type="button"
                          onClick={handleVerifyPhone}
                          disabled={isVerifying || isVerified}
                          className={cn(
                            "h-12 px-6 rounded-lg",
                            isVerified
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-[#2C3466] hover:bg-[#222E76]",
                            "text-white"
                          )}
                        >
                          {isVerifying ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isVerified ? (
                            <Check className="h-4 w-4" />
                          ) : isCodeSent ? (
                            "Resend"
                          ) : (
                            "Verify"
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Kofi@example.com"
                        className="h-12 border-gray-200"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={handleContinue}
                disabled={isLoading}
                className="w-full h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Create Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          className="h-12 pr-12 border-gray-200"
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

              <div className="grid grid-cols-2 gap-3">
                <PasswordRequirement met={hasMinLength} text="At least 8 characters" />
                <PasswordRequirement met={hasUpper} text="One uppercase letter" />
                <PasswordRequirement met={hasNumber} text="One number" />
                <PasswordRequirement met={hasSpecial} text="One special character" />
              </div>

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="leading-none">
                      <FormLabel className="font-normal text-gray-500 text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="font-semibold text-[#2C3466]">
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="font-semibold text-[#2C3466]">
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="flex-1 h-14 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-14 bg-[#2C3466] hover:bg-[#222E76] text-white font-semibold rounded-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>

      {/* Sign In link */}
      <div className="text-center text-gray-500 text-sm pt-2">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#2C3466] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
