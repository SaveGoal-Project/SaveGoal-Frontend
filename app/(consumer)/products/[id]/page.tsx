"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Heart,
    Share2,
    Star,
    ShieldCheck,
    Truck,
    RotateCcw,
    Check,
    Calculator,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
    getProductById,
    type MockProduct,
} from "@/src/domains/products/products.mock";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [product, setProduct] = useState<MockProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const fetchProduct = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getProductById(productId);
            if (data) {
                setProduct(data);
            }
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const formatReviewCount = (count: number) => {
        if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
        return count.toString();
    };

    // Savings calculator logic
    const calculatePayment = (
        price: number,
        frequency: "weekly" | "biweekly" | "monthly"
    ) => {
        switch (frequency) {
            case "weekly":
                return { amount: Math.ceil(price / 20), periods: 20, label: "20 Weeks" };
            case "biweekly":
                return { amount: Math.ceil(price / 10), periods: 10, label: "10 Bi-weeks" };
            case "monthly":
                return { amount: Math.ceil(price / 5), periods: 5, label: "5 Months" };
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="animate-pulse space-y-8">
                    <div className="h-4 bg-gray-200 rounded w-64" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="h-[450px] bg-gray-200 rounded-2xl" />
                        <div className="space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-24" />
                            <div className="h-10 bg-gray-200 rounded w-3/4" />
                            <div className="h-8 bg-gray-200 rounded w-40" />
                            <div className="h-20 bg-gray-200 rounded w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Product Not Found
                </h2>
                <p className="text-gray-500 mb-6">
                    The product you&apos;re looking for doesn&apos;t exist.
                </p>
                <Button
                    onClick={() => router.push("/products")}
                    className="bg-[#3d4a99] hover:bg-[#2d3369] text-white rounded-xl px-6"
                >
                    Browse Products
                </Button>
            </div>
        );
    }

    const weeklyPlan = calculatePayment(product.price, "weekly");
    const biweeklyPlan = calculatePayment(product.price, "biweekly");
    const monthlyPlan = calculatePayment(product.price, "monthly");

    return (
        <div className="min-h-screen bg-[#f7f8fc]">
            <div className="container mx-auto px-4 py-6 md:py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-8">
                    <Link
                        href="/products"
                        className="text-[#3d4a99] hover:underline font-medium"
                    >
                        Products
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    <Link
                        href="/products"
                        className="text-[#3d4a99] hover:underline font-medium"
                    >
                        {product.category}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-gray-500">{product.name}</span>
                </nav>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column — Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden border border-gray-100">
                            <Image
                                src={product.images[selectedImage] || product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-3">
                            {product.images.map((img: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative w-[100px] h-[80px] rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                                        ? "border-[#3d4a99] ring-2 ring-[#3d4a99]/20"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.name} view ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            <div className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-gray-100">
                                <ShieldCheck className="h-6 w-6 text-[#3d4a99]" />
                                <span className="text-xs font-medium text-gray-600 text-center">
                                    Buyer Protection
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-gray-100">
                                <Truck className="h-6 w-6 text-[#3d4a99]" />
                                <span className="text-xs font-medium text-gray-600 text-center">
                                    Fast Deliveries
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-gray-100">
                                <RotateCcw className="h-6 w-6 text-[#3d4a99]" />
                                <span className="text-xs font-medium text-gray-600 text-center">
                                    Easy Returns
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column — Product Info */}
                    <div className="space-y-6">
                        {/* Top Row: Category + Actions */}
                        <div className="flex items-start justify-between">
                            <span className="bg-[#3d4a99]/10 text-[#3d4a99] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#3d4a99]/20">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${isWishlisted
                                        ? "border-red-400 bg-red-50 text-red-500"
                                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                                        }`}
                                >
                                    <Heart
                                        className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                                    />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-400 hover:border-gray-300 transition-all">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Product Name */}
                        <h1 className="text-2xl md:text-3xl font-bold text-black">
                            {product.name}
                        </h1>

                        {/* Brand + Rating */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-[#3d4a99]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#3d4a99] text-[10px] font-bold">
                                        {product.brand.charAt(0)}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-[#3d4a99]">
                                    {product.brand}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star className="h-4 w-4 fill-[#ffce31] text-[#ffce31]" />
                                <span className="text-sm text-gray-600">
                                    <span className="font-medium">{product.rating}</span>
                                    <span className="text-gray-400">
                                        {" "}
                                        rating ({formatReviewCount(product.reviewCount)} reviews)
                                    </span>
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl md:text-4xl font-bold text-[#3d4a99]">
                                {product.formattedPrice || `GH¢${product.price.toLocaleString()}`}
                            </span>
                            <span className="text-sm text-gray-400">Total Price</span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Specifications */}
                        <div className="space-y-3">
                            <h3 className="text-base font-bold text-black">Specifications</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {product.specifications.map((spec: { label: string; value: string }, index: number) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <Check className="h-4 w-4 text-[#3d4a99] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">{spec.label}</p>
                                            <p className="text-sm font-semibold text-black">
                                                {spec.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Savings Plan Calculator Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5 shadow-sm">
                            {/* Calculator Header */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#3d4a99]/10 rounded-xl flex items-center justify-center">
                                    <Calculator className="h-5 w-5 text-[#3d4a99]" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-black">
                                        Savings Plan Calculator
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Customize your savings journey
                                    </p>
                                </div>
                            </div>

                            {/* Plan Options */}
                            <div className="space-y-3">
                                {/* Weekly */}
                                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-sm font-semibold text-black">Weekly</p>
                                        <p className="text-[11px] text-gray-400">
                                            {weeklyPlan.label}
                                        </p>
                                    </div>
                                    <span className="text-sm font-bold text-[#3d4a99]">
                                        GH¢ {weeklyPlan.amount.toLocaleString()}
                                    </span>
                                </div>

                                {/* Bi-weekly */}
                                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-sm font-semibold text-black">
                                            Bi-weekly
                                        </p>
                                        <p className="text-[11px] text-gray-400">
                                            {biweeklyPlan.label}
                                        </p>
                                    </div>
                                    <span className="text-sm font-bold text-[#3d4a99]">
                                        GH¢ {biweeklyPlan.amount.toLocaleString()}
                                    </span>
                                </div>

                                {/* Monthly */}
                                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-sm font-semibold text-black">Monthly</p>
                                        <p className="text-[11px] text-gray-400">
                                            {monthlyPlan.label}
                                        </p>
                                    </div>
                                    <span className="text-sm font-bold text-[#3d4a99]">
                                        GH¢ {monthlyPlan.amount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* CTA */}
                            <Button
                                onClick={() => router.push(`/products/${productId}/save`)}
                                className="w-full h-12 bg-[#3d4a99] hover:bg-[#2d3369] text-white text-sm font-semibold rounded-xl transition-all duration-300"
                            >
                                Start Saving for This Product
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
