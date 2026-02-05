"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  merchantBasicInfoSchema,
  merchantStoreInfoSchema,
  merchantPasswordSchema,
  MerchantBasicInfoData,
  MerchantStoreInfoData,
  MerchantPasswordData,
  ghanaRegions,
  ghanaCities,
  merchantCategories,
} from "@/src/domains/auth/auth.validators";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Check, Eye, EyeOff, ShieldCheck, Upload, Camera, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/contexts/AuthContext";
import { useMerchantVerification, usePhoneVerification } from "@/src/domains/auth/auth.hooks";
import { MerchantRegisterRequest } from "@/src/domains/auth/auth.types";

type AccountType = "buyer" | "merchant";

interface MerchantRegisterFormProps {
  accountType: AccountType;
  onAccountTypeChange: (type: AccountType) => void;
}

const idTypes = [
  "Ghana card",
  "Passport",
  "Voter's ID",
  "Driver's License",
] as const;

export function MerchantRegisterForm({ accountType, onAccountTypeChange }: MerchantRegisterFormProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [basicInfo, setBasicInfo] = useState<MerchantBasicInfoData | null>(null);
  const [storeInfo, setStoreInfo] = useState<MerchantStoreInfoData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  
  // Auth hooks
  const { registerMerchant, isLoading: isRegistering, error: authError, clearError } = useAuth();
  const {
    isLoading: isVerifyingPhone,
    isCodeSent,
    isVerified: isPhoneVerified,
    sendVerificationCode,
    error: phoneVerificationError,
  } = usePhoneVerification();
  const {
    isLoading: isUploadingFiles,
    uploadFrontId,
    uploadBackId,
    uploadSelfieImage,
    submitVerification,
    error: verificationError,
  } = useMerchantVerification();
  
  // Verification state
  const [idType, setIdType] = useState<string>("");
  const [idNumber, setIdNumber] = useState<string>("");
  const [frontIdImage, setFrontIdImage] = useState<string | null>(null);
  const [backIdImage, setBackIdImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  
  const frontIdInputRef = useRef<HTMLInputElement>(null);
  const backIdInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  
  // Combined loading state
  const isLoading = isRegistering || isUploadingFiles;

  // Step 1: Basic Information form
  const basicInfoForm = useForm<MerchantBasicInfoData>({
    resolver: zodResolver(merchantBasicInfoSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
    mode: "onChange",
  });

  // Step 2: Store Information form
  const storeInfoForm = useForm<MerchantStoreInfoData>({
    resolver: zodResolver(merchantStoreInfoSchema),
    defaultValues: {
      storeName: "",
      category: "",
      description: "",
      region: "",
      city: "",
      closestLandmark: "",
    },
    mode: "onChange",
  });

  // Step 3: Password form
  const passwordForm = useForm<MerchantPasswordData>({
    resolver: zodResolver(merchantPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      terms: false,
    },
    mode: "onChange",
  });

  const password = passwordForm.watch("password", "");

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const handleStep1Continue = async (data: MerchantBasicInfoData) => {
    setBasicInfo(data);
    setStep(2);
  };

  const handleStep2Continue = async (data: MerchantStoreInfoData) => {
    setStoreInfo(data);
    setStep(3);
  };

  const handleStep3Continue = async (data: MerchantPasswordData) => {
    setStep(4);
  };

  const handleStartVerification = () => {
    setStep(5);
  };

  const handleContinueToSelfie = () => {
    if (idType && idNumber && frontIdImage && backIdImage) {
      setStep(6);
    }
  };

  const handleSubmitVerification = async () => {
    if (!basicInfo || !storeInfo) return;
    
    clearError();

    try {
      // First, register the merchant account
      const registerData: MerchantRegisterRequest = {
        fullName: basicInfo.fullName,
        phone: basicInfo.phoneNumber,
        email: basicInfo.email,
        address: basicInfo.address,
        storeName: storeInfo.storeName,
        category: storeInfo.category,
        description: storeInfo.description,
        region: storeInfo.region,
        city: storeInfo.city,
        closestLandmark: storeInfo.closestLandmark,
        password: passwordForm.getValues("password"),
      };

      await registerMerchant(registerData);

      // Then submit verification documents (after successful registration)
      if (frontIdImage && backIdImage && selfieImage) {
        await submitVerification({
          idType,
          idNumber,
        });
      }
      
      // Redirect is handled in AuthContext
    } catch (err) {
      // Error is already handled in AuthContext
      console.error("Merchant registration failed:", err);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (image: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
  const StepIndicator = () => {
    const displayStep = step <= 4 ? step : step === 5 || step === 6 ? 3 : step;
    return (
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex flex-col items-center">
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                (step <= 4 && step === s) || (step > 4 && s === 3)
                  ? "border-[#2C3466] bg-[#2C3466]"
                  : (step <= 4 && step > s) || (step > 4 && s < 3)
                  ? "border-[#2C3466] bg-transparent"
                  : "border-gray-300 bg-transparent"
              )}
            >
              {((step <= 4 && step === s) || (step > 4 && s === 3)) && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <span className={cn(
              "text-sm mt-1",
              (step <= 4 && step === s) || (step > 4 && s === 3)
                ? "text-gray-900 font-medium"
                : "text-gray-400"
            )}>
              Step {s}
            </span>
          </div>
        ))}
      </div>
    );
  };

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

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Basic Information";
      case 2: return "Store Information";
      case 3: return "Basic Information";
      case 4: return "Identity Verification";
      case 5: return "Government ID Verification";
      case 6: return "Take a Selfie";
      default: return "";
    }
  };

  // Upload Zone Component
  const UploadZone = ({ 
    label, 
    image, 
    inputRef, 
    onUpload 
  }: { 
    label: string; 
    image: string | null; 
    inputRef: React.RefObject<HTMLInputElement | null>;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all hover:border-[#2C3466] hover:bg-gray-50",
          image ? "border-[#2C3466] bg-gray-50" : "border-gray-200"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
        {image ? (
          <div className="relative w-full h-32">
            <Image
              src={image}
              alt={label}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="w-8 h-8 text-gray-400 mb-3" />
            <p className="text-gray-700 font-medium">Click to upload {label.toLowerCase()}</p>
            <p className="text-gray-400 text-sm">PNG, JPG up to 5 MB</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[550px] space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Create Your Merchant Account</h1>
        {step === 1 && (
          <p className="text-gray-400 text-sm">Let&apos;s get you started with SaveGoal</p>
        )}
        {step === 3 && (
          <p className="text-gray-400 text-sm">Set a strong password</p>
        )}
        {step === 5 && (
          <p className="text-gray-400 text-sm">Upload a clear photo or scan of your valid government-issued ID</p>
        )}
        {step === 6 && (
          <p className="text-gray-400 text-sm">We need to confirm that you&apos;re the person on the ID. Take a clear selfie of your face.</p>
        )}
      </div>

      {/* Account Type Tabs */}
      <div className="flex justify-center">
        <AccountTypeTabs />
      </div>

      {/* Step Indicator */}
      <StepIndicator />

      {/* Step Title */}
      <h2 className="text-xl font-semibold text-gray-900 text-center">{getStepTitle()}</h2>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <Form {...basicInfoForm}>
          <form onSubmit={basicInfoForm.handleSubmit(handleStep1Continue)} className="space-y-5">
            <FormField
              control={basicInfoForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      className="h-12 border-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={basicInfoForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Phone Number</FormLabel>
                  <FormControl>
                    <div className="flex gap-3">
                      <Input
                        placeholder="+233 2000 765 54"
                        className="h-12 border-gray-200 flex-1"
                        {...field}
                      />
                      <Button
                        type="button"
                        className="h-12 px-6 bg-[#2C3466] hover:bg-[#222E76] text-white rounded-lg"
                      >
                        Verify
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={basicInfoForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      className="h-12 border-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={basicInfoForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CA5500 Cowpea Street"
                      className="h-12 border-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl"
            >
              Continue
            </Button>
          </form>
        </Form>
      )}

      {/* Step 2: Store Information */}
      {step === 2 && (
        <Form {...storeInfoForm}>
          <form onSubmit={storeInfoForm.handleSubmit(handleStep2Continue)} className="space-y-5">
            <FormField
              control={storeInfoForm.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Store Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg. Pearl's Apparrel"
                      className="h-12 border-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={storeInfoForm.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 border-gray-200 bg-white">
                        <SelectValue placeholder="Fashion" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {merchantCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={storeInfoForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="At Pearl's Apparrel you get any clothing combo of your choice from men's clothing to women's clothing whatever you may need, i have got you covered"
                      className="min-h-[100px] border-gray-200 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={storeInfoForm.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Region</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedRegion(value);
                        storeInfoForm.setValue("city", "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 border-gray-200 bg-white">
                          <SelectValue placeholder="Greater Accra" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ghanaRegions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={storeInfoForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 border-gray-200 bg-white">
                          <SelectValue placeholder="Tema" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(ghanaCities[selectedRegion] || ghanaCities["Greater Accra"]).map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={storeInfoForm.control}
              name="closestLandmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Closest Landmark</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ridge Hopital"
                      className="h-12 border-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-14 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-14 bg-[#2C3466] hover:bg-[#222E76] text-white font-semibold rounded-xl"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Step 3: Password */}
      {step === 3 && (
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(handleStep3Continue)} className="space-y-5">
            <FormField
              control={passwordForm.control}
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
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        className="h-12 pr-12 border-gray-200"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
              control={passwordForm.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
                onClick={() => setStep(2)}
                className="flex-1 h-14 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-14 bg-[#2C3466] hover:bg-[#222E76] text-white font-semibold rounded-xl"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Step 4: Identity Verification Intro */}
      {step === 4 && (
        <div className="space-y-6">
          {/* One-Time Process Banner */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-[#2C3466]">One-Time Process</h3>
              <p className="text-gray-500 text-sm">
                You only need to complete this once. It typically takes 2-3 minutes and is reviewed within 24 hours
              </p>
            </div>
          </div>

          {/* What you'll need */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-[#2C3466]">What you&apos;ll need:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2C3466] mt-2 flex-shrink-0" />
                <span className="text-gray-700">Valid government-issued ID (Passport, Ghana card or Voter&apos;s ID)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2C3466] mt-2 flex-shrink-0" />
                <span className="text-gray-700">Clear photo or scan of your ID (Front and back)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2C3466] mt-2 flex-shrink-0" />
                <span className="text-gray-700">A selfie for identity confirmation</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleStartVerification}
            className="w-full h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl"
          >
            Start Verification
          </Button>
        </div>
      )}

      {/* Step 5: Government ID Verification */}
      {step === 5 && (
        <div className="space-y-6">
          {/* ID Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">ID Type*</label>
            <Select onValueChange={setIdType} value={idType}>
              <SelectTrigger className="h-12 border-gray-200 bg-white">
                <SelectValue placeholder="Ghana card" />
              </SelectTrigger>
              <SelectContent>
                {idTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ID Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">ID Number*</label>
            <Input
              placeholder="GHA-1234556-89"
              className="h-12 border-gray-200"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </div>

          {/* Image Requirements Info */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Image requirements:</span>
            </div>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                Valid government-issued ID (Passport, Ghana card or Voter&apos;s ID)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                Clear photo or scan of your ID (Front and back)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                A selfie for identity confirmation
              </li>
            </ul>
          </div>

          {/* Upload Front of ID */}
          <UploadZone
            label="Front of ID*"
            image={frontIdImage}
            inputRef={frontIdInputRef}
            onUpload={(e) => handleImageUpload(e, setFrontIdImage)}
          />

          {/* Upload Back of ID */}
          <UploadZone
            label="Back of ID*"
            image={backIdImage}
            inputRef={backIdInputRef}
            onUpload={(e) => handleImageUpload(e, setBackIdImage)}
          />

          <Button
            onClick={handleContinueToSelfie}
            disabled={!idType || !idNumber || !frontIdImage || !backIdImage}
            className="w-full h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Selfie Verification
          </Button>
        </div>
      )}

      {/* Step 6: Take a Selfie */}
      {step === 6 && (
        <div className="space-y-6">
          {/* Selfie Guidelines */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Selfie Guidelines:</span>
            </div>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                Face the camera directly and ensure your entire face is visible
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                Remove glasses, hats, or anything covering your face
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                Make sure you&apos;re in a well-lit area with no shadows
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                Use a neutral expression (no smiling)
              </li>
            </ul>
          </div>

          {/* Selfie Preview Area */}
          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-full bg-gray-100 overflow-hidden border-4 border-gray-200">
              {selfieImage ? (
                <Image
                  src={selfieImage}
                  alt="Selfie preview"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-16 h-16 text-gray-300" />
                </div>
              )}
            </div>
          </div>

          {/* Upload Selfie */}
          <div
            onClick={() => selfieInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:border-[#2C3466] hover:bg-gray-50"
          >
            <input
              ref={selfieInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, setSelfieImage)}
            />
            <div className="flex flex-col items-center justify-center text-center">
              <Camera className="w-8 h-8 text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium">Take or upload selfie</p>
              <p className="text-gray-400 text-sm">PNG, JPG up to 5 MB</p>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-xl">
            <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              Your selfie is used only for identity verification and will be stored securely. We use industry-standard facial recognition to match your selfie with your ID photo.
            </p>
          </div>

          <Button
            onClick={handleSubmitVerification}
            disabled={!selfieImage || isLoading}
            className="w-full h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit for verification"
            )}
          </Button>
        </div>
      )}

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
