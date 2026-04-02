"use client"

import { useState } from "react"
import {
    Check,
    ChevronRight,
    Layers,
    type LucideIcon,
    Package,
    Plus,
    Type,
    Upload,
    X,
    Loader2
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
import { useCreateProduct } from "@/src/domains/products/products.hooks"
import { uploadProductImage } from "@/src/lib/supabase"

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

type Step = "basic" | "inventory" | "media" | "review"

const steps: { id: Step; label: string; icon: LucideIcon }[] = [
    { id: "basic", label: "Basic Info", icon: Type },
    { id: "inventory", label: "Inventory", icon: Layers },
    { id: "media", label: "Media", icon: Upload },
    { id: "review", label: "Review", icon: Check },
]

export function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
    const { create, isSubmitting, error: submitError } = useCreateProduct()
    const [currentStep, setCurrentStep] = useState<Step>("basic")
    const [isUploading, setIsUploading] = useState(false)
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploading(true);
            const url = await uploadProductImage(file);
            setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
        } catch (err) {
            console.error('Image upload failed:', err instanceof Error ? err.message : err);
        } finally {
            setIsUploading(false);
        }
    }

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        })
    }

    const handleSubmit = async () => {
        try {
            await create({
                name: formData.name,
                description: formData.description,
                category: formData.category,
                price: `GH¢${formData.price}`,
                sku: formData.sku,
                stock: parseInt(formData.stock) || 0,
                images: formData.images
            })

            onSuccess?.()

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
        } catch (err) {
            console.error(err instanceof Error ? err.message : "Failed to create product")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl sm:max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add New Product</DialogTitle>
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
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200 bg-white shadow-sm",
                                        isActive
                                            ? "border-[#1A53C8] text-[#1A53C8] ring-4 ring-blue-50"
                                            : isCompleted
                                                ? "border-[#1A53C8] bg-[#1A53C8] text-white"
                                                : "border-slate-200 text-slate-400"
                                    )}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                </div>
                                <span
                                    className={cn(
                                        "text-[11px] font-bold mt-2 uppercase tracking-wide",
                                        isActive ? "text-[#1A53C8]" : "text-slate-400"
                                    )}
                                >
                                    {step.label}
                                </span>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className={cn(
                                        "absolute top-5 left-1/2 w-[calc(100%+3rem)] h-[2px] -z-10",
                                        steps.findIndex((s) => s.id === currentStep) > index ? "bg-[#1A53C8]" : "bg-slate-100"
                                    )} />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Step Content */}
                <div className="py-4 min-h-[300px]">
                    {submitError && (
                        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {submitError}
                        </div>
                    )}

                    {currentStep === "basic" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-bold text-slate-700">Product Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Apple MacBook Pro 14"
                                    className="rounded-xl h-11"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-bold text-slate-700">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your product..."
                                    className="min-h-[120px] rounded-xl"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-bold text-slate-700">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                        <SelectItem value="Clothing">Clothing</SelectItem>
                                        <SelectItem value="Sneakers">Sneakers</SelectItem>
                                        <SelectItem value="Health">Health</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {currentStep === "inventory" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-bold text-slate-700">Price (GH¢)</Label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">GH¢</div>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-12 h-11 rounded-xl"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock" className="text-sm font-bold text-slate-700">Stock Quantity</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    placeholder="0"
                                    className="h-11 rounded-xl"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="sku" className="text-sm font-bold text-slate-700">SKU (Stock Keeping Unit)</Label>
                                <Input
                                    id="sku"
                                    placeholder="e.g. MB-PRO-14-2025"
                                    className="h-11 rounded-xl"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === "media" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Label className="text-sm font-bold text-slate-700">Product Images</Label>
                            <div className="grid grid-cols-3 gap-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden group shadow-sm transition-all hover:ring-2 hover:ring-[#1A53C8]/20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}

                                <label className={cn("aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#1A53C8] hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group", isUploading && "opacity-50 pointer-events-none")}>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-[#1A53C8]/10 transition-colors">
                                        {isUploading ? <Loader2 className="w-5 h-5 text-slate-400 animate-spin" /> : <Plus className="w-5 h-5 text-slate-400 group-hover:text-[#1A53C8]" />}
                                    </div>
                                    <span className="text-xs text-slate-500 font-bold">{isUploading ? "Uploading..." : "Add Image"}</span>
                                    <Input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>
                    )}

                    {currentStep === "review" && (
                        <div className="bg-slate-50 rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex gap-4">
                                {formData.images[0] ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={formData.images[0]} alt="Preview" className="w-24 h-24 rounded-2xl object-cover bg-white border border-slate-200 shadow-sm" />
                                ) : (
                                    <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-sm">
                                        <Package className="w-10 h-10" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900 leading-tight">{formData.name || "Untitled Product"}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-blue-100 text-[#1A53C8] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{formData.category || "General"}</span>
                                        <span className="text-slate-300 text-xs">|</span>
                                        <span className="text-slate-500 text-xs font-medium">SKU: {formData.sku || "N/A"}</span>
                                    </div>
                                    <p className="font-bold text-xl text-[#1A53C8] mt-2">{formData.price ? `GH¢${formData.price}` : "Price TBD"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-200 pt-6">
                                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Stock Level</p>
                                    <p className="text-lg font-bold text-slate-900">{formData.stock || 0} Units</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Listing Status</p>
                                    <p className="text-lg font-bold text-emerald-600">Ready to Publish</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Product Description</p>
                                <p className="text-sm text-slate-600 leading-relaxed italic">{formData.description || "No description provided."}</p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex items-center justify-between sm:justify-between w-full border-t border-slate-100 pt-6">
                    <Button
                        variant="ghost"
                        className="rounded-xl font-bold text-slate-500 hover:text-slate-900 px-6 h-11"
                        onClick={currentStep === "basic" ? onClose : handleBack}
                        disabled={isSubmitting}
                    >
                        {currentStep === "basic" ? "Cancel" : "Back"}
                    </Button>

                    <Button
                        className="bg-[#1A53C8] hover:bg-[#1542a1] text-white gap-2 rounded-xl px-8 h-11 font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                        onClick={currentStep === "review" ? handleSubmit : handleNext}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : currentStep === "review" ? (
                            <>
                                <Check className="w-5 h-5" /> Publish Product
                            </>
                        ) : (
                            <>
                                Next <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
