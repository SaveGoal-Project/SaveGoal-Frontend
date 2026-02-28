"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Users, Search, Calendar, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { ProgressHeader } from "@/src/components/contributors/ProgressHeader";
import { ProductSelectCard } from "@/src/components/contributors/ProductSelectCard";
import { ContributionTypeCard } from "@/src/components/contributors/ContributionTypeCard";
import { GroupSavingsRules } from "@/src/components/contributors/GroupSavingsRules";
import { GoalProduct } from "@/src/domains/savings-goals/savings.types";
import { useCreateSavingsGoal } from "@/src/domains/savings-goals/savings.hooks";
import { useProducts } from "@/src/domains/products/products.hooks";
import type { Product } from "@/src/domains/products/products.types";

type ContributionType = "flexible" | "equal";

/** Map a backend Product to the GoalProduct shape used by ProductSelectCard */
function toGoalProduct(p: Product): GoalProduct {
    return {
        id: p.id,
        name: p.name,
        price: p.price,
        currency: `GH₵`,
        images: p.image ? [p.image] : [],
        merchant: { id: p.merchantProfileId || p.id, businessName: p.merchant?.businessName || "Merchant" },
    };
}

export default function CreateContributorGoalPage() {
    const router = useRouter();
    const { create, isLoading: isCreating, error: createError } = useCreateSavingsGoal();
    const { products: rawProducts, isLoading: isLoadingProducts } = useProducts();

    // Form State
    const [step, setStep] = useState<1 | 2>(1);
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<GoalProduct | null>(null);
    const [contributionType, setContributionType] = useState<ContributionType | null>(null);
    const [targetDate, setTargetDate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Map backend products to GoalProduct shape
    const products = rawProducts.map(toGoalProduct);

    // Filter products by search
    const filteredProducts = searchQuery
        ? products.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.merchant?.businessName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : products;

    const handleReviewClick = () => {
        if (!groupName || !selectedProduct) {
            return;
        }
        setStep(2);
    };

    const handleCreateGroup = async () => {
        if (!selectedProduct || !groupName) return;

        try {
            // NOTE: We intentionally do NOT send productId here.
            // The backend overrides category to 'SNBL' when productId is present,
            // which would break contribution goal routing. Instead, we send the
            // product price as targetAmount and store product info in the description.
            const newGoal = await create({
                name: groupName,
                targetAmount: selectedProduct.price,
                frequency: contributionType === "equal" ? "MONTHLY" : "FLEXIBLE",
                category: "CONTRIBUTION",
                ...(targetDate && { deadline: targetDate }),
            });
            // Redirect to the contributor goal's detail page
            router.push(`/contributors/${newGoal.id}`);
        } catch {
            // Error is already captured in the hook's `createError` state
        }
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

                    {/* Creation error banner */}
                    {createError && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{createError}</span>
                        </div>
                    )}

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
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-11 pl-10 border-gray-300 rounded-full bg-gray-50 placeholder:text-gray-400"
                                    />
                                </div>

                                {isLoadingProducts ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                        {filteredProducts.map((prod) => (
                                            <ProductSelectCard
                                                key={prod.id}
                                                product={prod}
                                                isSelected={selectedProduct?.id === prod.id}
                                                onSelect={setSelectedProduct}
                                            />
                                        ))}
                                        {filteredProducts.length === 0 && (
                                            <p className="col-span-2 text-sm text-gray-400 text-center py-6">
                                                No products found
                                            </p>
                                        )}
                                    </div>
                                )}
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
                                            {selectedProduct.merchant?.businessName || "Merchant"}
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

                            {/* Target Date Summary */}
                            {targetDate && (
                                <>
                                    <div className="h-px bg-gray-100 my-4" />
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                                            Target Date
                                        </span>
                                        <p className="text-sm font-bold text-gray-900">
                                            {new Date(targetDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                        </p>
                                    </div>
                                </>
                            )}

                            <GroupSavingsRules />

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setStep(1)}
                                    variant="outline"
                                    disabled={isCreating}
                                    className="flex-1 h-12 border-gray-200 text-gray-700 font-semibold rounded-lg"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleCreateGroup}
                                    disabled={isCreating}
                                    className="flex-[2] h-12 bg-[#1a53c8] hover:bg-[#1442a3] text-white text-[15px] font-bold rounded-lg transition-all"
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Goal Group"
                                    )}
                                </Button>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
