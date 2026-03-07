"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    merchantBasicInfoSchema,
    merchantStoreInfoSchema,
    merchantPasswordSchema,
    merchantVerificationSchema,
    MerchantBasicInfoData,
    MerchantStoreInfoData,
    MerchantPasswordData,
    MerchantVerificationData,
    ghanaRegions,
    ghanaCities,
    merchantCategories,
    validateUploadFile,
    FILE_UPLOAD_CONFIG,
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
import { Check, Eye, EyeOff, ShieldCheck, Upload, Camera, Info, Loader2, ArrowLeft, CheckCircle2, AlertCircle, PartyPopper } from "lucide-react";
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

const STORAGE_KEY = "savegoal_merchant_signup_draft";

interface DraftState {
    step: number;
    basicInfo: MerchantBasicInfoData | null;
    storeInfo: MerchantStoreInfoData | null;
    passwordData: { password: string; confirmPassword: string; terms: boolean } | null;
    idType: string;
    idNumber: string;
    frontIdImage: string | null;
    backIdImage: string | null;
    selfieImage: string | null;
    selectedRegion: string;
    isPhoneVerified: boolean;
}

function loadDraft(): DraftState | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

function saveDraft(state: DraftState) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* quota exceeded */ }
}

function clearDraft() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
}
export function MerchantRegisterForm({ accountType, onAccountTypeChange }: MerchantRegisterFormProps) {
    const draft = useRef(loadDraft());

    const [step, setStep] = useState(draft.current?.step ?? 1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [basicInfo, setBasicInfo] = useState<MerchantBasicInfoData | null>(draft.current?.basicInfo ?? null);
    const [storeInfo, setStoreInfo] = useState<MerchantStoreInfoData | null>(draft.current?.storeInfo ?? null);
    const [selectedRegion, setSelectedRegion] = useState(draft.current?.selectedRegion ?? "");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

    // Phone verification
    const [otpCode, setOtpCode] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);

    // Auth hooks
    const { registerMerchant, isLoading: isRegistering, error: authError, clearError } = useAuth();
    const {
        isLoading: isVerifyingPhone,
        isCodeSent,
        isVerified: isPhoneVerified,
        sendVerificationCode,
        verifyCode,
        error: phoneVerificationError,
    } = usePhoneVerification();
    const {
        isLoading: isUploadingFiles,
        submitVerification,
        error: verificationError,
    } = useMerchantVerification();

    // Verification state
    const [idType, setIdType] = useState(draft.current?.idType ?? "");
    const [idNumber, setIdNumber] = useState(draft.current?.idNumber ?? "");
    const [frontIdImage, setFrontIdImage] = useState<string | null>(draft.current?.frontIdImage ?? null);
    const [backIdImage, setBackIdImage] = useState<string | null>(draft.current?.backIdImage ?? null);
    const [selfieImage, setSelfieImage] = useState<string | null>(draft.current?.selfieImage ?? null);
    const [phoneVerifiedLocal, setPhoneVerifiedLocal] = useState(draft.current?.isPhoneVerified ?? false);

    // Camera state
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const frontIdInputRef = useRef<HTMLInputElement>(null);
    const backIdInputRef = useRef<HTMLInputElement>(null);
    const selfieInputRef = useRef<HTMLInputElement>(null);
    const formContainerRef = useRef<HTMLDivElement>(null);

    const isLoading = isRegistering || isUploadingFiles;

    // Aggregate error from all sources
    const activeError = formError || authError || phoneVerificationError || verificationError || null;

    // ─── Persist draft on state change ──────────────────────────────────────────
    useEffect(() => {
        if (isSubmitted) return;
        saveDraft({
            step, basicInfo, storeInfo,
            passwordData: step >= 3 ? { password: passwordForm.getValues("password"), confirmPassword: passwordForm.getValues("confirmPassword"), terms: passwordForm.getValues("terms") } : null,
            idType, idNumber, frontIdImage, backIdImage, selfieImage, selectedRegion,
            isPhoneVerified: phoneVerifiedLocal,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, basicInfo, storeInfo, idType, idNumber, frontIdImage, backIdImage, selfieImage, selectedRegion, phoneVerifiedLocal, isSubmitted]);

    // ─── Scroll to top on step change ───────────────────────────────────────────
    useEffect(() => {
        formContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    // ─── Cleanup camera on unmount ──────────────────────────────────────────────
    useEffect(() => {
        return () => { stopCamera(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Form instances ─────────────────────────────────────────────────────────
    const basicInfoForm = useForm<MerchantBasicInfoData>({
        resolver: zodResolver(merchantBasicInfoSchema),
        defaultValues: {
            fullName: basicInfo?.fullName ?? "",
            phoneNumber: basicInfo?.phoneNumber ?? "",
            email: basicInfo?.email ?? "",
            address: basicInfo?.address ?? "",
        },
        mode: "onBlur",
    });

    const storeInfoForm = useForm<MerchantStoreInfoData>({
        resolver: zodResolver(merchantStoreInfoSchema),
        defaultValues: {
            storeName: storeInfo?.storeName ?? "",
            category: storeInfo?.category ?? "",
            description: storeInfo?.description ?? "",
            region: storeInfo?.region ?? selectedRegion,
            city: storeInfo?.city ?? "",
            closestLandmark: storeInfo?.closestLandmark ?? "",
        },
        mode: "onBlur",
    });

    const passwordForm = useForm<MerchantPasswordData>({
        resolver: zodResolver(merchantPasswordSchema),
        defaultValues: {
            password: draft.current?.passwordData?.password ?? "",
            confirmPassword: draft.current?.passwordData?.confirmPassword ?? "",
            terms: draft.current?.passwordData?.terms ?? false,
        },
        mode: "onChange",
    });

    const verificationForm = useForm<MerchantVerificationData>({
        resolver: zodResolver(merchantVerificationSchema),
        defaultValues: { idType: idType, idNumber: idNumber },
        mode: "onBlur",
    });

    const password = passwordForm.watch("password", "");
    const hasMinLength = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const descriptionValue = storeInfoForm.watch("description", "");

    // ─── Step handlers ──────────────────────────────────────────────────────────
    const handleStep1Continue = async (data: MerchantBasicInfoData) => {
        setFormError(null);
        setBasicInfo(data);
        setStep(2);
    };

    const handleStep2Continue = async (data: MerchantStoreInfoData) => {
        setFormError(null);
        setStoreInfo(data);
        setStep(3);
    };

    const handleStep3Continue = async () => {
        setFormError(null);
        setStep(4);
    };

    const handleStartVerification = () => { setStep(5); };

    const handleContinueToSelfie = async (data: MerchantVerificationData) => {
        setFormError(null);
        setIdType(data.idType);
        setIdNumber(data.idNumber);
        if (!frontIdImage || !backIdImage) {
            setFormError("Please upload both front and back of your ID");
            return;
        }
        setStep(6);
    };

    // ─── Phone verification ─────────────────────────────────────────────────────
    const handleSendOtp = async () => {
        const phone = basicInfoForm.getValues("phoneNumber");
        if (!phone) { basicInfoForm.setError("phoneNumber", { message: "Enter your phone number first" }); return; }
        try {
            await sendVerificationCode(phone);
            setShowOtpInput(true);
        } catch { /* error is set in the hook */ }
    };

    const handleVerifyOtp = async () => {
        const phone = basicInfoForm.getValues("phoneNumber");
        if (!otpCode || otpCode.length < 4) return;
        const verified = await verifyCode(phone, otpCode);
        if (verified) { setPhoneVerifiedLocal(true); setShowOtpInput(false); }
    };

    // ─── Camera helpers ─────────────────────────────────────────────────────────
    const startCamera = useCallback(async () => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } } });
            streamRef.current = stream;
            if (videoRef.current) { videoRef.current.srcObject = stream; }
            setIsCameraActive(true);
        } catch (err) {
            const msg = err instanceof DOMException && err.name === "NotAllowedError"
                ? "Camera access denied. Please allow camera access in your browser settings, or use the upload option below."
                : "Camera not available on this device. Please use the upload option below.";
            setCameraError(msg);
        }
    }, []);

    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        setIsCameraActive(false);
    }, []);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setSelfieImage(dataUrl);
        stopCamera();
    }, [stopCamera]);

    // ─── File upload with validation ────────────────────────────────────────────
    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setImage: (image: string | null) => void,
        fieldKey: string
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validation = validateUploadFile(file);
        if (!validation.valid) {
            setFileErrors(prev => ({ ...prev, [fieldKey]: validation.error! }));
            e.target.value = "";
            return;
        }
        setFileErrors(prev => { const next = { ...prev }; delete next[fieldKey]; return next; });
        const reader = new FileReader();
        reader.onloadend = () => { setImage(reader.result as string); };
        reader.readAsDataURL(file);
    };

    // ─── Final submission ───────────────────────────────────────────────────────
    const handleSubmitVerification = async () => {
        if (!basicInfo || !storeInfo) { setFormError("Missing registration data. Please go back and fill in all steps."); return; }
        if (!selfieImage) { setFormError("Please take or upload a selfie"); return; }

        setFormError(null);
        clearError();

        try {
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

            if (frontIdImage && backIdImage && selfieImage) {
                await submitVerification({ idType, idNumber, frontIdImage, backIdImage, selfieImage });
            }

            clearDraft();
            setIsSubmitted(true);
            setStep(7);
        } catch {
            // Errors surfaced via authError / verificationError
        }
    };
