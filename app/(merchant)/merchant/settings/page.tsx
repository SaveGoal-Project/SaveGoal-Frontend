'use client';

import {
    User,
    Store,
    Bell,
    Lock,
    CreditCard,
    HelpCircle,
    ChevronRight,
    Camera,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export default function MerchantSettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your store preferences and account details</p>
            </div>

            {/* Profile Section */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Store className="w-5 h-5 text-[#1A53C8]" />
                        Store Profile
                    </h2>
                </div>
                <div className="p-6 space-y-6">
                    {/* Avatar/Logo */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                <span className="text-2xl font-bold text-slate-400">L</span>
                            </div>
                            <button className="absolute bottom-0 right-0 p-1.5 bg-[#1A53C8] text-white rounded-full hover:bg-[#1542a1] transition-colors shadow-sm">
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Store Logo</h3>
                            <p className="text-sm text-slate-500">Recommended size 400x400px</p>
                        </div>
                    </div>

                    {/* Form Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Store Name</label>
                            <input
                                type="text"
                                defaultValue="My Awesome Store"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    defaultValue="merchant@savegoal.com"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="tel"
                                    defaultValue="+233 24 000 0000"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    defaultValue="Accra, Ghana"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Description</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1A53C8]/20 focus:border-[#1A53C8] text-sm min-h-[100px]"
                                placeholder="Tell us about your store..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </section>

            {/* Other Settings Links */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { title: 'Notifications', icon: Bell, desc: 'Manage email and push alerts' },
                    { title: 'Security', icon: Lock, desc: 'Change password and 2FA' },
                    { title: 'Payment Methods', icon: CreditCard, desc: 'Manage bank accounts and cards' },
                    { title: 'Help & Support', icon: HelpCircle, desc: 'FAQs and contacting support' },
                ].map((item) => (
                    <button key={item.title} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1A53C8]/30 transition-all text-left group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-[#1A53C8] group-hover:text-white transition-colors">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 group-hover:text-[#1A53C8] transition-colors">{item.title}</h3>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1A53C8] transition-colors" />
                    </button>
                ))}
            </section>
        </div>
    );
}
