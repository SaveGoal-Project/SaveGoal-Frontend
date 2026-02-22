"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useSavedPaymentMethods } from "@/src/domains/payments/payment.hooks";
import { CreditCard, Trash2, Star, ArrowLeft, CheckCircle } from "lucide-react";
import type { PaymentMethod } from "@/src/domains/payments/payment.types";

// Payment method branding
function getMethodLogo(type: PaymentMethod) {
  switch (type) {
    case "MOMO_MTN":
      return (
        <div className="w-10 h-10 rounded-lg bg-[#ffcc00] flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-black">MTN</span>
        </div>
      );
    case "MOMO_TELECEL":
      return (
        <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-white">T.Cash</span>
        </div>
      );
    case "MOMO_AT":
      return (
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-white">AT</span>
        </div>
      );
    case "CARD":
      return (
        <div className="w-10 h-10 rounded-lg bg-[#1a1f71] flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-white">VISA</span>
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
          <CreditCard className="h-5 w-5 text-gray-500" />
        </div>
      );
  }
}

type AddPaymentType = "mobile-money" | "bank-transfer" | "card";

const ghanaianBanks = [
  "GCB Bank",
  "Ecobank Ghana",
  "Absa Bank Ghana",
  "Stanbic Bank",
  "Standard Chartered",
  "CalBank",
  "Fidelity Bank",
  "First National Bank",
  "Republic Bank",
  "Zenith Bank",
  "Access Bank",
  "UBA Ghana",
  "Consolidated Bank Ghana",
  "ADB Bank",
  "Prudential Bank",
  "National Investment Bank",
  "OmniBSIC Bank",
  "First Atlantic Bank",
];

const mobileNetworks = [
  { value: "MOMO_MTN", label: "MTN Mobile Money" },
  { value: "MOMO_TELECEL", label: "Telecel Cash" },
  { value: "MOMO_AT", label: "AirtelTigo Money" },
];

export function PaymentMethodsTab() {
  const { methods, isLoading, remove, setDefault } = useSavedPaymentMethods();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addPaymentType, setAddPaymentType] = useState<AddPaymentType>("mobile-money");

  // Form state for add modal
  const [momoNetwork, setMomoNetwork] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const handleAddPayment = () => {
    // Simulate adding payment method
    setShowAddModal(false);
    setShowSuccessModal(true);
    // Reset form
    setMomoNetwork("");
    setMomoNumber("");
    setBankName("");
    setAccountName("");
    setAccountNumber("");
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCvv("");
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-900">
            Payment Methods
          </h3>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#1e2a4a] hover:bg-[#2d3369] text-white rounded-lg px-5 py-2 text-sm"
          >
            Add New
          </Button>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Manage your payment options
        </p>

        {methods.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">
              No payment methods saved yet.
            </p>
            <p className="text-sm text-gray-500">
              They will be saved when you make your first deposit.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  method.isDefault
                    ? "border-[#2d3369] bg-[#f8f9ff]"
                    : "border-gray-200 bg-white"
                }`}
              >
                {getMethodLogo(method.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {method.label}
                    </p>
                    {method.isDefault && (
                      <span className="text-xs font-medium text-white bg-green-500 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{method.number}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => setDefault(method.id)}
                      className="text-gray-400 hover:text-[#2d3369] p-1"
                      title="Set as default"
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => remove(method.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                    title="Remove"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security note */}
        <p className="text-xs text-gray-400 text-center mt-8">
          Your payment information is encrypted and securely stored. We never share your financial details with third parties.
        </p>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Add payment Method
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Add a new mobile money, card or bank payment method
            </p>

            {/* Payment type selector */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-800 mb-3">
                Payment type
              </p>
              <div className="flex gap-2">
                {[
                  { value: "mobile-money" as AddPaymentType, label: "Mobile Money" },
                  { value: "bank-transfer" as AddPaymentType, label: "Bank Transfer" },
                  { value: "card" as AddPaymentType, label: "Card" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm cursor-pointer transition-colors ${
                      addPaymentType === option.value
                        ? "border-[#2d3369] text-[#2d3369] bg-white"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentType"
                      value={option.value}
                      checked={addPaymentType === option.value}
                      onChange={() => setAddPaymentType(option.value)}
                      className="accent-[#2d3369]"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile Money Form */}
            {addPaymentType === "mobile-money" && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-900">Mobile Money Information</p>
                <p className="text-xs text-gray-500 -mt-2">
                  Securely add your mobile money to fund your saving goals anytime.
                </p>
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-1 block">
                    Network
                  </label>
                  <select
                    value={momoNetwork}
                    onChange={(e) => setMomoNetwork(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d3369]"
                  >
                    <option value="">Select network</option>
                    {mobileNetworks.map((n) => (
                      <option key={n.value} value={n.value}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-1 block">
                    Phone Number
                  </label>
                  <Input
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="Enter mobile money number"
                    className="rounded-lg border-gray-300"
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer Form */}
            {addPaymentType === "bank-transfer" && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-900">Bank Information</p>
                <p className="text-xs text-gray-500 -mt-2">
                  Securely add your bank to fund your saving goals anytime. Your details stay safe and encrypted
                </p>
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-1 block">
                    Bank Name
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-lg border border-[#2d3369] px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d3369]"
                  >
                    <option value="">Select bank</option>
                    {ghanaianBanks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-1 block">
                    Account Name
                  </label>
                  <Input
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter bank account name"
                    className="rounded-lg border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-1 block">
                    Account Number
                  </label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="010XXXXXXXXX"
                    className="rounded-lg border-gray-300"
                  />
                </div>
              </div>
            )}

            {/* Card Form */}
            {addPaymentType === "card" && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-900">Card Information</p>
                <p className="text-xs text-gray-500 -mt-2">
                  Securely add your card to fund your saving goals anytime.
                </p>
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-1 block">
                    Card Number
                  </label>
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="rounded-lg border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-1 block">
                    Cardholder Name
                  </label>
                  <Input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name on card"
                    className="rounded-lg border-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-1 block">
                      Expiry Date
                    </label>
                    <Input
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="rounded-lg border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-1 block">
                      CVV
                    </label>
                    <Input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="***"
                      className="rounded-lg border-gray-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Continue button */}
            <Button
              onClick={handleAddPayment}
              className="w-full mt-6 bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-lg py-3 text-sm font-semibold"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-8 text-center">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <h3 className="text-2xl font-bold text-[#2d3369] mb-6">
              Congratulations
            </h3>

            {/* Check circle */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#c7cce6] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#a0a8d4] flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>

            <p className="text-gray-700 font-medium mb-8">
              You have successfully linked your bank account
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  // Navigate to fund goal
                }}
                className="w-full bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-lg py-3 text-sm font-semibold"
              >
                Fund a goal now
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSuccessModal(false)}
                className="w-full border-[#2d3369] text-[#2d3369] rounded-lg py-3 text-sm font-semibold"
              >
                Go to dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
