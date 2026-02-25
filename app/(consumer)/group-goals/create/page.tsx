"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Search, Users, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { useCreateGroupGoal } from "@/src/domains/savings-goals/savings.hooks";
import { getProducts, type MockProduct } from "@/src/domains/products/products.mock";

type CreationStep = 1 | 2;

export default function CreateGroupGoalPage() {
    const router = useRouter();
    const { create, isLoading: isCreating } = useCreateGroupGoal();

    // Step State
    const [step, setStep] = useState<CreationStep>(1);

    // Form State
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [contributionType, setContributionType] = useState<"FLEXIBLE" | "EQUAL">("FLEXIBLE");
    const [targetDate, setTargetDate] = useState("");

    // Products State
    const [products, setProducts] = useState<MockProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Error State
    const [formError, setFormError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedProduct = products.find(p => p.id === selectedProductId);

    const handleNextStep = () => {
        setFormError("");
        if (!groupName.trim()) {
            setFormError("Group Name is required.");
            return;
        }
        if (!selectedProductId) {
            setFormError("Please select a product for the group goal.");
            return;
        }
        setStep(2);
    };

    const handleCreateGroup = async () => {
        if (!selectedProductId) return;

        try {
            const result = await create({
                name: groupName,
                description,
                productId: selectedProductId,
                contributionType,
                targetDate: targetDate || undefined
            });
            // Redirect to the new group dashboard
            router.push(`/group-goals/${result.id}`);
        } catch (error) {
            console.error("Failed to create group:", error);
            setFormError(error instanceof Error ? error.message : "Failed to create group");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Navigation */}
            <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
                <div className="container mx-auto max-w-3xl flex items-center justify-between">
                    <button
                        onClick={() => step === 2 ? setStep(1) : router.back()}
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                    </button>
                    <div className="text-sm font-medium text-gray-400">
                        Step {step} of 2
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-2xl px-4 py-8">
                {/* Progress Bar */}
                <div className="flex items-center justify-between text-sm font-medium text-gray-500 mb-2 px-1">
                    <span className={step >= 1 ? "text-[#3b5bdb]" : ""}>Step 1 of 2</span>
                    <span className={step >= 2 ? "text-[#3b5bdb]" : ""}>{step === 2 ? "Review and Create" : "Group Details"}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full mb-8 overflow-hidden flex">
                    <div className="h-full bg-[#3b5bdb] transition-all duration-300" style={{ width: step === 1 ? '50%' : '100%' }} />
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-14 w-14 rounded-full bg-[#eef0ff] flex items-center justify-center shrink-0">
                            <Users className="h-7 w-7 text-[#3b5bdb]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {step === 1 ? "Saving Goal Details" : "Review & Create Group"}
                            </h1>
                            <p className="text-sm text-[#3b5bdb]">
                                {step === 1 ? "Save together with friends, family, or colleagues" : "Confirm your group savings details"}
                            </p>
                        </div>
                    </div>

                    {formError && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                            <p>{formError}</p>
                        </div>
                    )}

                    {step === 1 ? (
                        <div className="space-y-6">
                            {/* Group Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900">
                                    Group Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="e.g. Kusi and Friends"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="h-12 border-gray-300 focus:border-[#3b5bdb]"
                                />
                                <p className="text-xs text-gray-500">Choose a name that describes your group goal</p>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900">
                                    Description (Optional)
                                </label>
                                <Textarea
                                    placeholder="Tell your members what this goal is about..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[100px] border-gray-300 focus:border-[#3b5bdb] resize-none"
                                />
                            </div>

                            {/* Select Product */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-sm border border-gray-400 flex items-center justify-center">
                                        <div className="h-2 w-2 bg-gray-600 rounded-sm" />
                                    </div>
                                    Select Product <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-10 pl-9 rounded-full border-gray-300 bg-gray-50"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 pb-2">
                                    {filteredProducts.map(product => (
                                        <div
                                            key={product.id}
                                            onClick={() => setSelectedProductId(product.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedProductId === product.id
                                                    ? "border-[#3b5bdb] bg-[#eef0ff] ring-1 ring-[#3b5bdb]"
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                                }`}
                                        >
                                            <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden relative shrink-0 border border-gray-100">
                                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-[#3b5bdb] uppercase font-bold truncate">{product.brand}</p>
                                                <p className="text-xs font-bold text-gray-900 truncate leading-tight mt-0.5">{product.name}</p>
                                                <p className="text-xs text-[#3b5bdb] font-semibold mt-1">GH¢ {(product.price || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contribution Type */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    Contribution Type
                                </label>
                                <div className="grid gap-3">
                                    {/* Flexible */}
                                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${contributionType === "FLEXIBLE"
                                            ? "border-[#3b5bdb] bg-white ring-1 ring-[#3b5bdb]"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}>
                                        <div className={`h-5 w-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${contributionType === "FLEXIBLE" ? "border-[#3b5bdb]" : "border-gray-300"
                                            }`}>
                                            {contributionType === "FLEXIBLE" && <div className="h-3 w-3 rounded-full bg-[#3b5bdb]" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Flexible Contribution</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Members contribute any amount at any time</p>
                                        </div>
                                        <input
                                            type="radio"
                                            name="contributionType"
                                            value="FLEXIBLE"
                                            checked={contributionType === "FLEXIBLE"}
                                            onChange={() => setContributionType("FLEXIBLE")}
                                            className="hidden"
                                        />
                                    </label>

                                    {/* Equal */}
                                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${contributionType === "EQUAL"
                                            ? "border-[#3b5bdb] bg-white ring-1 ring-[#3b5bdb]"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}>
                                        <div className={`h-5 w-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${contributionType === "EQUAL" ? "border-[#3b5bdb]" : "border-gray-300"
                                            }`}>
                                            {contributionType === "EQUAL" && <div className="h-3 w-3 rounded-full bg-[#3b5bdb]" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Equal Contribution</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Split the target equally among all members</p>
                                        </div>
                                        <input
                                            type="radio"
                                            name="contributionType"
                                            value="EQUAL"
                                            checked={contributionType === "EQUAL"}
                                            onChange={() => setContributionType("EQUAL")}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Target Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Target Date (Optional)
                                </label>
                                <Input
                                    type="date"
                                    value={targetDate}
                                    onChange={(e) => setTargetDate(e.target.value)}
                                    className="h-12 border-gray-300 focus:border-[#3b5bdb]"
                                />
                                <p className="text-xs text-gray-500">Set a deadline to motivate your group</p>
                            </div>

                            <Button
                                onClick={handleNextStep}
                                className="w-full h-12 bg-[#2d3369] hover:bg-[#3d4a99] text-white text-base font-semibold rounded-xl mt-4"
                            >
                                Review Group Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Summary View */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Group Name</p>
                                    <p className="text-lg font-bold text-gray-900">{groupName}</p>
                                </div>

                                <div className="h-px w-full bg-gray-100" />

                                <div>
                                    {selectedProduct && (
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200 shrink-0">
                                                <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#3b5bdb] uppercase font-bold">{selectedProduct.brand}</p>
                                                <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedProduct.name}</p>
                                                <p className="text-sm font-bold text-[#3b5bdb] mt-0.5">GH¢ {(selectedProduct.price || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="h-px w-full bg-gray-100" />

                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase mb-1">Contribution Type</p>
                                    <p className="text-sm font-bold text-gray-900">{contributionType === "FLEXIBLE" ? "Flexible" : "Equal"}</p>
                                </div>

                                {/* Goals Warning Box */}
                                <div className="bg-[#fff9e6] border border-[#f5e3a8] rounded-xl p-5 mt-6">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                                        <span className="text-yellow-500">🔒</span> Group Savings Rules
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                                        <li>Only the group admin can change the product or cancel the group</li>
                                        <li>Funds are locked until the target is reached or group is cancelled</li>
                                        <li>No partial withdrawals are allowed</li>
                                    </ul>
                                </div>
                            </div>

                            <Button
                                onClick={handleCreateGroup}
                                disabled={isCreating}
                                className="w-full h-12 bg-[#2d3369] hover:bg-[#3d4a99] text-white text-base font-semibold rounded-xl mt-4"
                            >
                                {isCreating ? "Creating..." : "Create Goal Group"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
