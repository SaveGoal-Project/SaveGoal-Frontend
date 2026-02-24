import { MerchantSidebar } from '@/src/components/merchant/sidebar';
import { MerchantTopbar } from '@/src/components/merchant/topbar';

export default function MerchantLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <MerchantSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <MerchantTopbar title="Merchant Dashboard" />
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
