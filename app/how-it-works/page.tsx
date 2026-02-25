import React from "react";
import Link from "next/link";
import { Search, Target, Wallet, CheckCircle, Users, Link as LinkIcon, Crown, ShieldCheck, Store, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900">

            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#2b3063] to-[#1a53c8] text-white py-24 sm:py-32">
                {/* Background Blobs for styling */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-400 opacity-20 rounded-full blur-3xl" />

                <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
                        Turn Your Dreams Into Reality,<br className="hidden sm:block" /> One Step at a Time
                    </h1>
                    <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
                        SaveGoal makes it easy to save for exactly what you want. Whether you're saving alone for a new laptop or pooling money with friends for a trip, we handle the hard parts so you can focus on the goal.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/register"
                            className="px-8 py-4 rounded-full bg-white text-[#1a53c8] font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg"
                        >
                            Start Saving Now
                        </Link>
                        <Link
                            href="/products"
                            className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-lg transition-colors backdrop-blur-sm"
                        >
                            Browse Catalog
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. CORE FEATURE: PERSONAL SAVINGS (Step-by-Step) */}
            <section className="py-20 sm:py-28 bg-gray-50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <span className="text-[#1a53c8] font-bold uppercase tracking-wider text-sm mb-2 block">Personal Goals</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">How SaveGoal Works for You</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {/* Step 1 */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden group hover:border-[#1a53c8]/20 transition-all hover:shadow-2xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 text-[160px] font-extrabold text-[#f8faff] leading-none -mt-10 -mr-6 group-hover:text-blue-50/50 transition-colors pointer-events-none select-none z-0">1</div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1a53c8] flex items-center justify-center mb-8 relative z-10">
                                <Search className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-extrabold mb-3 text-gray-900 relative z-10">Discover</h3>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed relative z-10">
                                Browse our catalog of high-quality products from trusted and verified merchants. Find exactly what you've been dreaming of.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden group hover:border-[#1a53c8]/20 transition-all hover:shadow-2xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 text-[160px] font-extrabold text-[#f8faff] leading-none -mt-10 -mr-6 group-hover:text-blue-50/50 transition-colors pointer-events-none select-none z-0">2</div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1a53c8] flex items-center justify-center mb-8 relative z-10">
                                <Target className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-extrabold mb-3 text-gray-900 relative z-10">Commit</h3>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed relative z-10">
                                Select your product and set up a customized savings schedule. Deposit funds weekly, bi-weekly, or on a completely flexible schedule.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden group hover:border-[#1a53c8]/20 transition-all hover:shadow-2xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 text-[160px] font-extrabold text-[#f8faff] leading-none -mt-10 -mr-6 group-hover:text-blue-50/50 transition-colors pointer-events-none select-none z-0">3</div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1a53c8] flex items-center justify-center mb-8 relative z-10">
                                <Wallet className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-extrabold mb-3 text-gray-900 relative z-10">Deposit</h3>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed relative z-10">
                                Connect your Mobile Money or Card. Make deposits safely toward your goal. The money is securely held until you hit your target.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-blue-900/5 relative overflow-hidden group hover:border-green-500/30 transition-all hover:shadow-2xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 text-[160px] font-extrabold text-[#f0fdf4] leading-none -mt-10 -mr-6 group-hover:text-green-50 transition-colors pointer-events-none select-none z-0">4</div>
                            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-8 relative z-10">
                                <CheckCircle className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-extrabold mb-3 text-gray-900 relative z-10">Achieve</h3>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed relative z-10">
                                Once you hit 100% of your savings target, the merchant is immediately notified to fulfill your order. Your dream item is finally yours!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. GROUP SAVINGS */}
            <section className="py-24 bg-white border-y border-gray-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div>
                                <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-2 block">Collaborative Goals</span>
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Save Together with Group Goals</h2>
                                <p className="text-lg text-gray-500 font-medium">
                                    Planning a graduation trip, buying a gift for a colleague, or pooling money for a religious society? Group Goals keep everyone accountable and transparent.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#f1f5fb] flex items-center justify-center flex-shrink-0 text-[#1a53c8]">
                                        <Crown className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">Create & Manage</h4>
                                        <p className="text-gray-500">Admins can create a goal, select the target product, and set the rules (Equal splits or Flexible contributions).</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#f1f5fb] flex items-center justify-center flex-shrink-0 text-[#1a53c8]">
                                        <LinkIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">Invite Anyone</h4>
                                        <p className="text-gray-500">Generate a unique invite code and share it via WhatsApp. Anyone with the link can easily join and contribute.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#f1f5fb] flex items-center justify-center flex-shrink-0 text-[#1a53c8]">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">Transparent Tracking</h4>
                                        <p className="text-gray-500">Every member has access to a live dashboard showing total group progress and a timeline of who has contributed.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Abstract visual representation of Group Goals dashboard */}
                        <div className="flex-1 w-full bg-[#f8faff] rounded-3xl p-8 border border-blue-50 relative">
                            <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200/50 rounded-full blur-2xl" />
                            <div className="absolute bottom-4 left-4 w-32 h-32 bg-[#1a53c8]/10 rounded-full blur-3xl" />

                            <div className="relative z-10 bg-white shadow-xl shadow-blue-900/5 rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gray-100 rounded-xl" />
                                    <div className="flex-1">
                                        <div className="h-5 w-32 bg-gray-200 rounded-md mb-2" />
                                        <div className="h-3 w-48 bg-gray-100 rounded-md" />
                                    </div>
                                    <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Active</div>
                                </div>
                                <div className="h-3 w-full bg-gray-100 rounded-full mb-8 overflow-hidden">
                                    <div className="h-full bg-[#1a53c8] rounded-full w-[65%]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#f1f5fb] p-4 rounded-xl">
                                        <div className="h-3 w-16 bg-blue-200 rounded-md mb-2" />
                                        <div className="h-6 w-24 bg-[#1a53c8] opacity-80 rounded-md" />
                                    </div>
                                    <div className="bg-[#f1f5fb] p-4 rounded-xl">
                                        <div className="h-3 w-16 bg-blue-200 rounded-md mb-2" />
                                        <div className="h-6 w-24 bg-[#1a53c8] opacity-80 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FOR MERCHANTS HIGHLIGHT */}
            <section className="py-20 bg-[#111827] text-white">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-900/50 flex items-center justify-center text-[#3b82f6] mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold mb-4">Are you a Retailer or Business?</h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        SaveGoal connects you with highly-committed buyers who are saving directly for your products. Zero acquisition costs, guaranteed payments, and a new sales channel.
                    </p>
                    <Link
                        href="/merchants"
                        className="inline-flex items-center gap-2 text-[#3b82f6] font-bold hover:text-white transition-colors"
                    >
                        Learn about Merchant Partnerships <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* 5. CTA SECTION */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-gradient-to-br from-[#2b3063] to-[#5761c9] rounded-3xl p-10 sm:p-16 text-center text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">Ready to start saving?</h2>
                            <p className="text-blue-100 text-lg sm:text-xl font-medium mb-10 max-w-lg mx-auto">
                                Join thousands of others who are achieving their financial and material goals with SaveGoal.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href="/register"
                                    className="px-8 py-4 rounded-xl bg-white text-[#1a53c8] font-extrabold text-lg hover:bg-gray-50 transition-colors shadow-lg"
                                >
                                    Create an Account
                                </Link>
                                <Link
                                    href="/products"
                                    className="px-8 py-4 rounded-xl bg-blue-900/30 text-white font-extrabold text-lg hover:bg-blue-900/50 transition-colors border border-blue-400/30"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
