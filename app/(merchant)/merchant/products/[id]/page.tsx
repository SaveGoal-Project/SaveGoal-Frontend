"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import {
    ChevronLeft,
    Upload,
    X,
    Plus,
    DollarSign,
    Tag,
    Layers,
    Type,
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"

// Mock Data for demonstration
const mockProduct = {
    id: 1,
    name: 'Apple MacBook Pro 14"',
    description: "Supercharged by M2 Pro or M2 Max, MacBook Pro takes its power and efficiency further than ever. It delivers exceptional performance whether it's plugged in or not, and now has even longer battery life.",
    category: "Electronics",
    price: 10000,
    discountedPrice: 9500,
    sku: "MB-PRO-14-2023",
    stock: 12,
    status: "Active",
    images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=2026&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop"
    ],
}

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    // const { id } = use(params) // In a real app, fetch execution using ID
    const [product, setProduct] = useState(mockProduct)
    const [images, setImages] = useState<string[]>(mockProduct.images)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0])
            setImages([...images, url])
        }
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="h-10 w-10 bg-white border-slate-200"
                >
                    <Link href="/merchant/products">
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
                    <p className="text-slate-500 text-sm">
                        Manage details for {product.name}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Details */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Type className="w-5 h-5 text-[#1A53C8]" />
                            Basic Information
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Description
                                </label>
                                <textarea
                                    value={product.description}
                                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm min-h-[150px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-[#1A53C8]" />
                            Product Images
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="relative aspect-square rounded-xl bg-slate-50 border border-slate-200 overflow-hidden group"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={img}
                                        alt={`Product ${idx}`}
                                        className="w-full h-full object-cover"
                                    />
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
                                <span className="text-xs text-slate-500 font-medium">
                                    Add Image
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                            Recommended size 1000x1000px. Max 5MB per image.
                        </p>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-[#1A53C8]" />
                            Inventory
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    value={product.sku}
                                    onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    value={product.stock}
                                    onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Organization & Pricing */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#1A53C8]" />
                            Pricing
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Base Price (GH¢)
                                </label>
                                <input
                                    type="number"
                                    value={product.price}
                                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Discounted Price (Optional)
                                </label>
                                <input
                                    type="number"
                                    value={product.discountedPrice}
                                    onChange={(e) => setProduct({ ...product, discountedPrice: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-[#1A53C8]" />
                            Organization
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Category
                                </label>
                                <select
                                    value={product.category}
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm bg-white"
                                >
                                    <option>Select Category</option>
                                    <option>Electronics</option>
                                    <option>Fashion</option>
                                    <option>Home & Living</option>
                                    <option>Health & Beauty</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Status
                                </label>
                                <select
                                    value={product.status}
                                    onChange={(e) => setProduct({ ...product, status: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm bg-white"
                                >
                                    <option>Active</option>
                                    <option>Draft</option>
                                    <option>Archived</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
                <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button className="bg-[#1A53C8] hover:bg-[#1542a1] text-white">
                    Save Changes
                </Button>
            </div>
        </div>
    )
}
