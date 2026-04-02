'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useMerchantProfile, useUpdateMerchantProfile } from '@/src/domains/merchant/merchant.hooks';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Skeleton } from '@/src/components/ui/skeleton';

type FormState = {
    storeName: string;
    ownerName: string;
    email: string;
    phone: string;
    address: string;
    registrationNo: string;
    bankName: string;
    bankAccountNo: string;
    bankAccountName: string;
};

function VerificationBadge({ verified }: { verified: boolean }) {
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {verified ? 'Verified merchant' : 'Pending verification'}
        </span>
    );
}

export default function MerchantSettingsPage() {
    const { profile, isLoading, error, refetch } = useMerchantProfile();
    const { update, isSubmitting, error: updateError } = useUpdateMerchantProfile();
    const [form, setForm] = useState<FormState>({
        storeName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        registrationNo: '',
        bankName: '',
        bankAccountNo: '',
        bankAccountName: '',
    });
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!profile) {
            return;
        }

        setForm({
            storeName: profile.storeName,
            ownerName: profile.ownerName,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            registrationNo: profile.registrationNo || '',
            bankName: profile.bankName || '',
            bankAccountNo: profile.bankAccountNo || '',
            bankAccountName: profile.bankAccountName || '',
        });
    }, [profile]);

    const handleSave = async () => {
        setSaveMessage(null);
        await update(form);
        await refetch();
        setSaveMessage('Merchant settings updated successfully.');
    };

    if (error) {
        return (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-bold text-slate-900">Settings unavailable</h1>
                <p className="mt-2 text-sm text-slate-500">{error}</p>
                <Button className="mt-4 bg-[#1A53C8] text-white hover:bg-[#1542a1]" onClick={refetch}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Merchant Settings</h1>
                    <p className="text-sm text-slate-500">Keep your store profile and payout details accurate.</p>
                </div>
                {profile ? <VerificationBadge verified={profile.isVerified} /> : null}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr,1fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">Business Profile</h2>
                    {isLoading && !profile ? (
                        <div className="mt-6 space-y-4">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <Skeleton key={index} className="h-14 rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="storeName">Store Name</Label>
                                <Input id="storeName" value={form.storeName} onChange={(event) => setForm({ ...form, storeName: event.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ownerName">Owner Name</Label>
                                <Input id="ownerName" value={form.ownerName} onChange={(event) => setForm({ ...form, ownerName: event.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Business Email</Label>
                                <Input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Business Phone</Label>
                                <Input id="phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Business Address</Label>
                                <Textarea id="address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="registrationNo">Registration Number</Label>
                                <Input id="registrationNo" value={form.registrationNo} onChange={(event) => setForm({ ...form, registrationNo: event.target.value })} />
                            </div>
                        </div>
                    )}
                </section>

                <section className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Payout Account</h2>
                        {isLoading && !profile ? (
                            <div className="mt-6 space-y-4">
                                <Skeleton className="h-14 rounded-xl" />
                                <Skeleton className="h-14 rounded-xl" />
                                <Skeleton className="h-14 rounded-xl" />
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bankName">Bank Name</Label>
                                    <Input id="bankName" value={form.bankName} onChange={(event) => setForm({ ...form, bankName: event.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bankAccountNo">Account Number</Label>
                                    <Input id="bankAccountNo" value={form.bankAccountNo} onChange={(event) => setForm({ ...form, bankAccountNo: event.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bankAccountName">Account Name</Label>
                                    <Input id="bankAccountName" value={form.bankAccountName} onChange={(event) => setForm({ ...form, bankAccountName: event.target.value })} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Verification State</h2>
                        {profile ? (
                            <div className="mt-4 space-y-3 text-sm">
                                <div className="rounded-xl border border-slate-100 p-4">
                                    <p className="text-slate-500">KYC Status</p>
                                    <p className="mt-1 font-semibold text-slate-900">{profile.kycStatus}</p>
                                </div>
                                <div className="rounded-xl border border-slate-100 p-4">
                                    <p className="text-slate-500">Merchant Balance</p>
                                    <p className="mt-1 font-semibold text-slate-900">{profile.balance.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} GHS</p>
                                </div>
                                {profile.kycNote ? (
                                    <div className="rounded-xl bg-amber-50 p-4 text-amber-800">
                                        {profile.kycNote}
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <Skeleton className="mt-4 h-28 rounded-xl" />
                        )}
                    </div>
                </section>
            </div>

            {saveMessage ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
                    {saveMessage}
                </div>
            ) : null}
            {updateError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
                    {updateError}
                </div>
            ) : null}

            <div className="flex justify-end">
                <Button className="bg-[#1A53C8] text-white hover:bg-[#1542a1]" disabled={isSubmitting || isLoading} onClick={handleSave}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Merchant Settings
                </Button>
            </div>
        </div>
    );
}