// ─── Sub-components ────────────────────────────────────────────────────────
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-2 text-sm">
        <div className={cn("flex h-4 w-4 items-center justify-center rounded-full border", met ? "border-[#2c3466] bg-transparent text-[#2c3466]" : "border-gray-300 bg-transparent text-transparent")}>
            {met && <Check className="h-2.5 w-2.5" />}
        </div>
        <span className={cn(met ? "text-[#2c3466] font-medium" : "text-gray-500")}>{text}</span>
    </div>
);

const StepIndicator = () => {
    const phases = ["Your Info", "Store", "Password", "Verify"];
    const currentPhase = step <= 1 ? 0 : step === 2 ? 1 : step === 3 ? 2 : 3;
    return (
        <div className="flex items-center justify-center gap-4 mb-8">
            {phases.map((label, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        currentPhase === i ? "border-[#2C3466] bg-[#2C3466]" : currentPhase > i ? "border-[#2C3466] bg-transparent" : "border-gray-300 bg-transparent")}>
                        {currentPhase > i ? <Check className="h-3 w-3 text-[#2C3466]" /> : currentPhase === i && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className={cn("text-xs mt-1", currentPhase >= i ? "text-gray-900 font-medium" : "text-gray-400")}>{label}</span>
                </div>
            ))}
        </div>
    );
};

