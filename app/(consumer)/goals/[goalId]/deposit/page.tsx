"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSavingsGoalDetail } from "@/src/domains/savings-goals/savings.hooks";
import { useInitiatePayment } from "@/src/domains/payments/payment.hooks";
import { Input } from "@/src/components/ui/input";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Lock,
  Smartphone,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import type { PaymentMethod } from "@/src/domains/payments/payment.types";
import Image from "next/image";

type DepositView = "form" | "processing" | "success";

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  requiresPhone: boolean;
}

const paymentMethods: PaymentMethodOption[] = [
  {
    id: "MOMO_MTN",
    label: "MTN Mobile Money",
    icon: <Smartphone className="h-6 w-6 text-yellow-500" />,
    requiresPhone: true,
  },
  {
    id: "MOMO_TELECEL",
    label: "Telecel Cash",
    icon: <Smartphone className="h-6 w-6 text-red-500" />,
    requiresPhone: true,
  },
  {
    id: "MOMO_AT",
    label: "AT Money",
    icon: <Smartphone className="h-6 w-6 text-red-600" />,
    requiresPhone: true,
  },
  {
    id: "CARD",
    label: "Visa/Master Card",
    icon: <CreditCard className="h-6 w-6 text-blue-600" />,
    requiresPhone: false,
  },
];

function formatCurrency(amount: number) {
  return `GH¢ ${amount.toLocaleString()}`;
}

function getMethodLabel(method: PaymentMethod): string {
  return paymentMethods.find((m) => m.id === method)?.label ?? method;
}

