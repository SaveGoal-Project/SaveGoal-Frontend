"use client"

import { useState } from "react"
import {
    Check,
    ChevronRight,
    DollarSign,
    Layers,
    Package,
    Plus,
    Type,
    Upload,
    X
} from "lucide-react"

import { Button } from "@/src/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select"
import { cn } from "@/src/lib/utils"

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
}

type Step = "basic" | "inventory" | "media" | "review"

const steps: { id: Step; label: string; icon: any }[] = [
    { id: "basic", label: "Basic Info", icon: Type },
    { id: "inventory", label: "Inventory", icon: Layers },
    { id: "media", label: "Media", icon: Upload },
    { id: "review", label: "Review", icon: Check },
]

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
    const [currentStep, setCurrentStep] = useState<Step>("basic")
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        sku: "",
        stock: "",
        images: [] as string[]
    })

    const handleNext = () => {
        const currentIndex = steps.findIndex((s) => s.id === currentStep)
        if (currentIndex < steps.length - 1) {
            const nextStep = steps[currentIndex + 1]
            if (nextStep) setCurrentStep(nextStep.id)
        }
    }

    const handleBack = () => {
        const currentIndex = steps.findIndex((s) => s.id === currentStep)
        if (currentIndex > 0) {
            const prevStep = steps[currentIndex - 1]
            if (prevStep) setCurrentStep(prevStep.id)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0])
            setFormData({ ...formData, images: [...formData.images, url] })
        }
    }

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        })
    }

    const handleSubmit = () => {
        // Here you would typically send the data to your backend
        console.log("Submitting product:", formData)
        onClose()
        // Reset form
        setFormData({
            name: "",
            description: "",
            category: "",
            price: "",
            sku: "",
            stock: "",
            images: [],
        })
        setCurrentStep("basic")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl sm:max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                        Add a new product to your inventory in a few simple steps.
                    </DialogDescription>
                </DialogHeader>

                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-8 mt-4 px-2">
                    {steps.map((step, index) => {
                        const isActive = step.id === currentStep
                        const isCompleted = steps.findIndex((s) => s.id === currentStep) > index

                        return (
                            <div key={step.id} className="flex flex-col items-center relative z-10">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200 bg-white",
                                        isActive
                                            ? "border-[#1A53C8] text-[#1A53C8]"
                                            : isCompleted
                                                ? "border-[#1A53C8] bg-[#1A53C8] text-white"
                                                : "border-slate-200 text-slate-400"
                                    )}
                                >
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <span
                                    className={cn(
                                        "text-xs font-medium mt-2",
                                        isActive ? "text-[#1A53C8]" : "text-slate-500"
                                    )}
                                >
                                    {step.label}
                                </span>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className={cn(
                                        "absolute top-5 left-1/2 w-[calc(100%+3rem)] h-[2px] -z-10",
                                        steps.findIndex((s) => s.id === currentStep) > index ? "bg-[#1A53C8]" : "bg-slate-200"
                                    )} />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Step Content */}
                <div className="py-4 min-h-[300px]">
                    {currentStep === "basic" && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Apple MacBook Pro 14"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your product..."
                                    className="min-h-[100px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="fashion">Fashion</SelectItem>
                                        <SelectItem value="home">Home & Living</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {currentStep === "inventory" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (GH¢)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-9"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    placeholder="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input
                                    id="sku"
                                    placeholder="e.g. MB-PRO-14-2025"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === "media" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl bg-slate-50 border border-slate-200 overflow-hidden group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-[#1A53C8] hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                                    <Plus className="w-6 h-6 text-slate-400 mb-2" />
                                    <span className="text-xs text-slate-500 font-medium">Add Image</span>
                                    <Input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>
                    )}

                    {currentStep === "review" && (
                        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                            <div className="flex gap-4">
                                {formData.images[0] ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={formData.images[0]} alt="Preview" className="w-20 h-20 rounded-lg object-cover bg-white border border-slate-200" />
                                ) : (
                                    <div className="w-20 h-20 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                                        <Package className="w-8 h-8" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{formData.name || "Untitled Product"}</h3>
                                    <p className="text-sm text-slate-500">{formData.category || "Uncategorized"}</p>
                                    <p className="font-semibold text-[#1A53C8] mt-1">{formData.price ? `GH¢${formData.price}` : "Price TBD"}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-200 pt-4">
                                <div>
                                    <span className="text-slate-500">Stock:</span>
                                    <span className="ml-2 font-medium text-slate-900">{formData.stock || 0}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">SKU:</span>
                                    <span className="ml-2 font-medium text-slate-900">{formData.sku || "-"}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
                    <Button
                        variant="outline"
                        onClick={currentStep === "basic" ? onClose : handleBack}
                    >
                        {currentStep === "basic" ? "Cancel" : "Back"}
                    </Button>

                    <Button
                        className="bg-[#1A53C8] hover:bg-[#1542a1] text-white gap-2"
                        onClick={currentStep === "review" ? handleSubmit : handleNext}
                    >
                        {currentStep === "review" ? (
                            <>
                                <Check className="w-4 h-4" /> Save Product
                            </>
                        ) : (
                            <>
                                Next <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