const AccountTypeTabs = () => (
    <div className="flex gap-6 mb-6">
        <button type="button" onClick={() => onAccountTypeChange("buyer")} className={cn("pb-2 text-base font-medium transition-all border-b-2", accountType === "buyer" ? "text-gray-900 border-gray-900" : "text-gray-500 border-transparent hover:text-gray-700")}>Buyer account</button>
        <button type="button" onClick={() => onAccountTypeChange("merchant")} className={cn("pb-2 text-base font-medium transition-all border-b-2", accountType === "merchant" ? "text-gray-900 border-gray-900" : "text-gray-500 border-transparent hover:text-gray-700")}>Merchant account</button>
    </div>
);

const ErrorBanner = () => activeError ? (
    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
            <p className="font-medium text-red-800">Something went wrong</p>
            <p className="text-red-600 mt-1">{activeError}</p>
        </div>
    </div>
) : null;

const getStepTitle = () => {
    switch (step) {
        case 1: return "Basic Information";
        case 2: return "Store Information";
        case 3: return "Create Password";
        case 4: return "Identity Verification";
        case 5: return "Government ID Verification";
        case 6: return "Take a Selfie";
        case 7: return "You're All Set!";
        default: return "";
    }
};

const getStepSubtitle = () => {
    switch (step) {
        case 1: return "Let's get you started with SaveGoal";
        case 2: return "Tell us about your business";
        case 3: return "Set a strong password to secure your account";
        case 5: return "Upload a clear photo or scan of your valid government-issued ID";
        case 6: return "We need to confirm that you're the person on the ID. Take a clear selfie of your face.";
        default: return undefined;
    }
};