export default function DepositPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.goalId as string;
  const { goal, isLoading: goalLoading, error: goalError } = useSavingsGoalDetail(goalId);
  const { initiate, result: paymentResult } = useInitiatePayment();

  const [view, setView] = useState<DepositView>("form");
  const [amountType, setAmountType] = useState<"scheduled" | "custom">("scheduled");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  if (goalLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-36 mb-6" />
          <div className="h-8 bg-gray-200 rounded w-52 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-80 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 h-[500px]" />
            <div className="bg-white rounded-xl border border-gray-200 p-6 h-[300px]" />
          </div>
        </div>
      </div>
    );
  }

  if (goalError || !goal) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl text-center">
        <p className="text-red-600 text-lg">{goalError || "Goal not found"}</p>
        <button
          className="mt-4 text-sm text-[#2d3369] underline"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Use the properly computed nextPaymentAmount from normalizeGoal
  // (derived from monthlyAmount stored in backend)
  const scheduledAmount = goal.nextPaymentAmount || goal.monthlyAmount || 0;

  const depositAmountNum = amountType === "scheduled" ? scheduledAmount : (parseFloat(customAmount) || 0);
  const currentAmountNum = parseFloat(goal.currentAmount as any) || 0;
  const targetAmountNum = parseFloat(goal.targetAmount as any) || 0;

  const remaining = Math.max(targetAmountNum - currentAmountNum, 0);
  const afterPayment = currentAmountNum + depositAmountNum;
  const remainingAfter = targetAmountNum - afterPayment;
  const afterPaymentPercent = Math.min(Math.round((afterPayment / targetAmountNum) * 100), 100);

  const canSubmit =
    depositAmountNum > 0 &&
    depositAmountNum <= remaining &&
    selectedMethod !== null &&
    (paymentMethods.find((m) => m.id === selectedMethod)?.requiresPhone
      ? phoneNumber.length >= 9
      : true);

  const handleConfirmPayment = async () => {
    if (!canSubmit || !selectedMethod) return;
    setView("processing");
    try {
      const payload: any = {
        savingsGoalId: goalId,
        amount: depositAmountNum,
        method: selectedMethod,
      };

      if (paymentMethods.find((m) => m.id === selectedMethod)?.requiresPhone) {
        payload.mobileNumber = phoneNumber;
      }

      await initiate(payload);
      setView("success");
    } catch {
      setView("form");
    }
  };

  // ─── Processing View ───
  if (view === "processing") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="max-w-lg mx-auto bg-white rounded-xl border border-gray-200 p-12 text-center mt-12">
          <Loader2 className="h-16 w-16 text-[#2d3369] animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Processing Payment
          </h2>
          <p className="text-sm text-gray-500">
            Please wait while we process your deposit of{" "}
            {formatCurrency(depositAmountNum)}
          </p>
          {selectedMethod && (
            <p className="text-sm text-gray-500 mt-2">
              via {getMethodLabel(selectedMethod)}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── Success View ───
  if (view === "success") {
    const txnId =
      paymentResult?.payment?.externalReference ??
      `TXN${Date.now()}`;

    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="max-w-lg mx-auto bg-white rounded-xl border border-gray-200 p-10 text-center mt-12">
          {/* Green check badge */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-1">
            GHS {depositAmountNum.toLocaleString()} has been added to your savings
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Transaction ID: {txnId}
          </p>

          {/* New Total Saved */}
          <div className="bg-[#eef0ff] rounded-xl py-5 px-6 mb-8">
            <p className="text-sm text-gray-500 mb-1">New Total Saved</p>
            <p className="text-3xl font-bold text-[#2d3369]">
              {formatCurrency(afterPayment)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {afterPaymentPercent}% of your goal
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href={`/goals/${goalId}`}
              className="flex-1 bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-lg py-3 text-sm font-semibold text-center transition-colors"
            >
              View Savings Goal
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-3 text-sm font-semibold text-center transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Form View ───
  const selectedMethodObj = paymentMethods.find(
    (m) => m.id === selectedMethod
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back to Dashboard */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[#3b5bdb] text-sm font-medium mb-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Saving Goal Details
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Add funds to your {goal.product.name} savings goal
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Left Column: Form ─── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Payment Amount Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Payment Amount
            </h2>

            {/* Scheduled Amount */}
            <label
              className={`flex items-center justify-between border rounded-xl px-5 py-4 mb-4 cursor-pointer transition-colors ${amountType === "scheduled"
                  ? "border-[#3b5bdb] bg-[#f8f9ff]"
                  : "border-gray-200 hover:border-gray-300"
                }`}
              onClick={() => setAmountType("scheduled")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${amountType === "scheduled"
                      ? "border-[#3b5bdb]"
                      : "border-gray-300"
                    }`}
                >
                  {amountType === "scheduled" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3b5bdb]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Scheduled Amount
                  </p>
                  <p className="text-xs text-gray-500">
                    Your regular payment
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(scheduledAmount)}
              </p>
            </label>

            {/* Custom Payment */}
            <div className="mb-2">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Custom Payment
              </p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                  GH¢
                </span>
                <Input
                  type="number"
                  placeholder=""
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    if (e.target.value) setAmountType("custom");
                  }}
                  onFocus={() => setAmountType("custom")}
                  className="pl-12 h-12 rounded-xl border-gray-200"
                  min="1"
                />
              </div>
              <p className="text-xs text-blue-500 mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                Minimum: {formatCurrency(scheduledAmount)}
              </p>
            </div>
          </div>

          {/* Payment Method Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${selectedMethod === method.id
                      ? "border-[#3b5bdb] bg-[#f8f9ff]"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    {method.icon}
                  </div>
                  <p className="text-xs font-medium text-gray-900 text-center">
                    {method.label}
                  </p>
                </button>
              ))}
            </div>

            {/* Mobile Money Number (show if phone-based method selected) */}
            {selectedMethodObj?.requiresPhone && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Mobile Money Number
                </p>
                <div className="flex gap-2">
                  <div className="flex items-center border border-gray-200 rounded-xl px-3 bg-white">
                    <span className="text-sm font-medium text-gray-700">
                      +233
                    </span>
                  </div>
                  <Input
                    type="tel"
                    placeholder=""
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="h-12 rounded-xl border-gray-200 flex-1"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-blue-500 mt-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                  You&apos;ll receive a prompt on your phone to approve the
                  payment
                </p>
              </div>
            )}

            {/* Confirm Payment Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={!canSubmit}
              className="w-full bg-[#2d3369] hover:bg-[#3d4a99] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full py-3.5 text-base font-semibold transition-colors"
            >
              Confirm Payment
            </button>

            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Your payment is secure and encrypted
            </p>
          </div>
        </div>

        {/* ─── Right Column: Payment Summary ─── */}
        <div>
          <div className="bg-white rounded-xl border-2 border-[#3b5bdb] p-6 sticky top-8">
            <h3 className="text-base font-bold text-gray-900 mb-5">
              Payment Summary
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Savings Goal</span>
                <span className="text-sm font-semibold text-gray-900">
                  {goal.product.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Payment Amount</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(depositAmountNum)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Payment Method</span>
                <span className="text-sm font-semibold text-gray-900">
                  {selectedMethod
                    ? getMethodLabel(selectedMethod)
                    : "Not selected"}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3.5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">Current Saved</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(currentAmountNum)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">After Payment</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(afterPayment)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Remaining</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(Math.max(remainingAfter, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product image preview */}
          {goal.product.images[0] && (
            <div className="mt-4 relative w-full aspect-video rounded-xl overflow-hidden">
              <Image
                src={goal.product.images[0]}
                alt={goal.product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

