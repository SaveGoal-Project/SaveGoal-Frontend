'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    Package,
    Phone,
    Printer,
    Mail,
    MapPin,
    Truck,
    XCircle,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { useOrder } from '@/src/domains/orders/orders.hooks';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Delivered':
            return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Delivered</Badge>;
        case 'Processing':
            return <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"><Clock className="w-3.5 h-3.5 mr-1" />Processing</Badge>;
        case 'Shipped':
            return <Badge className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50"><Truck className="w-3.5 h-3.5 mr-1" />Shipped</Badge>;
        case 'Pending':
            return <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"><Clock className="w-3.5 h-3.5 mr-1" />Pending</Badge>;
        case 'Cancelled':
            return <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50"><XCircle className="w-3.5 h-3.5 mr-1" />Cancelled</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { order, isLoading, error } = useOrder(id);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-[500px] lg:col-span-2 rounded-2xl" />
                    <Skeleton className="h-[500px] rounded-2xl" />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl border border-red-100 ring-1 ring-red-50">
                <p className="text-red-600 font-medium">Error: {error || "Order not found"}</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-900">{order.id}</h1>
                            {getStatusBadge(order.orderStatus)}
                        </div>
                        <p className="text-slate-500 text-sm mt-1">Placed on {order.date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Printer className="w-4 h-4" />
                        Print Invoice
                    </Button>
                    <Button className="bg-[#1A53C8] hover:bg-[#1542a1] text-white">
                        Complete Fulfillment
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Order details & Products */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">Order Items</h2>
                        </div>
                        <div className="p-6">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        <th className="pb-4">Product</th>
                                        <th className="pb-4">Qty</th>
                                        <th className="pb-4 text-right">Price</th>
                                        <th className="pb-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {order.items?.map((item) => (
                                        <tr key={item.id} className="group">
                                            <td className="py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                                                        {item.image && (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{item.name}</p>
                                                        <p className="text-xs text-slate-500">ID: {item.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-slate-600 font-medium">x{item.quantity}</td>
                                            <td className="py-4 text-right font-medium text-slate-900">{item.price}</td>
                                            <td className="py-4 text-right font-bold text-slate-900">{item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <Separator className="my-6" />

                            <div className="space-y-3 max-w-sm ml-auto">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-medium text-slate-900">{order.amount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Delivery Fee</span>
                                    <span className="font-medium text-slate-900">GH¢ 50.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Tax (VAT 3%)</span>
                                    <span className="font-medium text-slate-900">GH¢ 30.00</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-slate-900">Total</span>
                                    <span className="text-xl font-bold text-[#1A53C8]">{order.amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Order Timeline</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div className="w-0.5 h-full bg-slate-100 my-1" />
                                </div>
                                <div className="pb-6">
                                    <p className="font-bold text-slate-900">Order Placed</p>
                                    <p className="text-sm text-slate-500">{order.date} at 10:45 AM</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div className="w-0.5 h-full bg-slate-100 my-1" />
                                </div>
                                <div className="pb-6">
                                    <p className="font-bold text-slate-900">Payment Confirmed</p>
                                    <p className="text-sm text-slate-500">{order.date} at 10:50 AM</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Status Updated to "{order.orderStatus}"</p>
                                    <p className="text-sm text-slate-500">{order.date} at 2:30 PM by Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Customer Profile</h2>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#1A53C8] font-bold text-lg">
                                    {order.customer.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{order.customer}</p>
                                    <p className="text-xs text-slate-500">Customer since 2024</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-slate-500 mb-0.5">Email Address</p>
                                        <p className="font-medium text-slate-900">{order.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-slate-500 mb-0.5">Phone Number</p>
                                        <p className="font-medium text-slate-900">{order.phone || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Shipping Address</h2>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium text-slate-900 leading-relaxed">
                                    {order.shippingAddress || "No address provided"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f0f9ff] rounded-2xl border border-blue-100 p-6">
                        <h3 className="font-bold text-blue-900 mb-2">Internal Note</h3>
                        <p className="text-sm text-blue-700 leading-relaxed mb-4">
                            Customer requested call before delivery. Please ensure delivery partner is informed.
                        </p>
                        <Button variant="ghost" size="sm" className="text-blue-700 h-auto p-0 hover:bg-transparent flex items-center gap-1 font-semibold">
                            Edit notes <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
