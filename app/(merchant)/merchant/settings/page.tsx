'use client';

import { useState, useEffect } from 'react';
import {
    Store,
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Bell,
    Globe,
    CreditCard,
    Save,
    Loader2,
    Camera,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/src/components/ui/tabs';
import { useMerchantProfile, useUpdateMerchantProfile } from '@/src/domains/merchant/merchant.hooks';
import { Skeleton } from '@/src/components/ui/skeleton';

export default function MerchantSettingsPage() {
    const { profile, isLoading, refetch } = useMerchantProfile();
    const { update, isSubmitting } = useUpdateMerchantProfile();

    const [formData, setFormData] = useState({
        storeName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        category: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                storeName: profile.storeName,
                ownerName: profile.ownerName,
                email: profile.email,
                phone: profile.phone,
                address: profile.address,
                category: profile.category,
            });
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            await update(formData);
            console.log('Profile updated successfully');
            refetch();
        } catch (err) {
            console.error(err instanceof Error ? err.message : 'Failed to update profile');
        }
    };

    if (isLoading && !profile) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-8">
                    <div className="flex items-center gap-6 mb-8">
                        <Skeleton className="w-24 h-24 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your store profile and account preferences</p>
            </div>

            <Tabs defaultValue="profile" className="w-full space-y-6">
                <TabsList className="bg-slate-100/50 p-1 rounded-xl w-full sm:w-auto h-auto flex flex-wrap gap-1">
                    <TabsTrigger value="profile" className="rounded-lg px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#1A53C8] data-[state=active]:shadow-sm transition-all border-none">
                        Store Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#1A53C8] data-[state=active]:shadow-sm transition-all border-none">
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="payouts" className="rounded-lg px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#1A53C8] data-[state=active]:shadow-sm transition-all border-none">
                        Payout Accounts
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#1A53C8] data-[state=active]:shadow-sm transition-all border-none">
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 outline-none">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-8 bg-slate-50/30">
                            <div className="relative">
                                <div className="w-28 h-28 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden ring-1 ring-slate-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={profile?.logo || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"}
                                        alt="Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-2 bg-[#1A53C8] text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors ring-2 ring-white">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{profile?.storeName}</h2>
                                <p className="text-sm text-slate-500 font-medium">Merchant Account ID: {profile?.id}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-lg border border-emerald-100">Verified Merchant</span>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-lg border border-slate-200">{profile?.category}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label htmlFor="storeName" className="text-sm font-bold text-slate-700">Store Name</Label>
                                <div className="relative">
                                    <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="storeName"
                                        className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                        value={formData.storeName}
                                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ownerName" className="text-sm font-bold text-slate-700">Owner Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="ownerName"
                                        className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                        value={formData.ownerName}
                                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-bold text-slate-700">Business Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-bold text-slate-700">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="phone"
                                        className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address" className="text-sm font-bold text-slate-700">Business Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                    <Textarea
                                        id="address"
                                        className="pl-11 pt-2.5 min-h-[100px] rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                            <Button
                                className="bg-[#1A53C8] hover:bg-[#1542a1] text-white gap-2 font-bold px-8 h-12 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                onClick={handleSave}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save Profile Changes
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="notifications" className="outline-none">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-[#1A53C8]" />
                            Notification Preferences
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: "Daily Sales Summary", desc: "Receive a summary of your daily sales every morning." },
                                { title: "New Order Alerts", desc: "Get notified immediately when a new order is placed." },
                                { title: "Inventory Alerts", desc: "Get notified when a product is low on stock or out of stock." },
                                { title: "Payout Completion", desc: "Receive an email when your payout has been successfully processed." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                    </div>
                                    <div className="h-6 w-11 bg-[#1A53C8] rounded-full relative">
                                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="outline-none">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#1A53C8]" />
                            Security & Access
                        </h3>
                        <div className="max-w-md space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-slate-700">Current Password</Label>
                                    <Input type="password" placeholder="••••••••" className="h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-slate-700">New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-slate-700">Confirm New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="h-12 rounded-xl" />
                                </div>
                            </div>
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl">
                                Update Password
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