const UploadZone = ({ label, image, inputRef, onUpload, errorKey }: { label: string; image: string | null; inputRef: React.RefObject<HTMLInputElement | null>; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; errorKey: string; }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div onClick={() => inputRef.current?.click()} className={cn("border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all hover:border-[#2C3466] hover:bg-gray-50", image ? "border-[#2C3466] bg-gray-50" : "border-gray-200")}>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onUpload} />
            {image ? (
                <div className="relative w-full h-32">
                    <Image src={image} alt={label} fill className="object-contain rounded-lg" />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-3" />
                    <p className="text-gray-700 font-medium">Click to upload {label.toLowerCase()}</p>
                    <p className="text-gray-400 text-sm">{FILE_UPLOAD_CONFIG.ACCEPTED_TYPES_LABEL} up to {FILE_UPLOAD_CONFIG.MAX_SIZE_LABEL}</p>
                </div>
            )}
        </div>
        {fileErrors[errorKey] && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{fileErrors[errorKey]}</p>}
        {image && <button type="button" onClick={(e) => { e.stopPropagation(); if (inputRef.current) inputRef.current.value = ""; }} className="text-xs text-[#2C3466] hover:underline">Remove & re-upload</button>}
    </div>
);

const BackButton = ({ targetStep }: { targetStep: number }) => (
    <Button type="button" variant="outline" onClick={() => { setFormError(null); setStep(targetStep); }} className="flex-1 h-14 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50">
        Back
    </Button>
);
// ─── JSX Return ──────────────────────────────────────────────────────────────
// Step 7: Success Screen
if (step === 7) {
    return (
        <div ref={formContainerRef} className="w-full max-w-[550px] space-y-8 py-8">
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <PartyPopper className="w-10 h-10 text-green-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">You&apos;re All Set!</h1>
                <p className="text-gray-500">Your merchant account has been submitted for review.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-[#2C3466]">What happens next?</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span>Our team will review your identity documents within <strong>24–48 hours</strong>.</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span>You&apos;ll receive an email at <strong>{basicInfo?.email}</strong> once your account is approved.</span></li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span>Once approved, you can start listing products and receiving savings orders.</span></li>
                </ul>
            </div>
            {basicInfo && storeInfo && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">Account Summary</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-gray-400">Name</span><p className="font-medium text-gray-800">{basicInfo.fullName}</p></div>
                        <div><span className="text-gray-400">Store</span><p className="font-medium text-gray-800">{storeInfo.storeName}</p></div>
                        <div><span className="text-gray-400">Email</span><p className="font-medium text-gray-800">{basicInfo.email}</p></div>
                        <div><span className="text-gray-400">Category</span><p className="font-medium text-gray-800">{storeInfo.category}</p></div>
                    </div>
                </div>
            )}
            <Button onClick={() => window.location.href = "/merchant"} className="w-full h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl">
                Go to Merchant Dashboard
            </Button>
        </div>
    );
}

