'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';
import { useOrder } from '@/src/domains/orders/orders.hooks';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Button } from '@/src/components/ui/button';

function formatCurrency(amount: number, currency = 'GHS') {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-GH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(value));
}

export default function MerchantOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { order, isLoading, error, refetch } = useOrder(id);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-40 rounded-xl" />
                <Skeleton className="h-[520px] rounded-2xl" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-bold text-slate-900">Order not available</h1>
                <p className="mt-2 text-sm text-slate-500">{error || 'The merchant order could not be found.'}</p>
                <div className="mt-4 flex items-center justify-center gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/merchant/orders">Back to orders</Link>
                    </Button>
                    <Button className="bg-[#1A53C8] text-white hover:bg-[#1542a1]" onClick={refetch}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="outline" asChild>
                    <Link href="/merchant/orders">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{order.productName}</h1>
                    <p className="text-sm text-slate-500">{order.reference || order.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr,1fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-100 p-4">
                            <p className="text-sm text-slate-500">Order Status</p>
                            <p className="mt-1 font-semibold text-slate-900">{order.orderStatus}</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 p-4">
                            <p className="text-sm text-slate-500">Payment Status</p>
                            <p className="mt-1 font-semibold text-slate-900">{order.paymentStatus}</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 p-4">
                            <p className="text-sm text-slate-500">Created</p>
                            <p className="mt-1 font-semibold text-slate-900">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 p-4">
                            <p className="text-sm text-slate-500">Total Amount</p>
                            <p className="mt-1 font-semibold text-slate-900">{formatCurrency(order.amount, order.currency)}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-base font-bold text-slate-900">Items</h3>
                        <div className="mt-4 space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                                            {item.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            ) : null}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{item.name}</p>
                                            <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-slate-900">{formatCurrency(item.unitPrice, order.currency)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Customer</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <p className="text-sm text-slate-500">Name</p>
                                <p className="font-semibold text-slate-900">{order.customerName || 'Unknown customer'}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500">Email</p>
                                    <p className="font-medium text-slate-900">{order.customerEmail || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500">Phone</p>
                                    <p className="font-medium text-slate-900">{order.customerPhone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500">Address</p>
                                    <p className="font-medium text-slate-900">{order.shippingAddress || 'No saved shipping address'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Reference</h2>
                        <p className="mt-4 break-all text-sm text-slate-600">{order.reference || order.id}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
