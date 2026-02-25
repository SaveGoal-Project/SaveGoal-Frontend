"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { useContributeToGroupGoal } from "@/src/domains/savings-goals/savings.hooks";

interface ContributeModalProps {
    isOpen: boolean;
    onClose: () => void;
    goalId: string;
    groupName: string;
    remainingAmount: number;
    productName: string;
    onSuccess: () => void;
}

const PAYMENT_METHODS = [
    { id: "mtn", name: "MTN Mobile Money", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/MTN_Logo.svg/1024px-MTN_Logo.svg.png" },
    { id: "telecel", name: "Telecel Cash", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Vodafone_logo.svg", isVodafone: true }, // Close enough mockup for Telecel
    { id: "at", name: "AT Money", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Airtel_logo_2010.svg/512px-Airtel_logo_2010.svg.png" },
    { id: "card", name: "Bank Cards", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png", isDual: true },
];

export function ContributeModal({ isOpen, onClose, goalId, groupName, remainingAmount, productName, onSuccess }: ContributeModalProps) {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Amount, 2: Method, 3: Processing, 4: Success
    const [amount, setAmount] = useState<string>("");
    const [selectedMethod, setSelectedMethod] = useState<string>("mtn");

    const { contribute } = useContributeToGroupGoal();

    const handleClose = () => {
        setStep(1);
        setAmount("");
        onClose();
    };

    const handleContinueToPayment = () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
        setStep(2);
    };

    const handleConfirmPayment = async () => {
        setStep(3); // Processing

        try {
            await contribute(goalId, { amount: Number(amount), paymentMethod: selectedMethod });
            setStep(4); // Success
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 3000);
        } catch (error) {
            console.error(error);
            setStep(2); // Go back to payment method on error
            alert("Payment failed. Please try again.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-6">
                {step === 1 && (
                    <>
                        <DialogHeader className="text-center sm:text-center space-y-4">
                            <div className="mx-auto w-14 h-14 bg-[#eef0ff] rounded-full flex items-center justify-center">
                                <UsersIcon className="w-7 h-7 text-[#3b5bdb]" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-gray-900 leading-tight">
                                Contribute to {groupName}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 mt-4">
                            <div className="bg-[#f0f4ff] rounded-xl p-5 text-center">
                                <p className="text-[10px] text-[#3b5bdb] uppercase font-bold tracking-wide mb-1">Group Target Remaining</p>
                                <p className="text-3xl font-bold text-[#3b5bdb]">GH¢ {remainingAmount.toLocaleString()}</p>
                                <p className="text-xs text-gray-400 mt-2">{productName}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-900">Contribution Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold text-sm">GH¢</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="pl-14 h-14 text-lg font-bold border-gray-300 focus:border-[#3b5bdb] rounded-xl"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleContinueToPayment}
                                disabled={!amount || Number(amount) <= 0}
                                className="w-full h-14 bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-xl font-semibold gap-2 border-none"
                            >
                                Continue to Payment <ArrowRight className="w-5 h-5 -mr-1" />
                            </Button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <DialogHeader className="text-center sm:text-center space-y-1">
                            <DialogTitle className="text-xl font-bold text-gray-900">
                                Contribute to {groupName}
                            </DialogTitle>
                            <p className="text-xs text-[#3b5bdb] font-medium">
                                Contributing ¢{amount} to {groupName}
                            </p>
                        </DialogHeader>

                        <div className="space-y-3 mt-6">
                            {PAYMENT_METHODS.map((method) => (
                                <label
                                    key={method.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedMethod === method.id
                                            ? "border-[#3b5bdb] ring-1 ring-[#3b5bdb] bg-[#f8faff]"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                        }`}
                                >
                                    <div className={`h-5 w-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${selectedMethod === method.id ? "border-[#3b5bdb]" : "border-gray-300"
                                        }`}>
                                        {selectedMethod === method.id && <div className="h-3 w-3 rounded-full bg-[#3b5bdb]" />}
                                    </div>

                                    <div className="flex items-center gap-3 w-full">
                                        {method.isDual ? (
                                            <div className="flex items-center gap-1 shrink-0 bg-white p-1 rounded">
                                                <div className="relative w-8 h-5"><Image src={method.icon} alt="Visa" fill className="object-contain" /></div>
                                                <div className="relative w-8 h-5"><Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="Mastercard" fill className="object-contain" /></div>
                                            </div>
                                        ) : (
                                            <div className={`relative ${method.isVodafone ? 'w-6 h-6' : 'w-8 h-6'} shrink-0 bg-white rounded`}>
                                                <Image src={method.icon} alt={method.name} fill className="object-contain" />
                                            </div>
                                        )}
                                        <span className="text-sm font-bold text-gray-900">{method.name}</span>
                                    </div>

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.id}
                                        checked={selectedMethod === method.id}
                                        onChange={() => setSelectedMethod(method.id)}
                                        className="hidden"
                                    />
                                </label>
                            ))}

                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="w-full h-12 border-[#3b5bdb] text-[#3b5bdb] hover:bg-[#f0f4ff] rounded-xl font-bold"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleConfirmPayment}
                                    className="w-full h-12 bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-xl font-bold border-none shadow-sm"
                                >
                                    Confirm Payment
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <div className="py-12 flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 border-4 border-[#eef0ff] border-t-[#3b5bdb] rounded-full animate-spin" />
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Processing Payment</h3>
                            <p className="text-xs text-[#3b5bdb] mt-1">Please wait while we process your contribution</p>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="py-10 flex flex-col items-center text-center space-y-6">
                        <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                            <Check className="w-10 h-10 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Contribution Successful!</h3>
                            <p className="text-xs text-[#3b5bdb] mt-1">
                                You've contributed ¢{amount} to {groupName}
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function UsersIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 40 0 0 0-4-4H6a4 40 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
