"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Users, Search, Calendar, ArrowRight } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { ProgressHeader } from "@/src/components/contributors/ProgressHeader";
import { ProductSelectCard } from "@/src/components/contributors/ProductSelectCard";
import { ContributionTypeCard } from "@/src/components/contributors/ContributionTypeCard";
import { GroupSavingsRules } from "@/src/components/contributors/GroupSavingsRules";
import { GoalProduct } from "@/src/domains/savings-goals/savings.types";

// Mock data matching the screenshot
const MOCK_PRODUCTS: GoalProduct[] = [
    {
        id: "prod-1",
        name: "Product Name",
        price: 1250,
        currency: "GH₵",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
        merchant: { id: "m-1", businessName: "Telefonica" },
    },
    {
        id: "prod-2",
        name: "Product Name",
        price: 1250,
        currency: "GH₵",
        images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80"],
        merchant: { id: "m-1", businessName: "Telefonica" },
    },
    {
        id: "prod-3",
        name: "Product Name",
        price: 1250,
        currency: "GH₵",
        images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"],
        merchant: { id: "m-1", businessName: "Telefonica" },
    },
    {
        id: "prod-4",
        name: "Product Name",
        price: 1250,
        currency: "GH₵",
        images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80"],
        merchant: { id: "m-1", businessName: "Telefonica" },
    },
];

type ContributionType = "flexible" | "equal";

export default function CreateContributorGoalPage() {
    const router = useRouter();

    // Form State
    const [step, setStep] = useState<1 | 2>(1);
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<GoalProduct | null>(null);
    const [contributionType, setContributionType] = useState<ContributionType | null>(null);
    const [targetDate, setTargetDate] = useState("");

    const handleReviewClick = () => {
        if (!groupName || !selectedProduct) {
            alert("Please enter a group name and select a product.");
            return;
        }
        setStep(2);
    };

    const handleCreateGroup = () => {
        // In a real app, send actual API request here.
        // For now, redirect to the new group's dashboard.
        router.push("/contributors/class-of-2024");
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
                <ProgressHeader currentStep={step} />

                <div className="bg-white border rounded-2xl p-6 sm:p-8 shadow-sm border-gray-200">

                    {/* Header Row (Icon + Title) */}
                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-[#1a53c8]">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                                {step === 1 ? "Saving Goal Details" : "Review & Create Group"}
                            </h1>
                            <p className="text-[#1a53c8] text-sm mt-1">
                                {step === 1
                                    ? "Save together with friends, family, or colleagues"
                                    : "Confirm your group savings details"}
                            </p>
                        </div>
                    </div>

                    {step === 1 ? (
                        /* STEP 1 FORM */
                        <div className="space-y-6">
                            {/* Group Name */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-900">
                                    Group Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="e.g. Kusi and Friends"
                                    className="h-11 border-gray-300 rounded-lg placeholder:text-gray-400"
                                />
                                <p className="text-xs text-gray-400 pl-1 mt-1">
                                    Choose a name that describes your group goal
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-900">
                                    Description (Optional)
                                </label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tell your members what this goal is about..."
                                    className="min-h-[100px] border-gray-300 rounded-lg resize-none placeholder:text-gray-400"
                                />
                            </div>

                            {/* Select Product */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-4 h-4 rounded-sm bg-gray-100 border border-gray-300">
                                        <span className="w-2 h-2 rounded-[1px] bg-gray-400" />
                                    </span>
                                    Select Product <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="search products..."
                                        className="h-11 pl-10 border-gray-300 rounded-full bg-gray-50 placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                    {MOCK_PRODUCTS.map((prod) => (
                                        <ProductSelectCard
                                            key={prod.id}
                                            product={prod}
                                            isSelected={selectedProduct?.id === prod.id}
                                            onSelect={setSelectedProduct}
                                        />
                                    ))}
                                    <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-30 mt-2">
                                        <div className="h-16 border-2 border-dashed border-gray-300 rounded-xl" />
                                        <div className="h-16 border-2 border-dashed border-gray-300 rounded-xl hidden sm:block" />
                                    </div>
                                </div>
                            </div>

                            {/* Contribution Type */}
                            <div className="space-y-3 pt-2">
                                <label className="text-sm font-bold text-gray-900">
                                    Contribution Type
                                </label>
                                <div className="space-y-3">
                                    <ContributionTypeCard
                                        id="type-flexible"
                                        title="Flexible Contribution"
                                        description="Members contribute any amount at any time"
                                        isSelected={contributionType === "flexible"}
                                        onSelect={() => setContributionType("flexible")}
                                    />
                                    <ContributionTypeCard
                                        id="type-equal"
                                        title="Equal Contribution"
                                        description="Split the target equally among all members"
                                        isSelected={contributionType === "equal"}
                                        onSelect={() => setContributionType("equal")}
                                    />
                                </div>
                            </div>

                            {/* Target Date */}
                            <div className="space-y-1 pt-2">
                                <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Target Date (Optional)
                                </label>
                                <Input
                                    type="date"
                                    value={targetDate}
                                    onChange={(e) => setTargetDate(e.target.value)}
                                    className="h-11 border-gray-300 rounded-lg text-gray-500 uppercase"
                                />
                                <p className="text-xs text-gray-400 pl-1 mt-1">
                                    Set a deadline to motivate your group
                                </p>
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleReviewClick}
                                    disabled={!groupName || !selectedProduct || !contributionType}
                                    className="w-full h-12 bg-[#1a53c8] hover:bg-[#1442a3] text-white text-[15px] font-semibold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    Review Group Details
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* STEP 2: REVIEW */
                        <div className="space-y-6">

                            {/* Group Name Summary */}
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Group Name
                                </span>
                                <p className="text-lg font-bold text-gray-900">{groupName}</p>
                            </div>

                            <div className="h-px bg-gray-100 my-4" />

                            {/* Selected Product Summary */}
                            {selectedProduct && (
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                        <Image
                                            src={selectedProduct.images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"}
                                            alt={selectedProduct.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-[10px] text-[#1a53c8] font-medium uppercase tracking-wider truncate mb-0.5">
                                            {selectedProduct.merchant?.businessName || "Telefonica"}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900 truncate">
                                            {selectedProduct.name}
                                        </span>
                                        <span className="text-xs font-bold text-[#1a53c8] mt-0.5">
                                            {selectedProduct.currency} {selectedProduct.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="h-px bg-gray-100 my-4" />

                            {/* Contribution Type Summary */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                                    Contribution Type
                                </span>
                                <p className="text-sm font-bold text-gray-900 capitalize">
                                    {contributionType}
                                </p>
                            </div>

                            <GroupSavingsRules />

                            <Button
                                onClick={handleCreateGroup}
                                className="w-full h-12 bg-[#1a53c8] hover:bg-[#1442a3] text-white text-[15px] font-bold rounded-lg transition-all"
                            >
                                Create Goal Group
                            </Button>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
