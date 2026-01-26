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
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

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

  const { trigger, watch } = form;
  const password = watch("password", "");

  const handleContinue = async () => {
    const valid = await trigger(["firstName", "lastName", "phoneNumber", "email"]);
    if (valid) {
      setStep(2);
    }
  };

  const onSubmit = (data: RegisterFormData) => {
    console.log("Form Submitted:", data);
    // submission logic will be handled here
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
          "flex h-5 w-5 items-center justify-center rounded-full border",
          met
            ? "border-[#2c3466] bg-transparent text-[#2c3466]"
            : "border-gray-300 bg-transparent text-transparent"
        )}
      >
        {met && <Check className="h-3 w-3" />}
      </div>
      <span className={cn(met ? "text-[#2c3466] font-medium" : "text-gray-500")}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-[550px] space-y-15">
      <div className="text-left space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          {step === 1 ? "Create Your Account" : "Secure Your Account"}
        </h1>
        <p className="text-gray-500 text-lg">
          {step === 1
            ? "Let’s get you started with SaveGoal"
            : "Set a strong password"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Kofi" {...field} />
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Mensah" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+233 2000 765 54" {...field} />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Kofi@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={handleContinue}
                className="w-full h-12 bg-gradient-to-r from-[#222E76] to-[#4556C0] text-white text-lg font-bold rounded-xl"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Create Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="..........."
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

              <div className="grid grid-cols-2 gap-4">
                <PasswordRequirement met={hasMinLength} text="At least 8 characters" />
                <PasswordRequirement met={hasUpper} text="One uppercase letter" />
                <PasswordRequirement met={hasNumber} text="One number" />
                <PasswordRequirement met={hasSpecial} text="One special character" />
              </div>

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-none border-none">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-gray-500">
                        I agree to the <span className="font-semibold text-[#2C3466]">Terms and Conditions</span> and <span className="font-semibold text-[#2C3466]">Privacy Policy</span>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3 h-12 border-[#2C3466] text-[#2C3466] font-bold rounded-xl hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-2/3 h-12 bg-gradient-to-r from-[#222E76] to-[#4556C0] text-white text-lg font-bold rounded-xl"
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>

      <div className="text-center text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#2C3466]">
          Sign In
        </Link>
      </div>
    </div>
  );
}

