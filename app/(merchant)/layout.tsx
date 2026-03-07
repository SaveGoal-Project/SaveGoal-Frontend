'use client';

import { useState } from 'react';
import { MerchantSidebar } from '@/src/components/merchant/sidebar';
import { MerchantTopbar } from '@/src/components/merchant/topbar';
import { KycGate } from '@/src/components/merchant/KycGate';

export default function MerchantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <MerchantSidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <MerchantTopbar
                    title="Merchant Dashboard"
                    onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    <KycGate>{children}</KycGate>
                </main>
            </div>
        </div>
    );
}

