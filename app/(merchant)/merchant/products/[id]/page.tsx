'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Textarea } from '@/src/components/ui/textarea';
import { useMerchantProduct, useUpdateMerchantProduct } from '@/src/domains/products/products.hooks';
import type { Product } from '@/src/domains/products/products.types';

type ProductFormState = {
    name: string;
    description: string;
    category: string;
    price: string;
    sku: string;
    stock: string;
    imageUrls: string;
    isAvailable: boolean;
};

function toFormState(product: Product): ProductFormState {
    return {
        name: product.name,
        description: product.description || "",
        category: product.category || "",
        price: String(product.price),
        sku: product.sku || "",
        stock: String(product.stock ?? 0),
        imageUrls: (product.images || []).join("\n"),
        isAvailable: product.isAvailable !== false,
    };
}

function ProductEditor({
    product,
    onSave,
    isSubmitting,
}: {
    product: Product;
    onSave: (state: ProductFormState) => Promise<void>;
    isSubmitting: boolean;
}) {
    const [form, setForm] = useState<ProductFormState>(() => toFormState(product));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild className="h-10 w-10">
                    <Link href="/merchant/products">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
                    <p className="text-sm text-slate-500">Update your merchant catalog details.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            className="min-h-[140px]"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrls">Image URLs</Label>
                        <Textarea
                            id="imageUrls"
                            className="min-h-[120px]"
                            placeholder="One image URL per line"
                            value={form.imageUrls}
                            onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
                        />
                    </div>
                </section>

                <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={form.stock}
                                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input id="sku" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="listingStatus">Listing Status</Label>
                        <select
                            id="listingStatus"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                            value={form.isAvailable ? "ACTIVE" : "DRAFT"}
                            onChange={(e) => setForm({ ...form, isAvailable: e.target.value === "ACTIVE" })}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="DRAFT">Draft</option>
                        </select>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
                        <p className="mt-2 text-lg font-bold text-slate-900">{form.name || "Untitled product"}</p>
                        <p className="text-sm text-slate-500">{form.category || "Uncategorized"}</p>
                        <p className="mt-2 font-semibold text-[#1A53C8]">GH¢{form.price || "0"}</p>
                    </div>
                </section>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
                <Button variant="outline" asChild>
                    <Link href="/merchant/products">Cancel</Link>
                </Button>
                <Button
                    className="bg-[#1A53C8] text-white hover:bg-[#1542a1]"
                    disabled={isSubmitting}
                    onClick={() => onSave(form)}
                >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}

export default function MerchantProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { product, isLoading, error } = useMerchantProduct(id);
    const { update, isSubmitting } = useUpdateMerchantProduct();

    const handleSave = async (state: ProductFormState) => {
        const images = state.imageUrls
            .split("\n")
            .map((value) => value.trim())
            .filter(Boolean);

        try {
            await update(id, {
                name: state.name.trim(),
                description: state.description.trim(),
                category: state.category.trim(),
                price: state.price,
                sku: state.sku.trim(),
                stock: Number.parseInt(state.stock, 10) || 0,
                images,
                isAvailable: state.isAvailable,
            });
            router.push("/merchant/products");
        } catch (err) {
            console.error(err instanceof Error ? err.message : "Failed to update product");
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-52" />
                <Skeleton className="h-[420px] rounded-2xl" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
                <p className="font-medium text-red-600">{error || "Product not found"}</p>
                <Button variant="outline" className="mt-4" asChild>
                    <Link href="/merchant/products">Back to products</Link>
                </Button>
            </div>
        );
    }

    return <ProductEditor product={product} onSave={handleSave} isSubmitting={isSubmitting} />;
}