return (
    <div ref={formContainerRef} className="w-full max-w-[550px] space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Create Your Merchant Account</h1>
            {getStepSubtitle() && <p className="text-gray-400 text-sm">{getStepSubtitle()}</p>}
        </div>

        {/* Account Type Tabs */}
        <div className="flex justify-center"><AccountTypeTabs /></div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Step Title */}
        <h2 className="text-xl font-semibold text-gray-900 text-center">{getStepTitle()}</h2>

        {/* Error Banner */}
        <ErrorBanner />

        {/* Step 1: Basic Information */}
        {step === 1 && (
            <Form {...basicInfoForm}>
                <form onSubmit={basicInfoForm.handleSubmit(handleStep1Continue)} className="space-y-5">
                    <FormField control={basicInfoForm.control} name="fullName" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Full Name</FormLabel>
                            <FormControl><Input placeholder="Enter your full name" className="h-12 border-gray-200" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={basicInfoForm.control} name="phoneNumber" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Phone Number</FormLabel>
                            <FormControl>
                                <div className="space-y-2">
                                    <div className="flex gap-3">
                                        <Input placeholder="+233 2000 765 54" className="h-12 border-gray-200 flex-1" {...field} disabled={phoneVerifiedLocal} />
                                        {!phoneVerifiedLocal ? (
                                            <Button type="button" onClick={handleSendOtp} disabled={isVerifyingPhone || isCodeSent} className="h-12 px-6 bg-[#2C3466] hover:bg-[#222E76] text-white rounded-lg">
                                                {isVerifyingPhone ? <Loader2 className="h-4 w-4 animate-spin" /> : isCodeSent ? "Resend" : "Verify"}
                                            </Button>
                                        ) : (
                                            <div className="h-12 px-4 flex items-center gap-2 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium"><CheckCircle2 className="w-4 h-4" />Verified</div>
                                        )}
                                    </div>
                                    {showOtpInput && !phoneVerifiedLocal && (
                                        <div className="flex gap-3">
                                            <Input placeholder="Enter OTP code" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="h-12 border-gray-200 flex-1" maxLength={6} />
                                            <Button type="button" onClick={handleVerifyOtp} disabled={isVerifyingPhone || otpCode.length < 4} className="h-12 px-6 bg-[#2C3466] hover:bg-[#222E76] text-white rounded-lg">
                                                {isVerifyingPhone ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                                            </Button>
                                        </div>
                                    )}
                                    {!phoneVerifiedLocal && !showOtpInput && (
                                        <p className="text-xs text-gray-400">Phone verification is optional — you can proceed without it.</p>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={basicInfoForm.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Email</FormLabel>
                            <FormControl><Input type="email" placeholder="example@gmail.com" className="h-12 border-gray-200" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={basicInfoForm.control} name="address" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Address</FormLabel>
                            <FormControl><Input placeholder="CA5500 Cowpea Street" className="h-12 border-gray-200" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <Button type="submit" className="w-full h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl">Continue</Button>
                </form>
            </Form>
        )}

        {/* Step 2: Store Information */}
        {step === 2 && (
            <Form {...storeInfoForm}>
                <form onSubmit={storeInfoForm.handleSubmit(handleStep2Continue)} className="space-y-5">
                    <FormField control={storeInfoForm.control} name="storeName" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Store Name</FormLabel>
                            <FormControl><Input placeholder="eg. Pearl's Apparrel" className="h-12 border-gray-200" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={storeInfoForm.control} name="category" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className="h-12 border-gray-200 bg-white"><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                <SelectContent>{merchantCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={storeInfoForm.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Description</FormLabel>
                            <FormControl><Textarea placeholder="Describe your business..." className="min-h-[100px] border-gray-200 resize-none" maxLength={500} {...field} /></FormControl>
                            <div className="flex justify-between"><FormMessage /><span className="text-xs text-gray-400">{descriptionValue.length}/500</span></div>
                        </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={storeInfoForm.control} name="region" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Region</FormLabel>
                                <Select onValueChange={(v) => { field.onChange(v); setSelectedRegion(v); storeInfoForm.setValue("city", ""); }} value={field.value}>
                                    <FormControl><SelectTrigger className="h-12 border-gray-200 bg-white"><SelectValue placeholder="Select region" /></SelectTrigger></FormControl>
                                    <SelectContent>{ghanaRegions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={storeInfoForm.control} name="city" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">City</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger className="h-12 border-gray-200 bg-white"><SelectValue placeholder="Select city" /></SelectTrigger></FormControl>
                                    <SelectContent>{(ghanaCities[selectedRegion] || []).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <FormField control={storeInfoForm.control} name="closestLandmark" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Closest Landmark</FormLabel>
                            <FormControl><Input placeholder="Ridge Hospital" className="h-12 border-gray-200" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className="flex gap-4 pt-2">
                        <BackButton targetStep={1} />
                        <Button type="submit" className="flex-1 h-14 bg-[#2C3466] hover:bg-[#222E76] text-white font-semibold rounded-xl">Continue</Button>
                    </div>
                </form>
            </Form>
        )}
{/* Step 3: Password */ }
{
    step === 3 && (
        <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handleStep3Continue)} className="space-y-5">
                <FormField control={passwordForm.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-gray-700">Create Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input type={showPassword ? "text" : "password"} placeholder="••••••••••••" className="h-12 pr-12 border-gray-200" {...field} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••••••" className="h-12 pr-12 border-gray-200" {...field} />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="grid grid-cols-2 gap-3">
                    <PasswordRequirement met={hasMinLength} text="At least 8 characters" />
                    <PasswordRequirement met={hasUpper} text="One uppercase letter" />
                    <PasswordRequirement met={hasNumber} text="One number" />
                    <PasswordRequirement met={hasSpecial} text="One special character" />
                </div>

                <FormField control={passwordForm.control} name="terms" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="leading-none">
                            <FormLabel className="font-normal text-gray-500 text-sm">
                                I agree to the{" "}<Link href="/terms" className="font-semibold text-[#2C3466]">Terms and Conditions</Link>{" "}and{" "}<Link href="/privacy" className="font-semibold text-[#2C3466]">Privacy Policy</Link>
                            </FormLabel>
                            <FormMessage />
                        </div>
                    </FormItem>
                )} />

                <div className="flex gap-4 pt-2">
                    <BackButton targetStep={2} />
                    <Button type="submit" className="flex-1 h-14 bg-[#2C3466] hover:bg-[#222E76] text-white font-semibold rounded-xl">Continue</Button>
                </div>
            </form>
        </Form>
    )
}

{/* Step 4: Identity Verification Intro */ }
{
    step === 4 && (
        <div className="space-y-6">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-green-600" /></div>
                <div>
                    <h3 className="font-semibold text-[#2C3466]">One-Time Process</h3>
                    <p className="text-gray-500 text-sm">You only need to complete this once. It typically takes 2-3 minutes and is reviewed within 24 hours</p>
                </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-[#2C3466]">What you&apos;ll need:</h3>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#2C3466] mt-2 flex-shrink-0" /><span className="text-gray-700">Valid government-issued ID (Passport, Ghana card or Voter&apos;s ID)</span></li>
                    <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#2C3466] mt-2 flex-shrink-0" /><span className="text-gray-700">Clear photo or scan of your ID (Front and back)</span></li>
                    <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-[#2C3466] mt-2 flex-shrink-0" /><span className="text-gray-700">A selfie for identity confirmation</span></li>
                </ul>
            </div>
            <div className="flex gap-4 pt-2">
                <BackButton targetStep={3} />
                <Button onClick={handleStartVerification} className="flex-1 h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl">Start Verification</Button>
            </div>
        </div>
    )
}

{/* Step 5: Government ID Verification */ }
{
    step === 5 && (
        <Form {...verificationForm}>
            <form onSubmit={verificationForm.handleSubmit(handleContinueToSelfie)} className="space-y-6">
                <FormField control={verificationForm.control} name="idType" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-gray-700">ID Type*</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="h-12 border-gray-200 bg-white"><SelectValue placeholder="Select ID type" /></SelectTrigger></FormControl>
                            <SelectContent>{idTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={verificationForm.control} name="idNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-gray-700">ID Number*</FormLabel>
                        <FormControl><Input placeholder="GHA-1234556-89" className="h-12 border-gray-200" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2"><Info className="w-4 h-4 text-blue-600" /><span className="font-medium text-blue-800">Image requirements:</span></div>
                    <ul className="space-y-2 text-sm text-blue-700">
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />Clear, unobstructed photo (no glare, no blur)</li>
                        <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />{FILE_UPLOAD_CONFIG.ACCEPTED_TYPES_LABEL} format, max {FILE_UPLOAD_CONFIG.MAX_SIZE_LABEL}</li>
                    </ul>
                </div>
                <UploadZone label="Front of ID*" image={frontIdImage} inputRef={frontIdInputRef} onUpload={(e) => handleImageUpload(e, setFrontIdImage, "front")} errorKey="front" />
                <UploadZone label="Back of ID*" image={backIdImage} inputRef={backIdInputRef} onUpload={(e) => handleImageUpload(e, setBackIdImage, "back")} errorKey="back" />
                <div className="flex gap-4 pt-2">
                    <BackButton targetStep={4} />
                    <Button type="submit" disabled={!frontIdImage || !backIdImage} className="flex-1 h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">Continue to Selfie</Button>
                </div>
            </form>
        </Form>
    )
}

{/* Step 6: Take a Selfie */ }
{
    step === 6 && (
        <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2"><Info className="w-4 h-4 text-blue-600" /><span className="font-medium text-blue-800">Selfie Guidelines:</span></div>
                <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />Face the camera directly and ensure your entire face is visible</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />Remove glasses, hats, or anything covering your face</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />Make sure you&apos;re in a well-lit area with no shadows</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />Use a neutral expression</li>
                </ul>
            </div>

            {/* Camera / Selfie preview */}
            <div className="flex justify-center">
                <div className="w-48 h-48 rounded-full bg-gray-100 overflow-hidden border-4 border-gray-200 relative">
                    {isCameraActive ? (
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                    ) : selfieImage ? (
                        <Image src={selfieImage} alt="Selfie preview" width={192} height={192} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><Camera className="w-16 h-16 text-gray-300" /></div>
                    )}
                </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />

            {cameraError && <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg text-center">{cameraError}</p>}

            {/* Camera controls */}
            <div className="flex flex-col gap-3">
                {!selfieImage && !isCameraActive && (
                    <Button type="button" onClick={startCamera} variant="outline" className="w-full h-12 border-[#2C3466] text-[#2C3466] rounded-xl font-medium hover:bg-gray-50">
                        <Camera className="w-5 h-5 mr-2" />Open Camera
                    </Button>
                )}
                {isCameraActive && (
                    <div className="flex gap-3">
                        <Button type="button" onClick={stopCamera} variant="outline" className="flex-1 h-12 rounded-xl">Cancel</Button>
                        <Button type="button" onClick={capturePhoto} className="flex-1 h-12 bg-[#2C3466] hover:bg-[#222E76] text-white rounded-xl font-medium">Capture Photo</Button>
                    </div>
                )}
                {selfieImage && (
                    <Button type="button" onClick={() => { setSelfieImage(null); startCamera(); }} variant="outline" className="w-full h-12 border-gray-300 text-gray-700 rounded-xl">Retake Selfie</Button>
                )}
            </div>

            {/* Upload fallback */}
            <div onClick={() => selfieInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:border-[#2C3466] hover:bg-gray-50">
                <input ref={selfieInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { handleImageUpload(e, setSelfieImage, "selfie"); stopCamera(); }} />
                <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-gray-600 text-sm font-medium">Or upload a selfie from your device</p>
                    <p className="text-gray-400 text-xs">{FILE_UPLOAD_CONFIG.ACCEPTED_TYPES_LABEL} up to {FILE_UPLOAD_CONFIG.MAX_SIZE_LABEL}</p>
                </div>
            </div>
            {fileErrors["selfie"] && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{fileErrors["selfie"]}</p>}

            <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-xl">
                <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500">Your selfie is used only for identity verification and will be stored securely.</p>
            </div>

            <div className="flex gap-4">
                <BackButton targetStep={5} />
                <Button onClick={handleSubmitVerification} disabled={!selfieImage || isLoading} className="flex-1 h-14 bg-[#2C3466] hover:bg-[#222E76] text-white text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Submitting...</>) : "Submit for Verification"}
                </Button>
            </div>
        </div>
    )
}

{/* Sign In link */ }
<div className="text-center text-gray-500 text-sm pt-2">
    Already have an account?{" "}
    <Link href="/login" className="font-semibold text-[#2C3466] hover:underline">Sign In</Link>
</div>
    </div >
  );
}
