'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    Package,
    AlertTriangle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { AddProductModal } from '@/src/components/products/add-product-modal';
import { useDeleteMerchantProduct, useMerchantProducts, useProductStats } from '@/src/domains/products/products.hooks';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Badge } from '@/src/components/ui/badge';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Active':
            return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 font-medium">Active</Badge>;
        case 'Low Stock':
            return <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50 font-medium"><AlertTriangle className="w-3 h-3 mr-1" />Low Stock</Badge>;
        case 'Out of Stock':
            return <Badge className="bg-red-50 text-red-700 border-red-100 hover:bg-red-50 font-medium"><AlertTriangle className="w-3 h-3 mr-1" />Out of Stock</Badge>;
        case 'Draft':
            return <Badge variant="outline" className="text-slate-500 font-medium">Draft</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function MerchantProductsPage() {
    const { products, isLoading: isProductsLoading, error: productsError, refetch } = useMerchantProducts();
    const { stats, isLoading: isStatsLoading } = useProductStats();
    const { remove, isSubmitting: isDeleting } = useDeleteMerchantProduct();
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (productId: string) => {
        const confirmed = window.confirm("Archive this product from your catalog?");
        if (!confirmed) {
            return;
        }

        try {
            await remove(productId);
            await refetch();
        } catch (err) {
            console.error(err instanceof Error ? err.message : "Failed to delete product");
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (productsError) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl border border-red-100 shadow-sm">
                <p className="text-red-600 font-medium">Error: {productsError}</p>
                <Button variant="outline" className="mt-4" onClick={() => refetch()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your catalog and inventory</p>
                </div>
                <Button
                    className="gap-2 bg-[#1A53C8] hover:bg-[#1542a1] text-white rounded-xl h-11 px-6 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    onClick={() => setIsAddProductOpen(true)}
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {isStatsLoading ? (
                    Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
                ) : (
                    <>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                                <Package className="w-5 h-5 text-[#1A53C8]" />
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Total Products</p>
                            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.totalProducts}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Active Items</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{stats?.activeProducts}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Low Stock</p>
                            <p className="text-2xl font-bold text-amber-600 mt-0.5">{stats?.lowStock}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-600 mt-0.5">{stats?.outOfStock}</p>
                        </div>
                    </>
                )}
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Search and Filters */}
                <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/30">
                    <div className="relative flex-1 lg:max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/10 focus:border-[#1A53C8] transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 font-medium flex-1 sm:flex-none">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left text-sm min-w-[900px]">
                        <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-4 md:px-6 py-4">Product</th>
                                <th className="px-4 md:px-6 py-4">Category</th>
                                <th className="px-4 md:px-6 py-4">Price</th>
                                <th className="px-4 md:px-6 py-4">Stock</th>
                                <th className="px-4 md:px-6 py-4">Status</th>
                                <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isProductsLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="px-6 py-8"><Skeleton className="h-6 w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <Package className="w-8 h-8 text-slate-200" />
                                            </div>
                                            <p className="text-slate-500 font-medium">No products found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={product.image || undefined} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 truncate max-w-[200px]">{product.name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">SKU: {product.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-bold">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            {product.formattedPrice || `GH¢${product.price.toLocaleString()}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-semibold ${(product.stock ?? 0) === 0 ? 'text-red-600' : (product.stock ?? 0) < 10 ? 'text-amber-600' : 'text-slate-900'}`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(product.status || 'Active')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#1A53C8]">
                                                    <Link href={`/merchant/products/${product.id}`}>
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#1A53C8]">
                                                    <Link href={`/merchant/products/${product.id}`}>
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={isDeleting}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <p className="text-xs font-medium text-slate-500">
                        {isProductsLoading ? "Loading..." : `Showing ${filteredProducts.length} items`}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-1">
                            <Button variant="secondary" size="sm" className="h-9 w-9 p-0 rounded-lg bg-[#1A53C8] text-white">1</Button>
                        </div>
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <AddProductModal
                isOpen={isAddProductOpen}
                onClose={() => setIsAddProductOpen(false)}
                onSuccess={() => {
                    setIsAddProductOpen(false);
                    refetch();
                }}
            />
        </div>
    );
}
