'use client';

import { useState } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Download,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    Truck
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';

// Mock Data
const orders = [
    {
        id: 'ORD-0091',
        customer: 'Kwame Adu',
        email: 'kwame.adu@example.com',
        product: 'Apple MacBook Pro 14"',
        date: 'Oct 24, 2025',
        amount: 'GH¢10,000.00',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
    },
    {
        id: 'ORD-0090',
        customer: 'Ama Owusu',
        email: 'ama.o@example.com',
        product: 'Sony PlayStation 5',
        date: 'Oct 23, 2025',
        amount: 'GH¢7,000.00',
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
    },
    {
        id: 'ORD-0089',
        customer: 'Kofi Mensah',
        email: 'kofi.m@example.com',
        product: 'Adidas Sneakers',
        date: 'Oct 23, 2025',
        amount: 'GH¢800.00',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
    },
    {
        id: 'ORD-0088',
        customer: 'Abena Sarpong',
        email: 'abena.s@example.com',
        product: 'Canon EOS R5',
        date: 'Oct 22, 2025',
        amount: 'GH¢35,000.00',
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
    },
    {
        id: 'ORD-0087',
        customer: 'Yaw Boateng',
        email: 'yaw.b@example.com',
        product: 'Nike Air Force 1',
        date: 'Oct 21, 2025',
        amount: 'GH¢1,200.00',
        paymentStatus: 'Failed',
        orderStatus: 'Cancelled',
    }
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Delivered':
            return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"><CheckCircle2 className="w-3.5 h-3.5" />Delivered</div>;
        case 'Processing':
            return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"><Clock className="w-3.5 h-3.5" />Processing</div>;
        case 'Shipped':
            return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"><Truck className="w-3.5 h-3.5" />Shipped</div>;
        case 'Pending':
            return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100"><Clock className="w-3.5 h-3.5" />Pending</div>;
        case 'Cancelled':
            return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100"><XCircle className="w-3.5 h-3.5" />Cancelled</div>;
        default:
            return null;
    }
};

export default function MerchantOrdersPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
                    <p className="text-slate-500 text-sm mt-1">Track and manage customer orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-slate-900">1,248</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Pending Processing</p>
                    <p className="text-2xl font-bold text-amber-600">24</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Delivered (Month)</p>
                    <p className="text-2xl font-bold text-emerald-600">156</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Returns</p>
                    <p className="text-2xl font-bold text-red-600">3</p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search orders, customers..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] transition-all text-sm"
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" />
                        Status
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Date Range
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700 w-12">
                                    <input type="checkbox" className="rounded border-slate-300 text-[#1A53C8] focus:ring-[#1A53C8]" />
                                </th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Order ID</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Customer</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Amount</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Payment</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded border-slate-300 text-[#1A53C8] focus:ring-[#1A53C8]" />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-slate-900">{order.customer}</p>
                                            <p className="text-xs text-slate-500">{order.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{order.date}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{order.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                            order.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(order.orderStatus)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#1A53C8]">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing 1-10 of 1,248 orders</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
