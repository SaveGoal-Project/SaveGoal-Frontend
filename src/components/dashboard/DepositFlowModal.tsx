"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { useInitiatePayment } from "@/src/domains/payments/payment.hooks";
import type { PaymentMethod } from "@/src/domains/payments/payment.types";

type DepositStep = "amount" | "method" | "processing" | "success";

interface DepositFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
  goalName: string;
  remainingAmount: number;
  nextPaymentAmount?: number;
}

const paymentMethods: {
  id: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "MOMO_MTN",
    label: "MTN Mobile Money",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Pay with MTN MoMo",
  },
  {
    id: "MOMO_TELECEL",
    label: "Telecel Cash",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Pay with Telecel Cash",
  },
  {
    id: "MOMO_AT",
    label: "AT Money",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Pay with AirtelTigo Money",
  },
  {
    id: "CARD",
    label: "Debit/Credit Card",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Visa, Mastercard",
  },
];

export function DepositFlowModal({
  isOpen,
  onClose,
  goalId,
  goalName,
  remainingAmount,
  nextPaymentAmount,
}: DepositFlowModalProps) {
  const [step, setStep] = useState<DepositStep>("amount");
  const [amount, setAmount] = useState(
    nextPaymentAmount ? String(nextPaymentAmount) : ""
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const { initiate, reset } = useInitiatePayment();

  const handleClose = () => {
    setStep("amount");
    setAmount(nextPaymentAmount ? String(nextPaymentAmount) : "");
    setSelectedMethod(null);
    reset();
    onClose();
  };

  const handleAmountContinue = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setStep("method");
  };

  const handleMethodSelect = async (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep("processing");

    try {
      await initiate({
        savingsGoalId: goalId,
        amount: parseFloat(amount),
        method: method,
      });
      setStep("success");
    } catch {
      setStep("method");
    }
  };

  const parsedAmount = parseFloat(amount) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 rounded-2xl overflow-hidden">
        {/* Step 1: Enter Amount */}
        {step === "amount" && (
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Make a Deposit
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Saving for {goalName}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Deposit Amount (GH¢)
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 text-lg rounded-xl border-gray-300"
                  min="1"
                  max={remainingAmount}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Remaining: GH¢ {remainingAmount.toLocaleString()}
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {[50, 100, 200, 500].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(String(quickAmount))}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                      amount === String(quickAmount)
                        ? "bg-[#2d3369] text-white border-[#2d3369]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#2d3369]"
                    }`}
                  >
                    ¢{quickAmount}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleAmountContinue}
                disabled={parsedAmount <= 0 || parsedAmount > remainingAmount}
                className="w-full bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-xl py-6 text-base font-semibold"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Payment Method */}
        {step === "method" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep("amount")}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <DialogHeader className="flex-1">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Payment Method
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="bg-[#eef0ff] rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">Deposit Amount</p>
              <p className="text-2xl font-bold text-[#2d3369]">
                GH¢ {parsedAmount.toLocaleString()}
              </p>
            </div>

            <p className="text-sm font-medium text-gray-700 mb-3">
              Select payment method
            </p>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#2d3369] hover:bg-[#fafbff] transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#eef0ff] flex items-center justify-center text-[#2d3369]">
                    {method.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {method.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {method.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === "processing" && (
          <div className="p-6 text-center py-16">
            <Loader2 className="h-16 w-16 text-[#2d3369] animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Processing Payment
            </h3>
            <p className="text-sm text-gray-500">
              Please wait while we process your deposit of GH¢{" "}
              {parsedAmount.toLocaleString()}
            </p>
            {selectedMethod && (
              <p className="text-sm text-gray-500 mt-2">
                via{" "}
                {paymentMethods.find((m) => m.id === selectedMethod)?.label}
              </p>
            )}
          </div>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <div className="p-6 text-center py-16">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Deposit Successful!
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              GH¢ {parsedAmount.toLocaleString()} has been deposited
            </p>
            <p className="text-sm text-gray-500 mb-8">towards {goalName}</p>
            <Button
              onClick={handleClose}
              className="w-full bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-xl py-6 text-base font-semibold"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

