"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Users, Plus, UserPlus, Info, Calendar, HandCoins, ArrowUpRight, Crown } from "lucide-react";
import { useSavingsGoalDetail } from "@/src/domains/savings-goals/savings.hooks";
import { Button } from "@/src/components/ui/button";
import { ContributeModal } from "@/src/components/group-goals/ContributeModal";
import { InviteMembersModal } from "@/src/components/group-goals/InviteMembersModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Progress } from "@/src/components/ui/progress";

export default function GroupGoalPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { goal, isLoading, error, refetch } = useSavingsGoalDetail(params.id);

    const [isContributeOpen, setIsContributeOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#eef0ff] border-t-[#3b5bdb] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !goal) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                    <Info className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Goal Not Found</h2>
                <p className="text-sm text-gray-500">The group goal you're looking for doesn't exist or you don't have access.</p>
                <Button onClick={() => router.push("/dashboard")} className="bg-[#2d3369] mt-4">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const { groupDetails, product } = goal;
    const isGroupAdmin = goal.isGroupAdmin;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Modals */}
            <ContributeModal
                isOpen={isContributeOpen}
                onClose={() => setIsContributeOpen(false)}
                goalId={goal.id}
                groupName={groupDetails?.name || goal.name || "Group"}
                remainingAmount={goal.targetAmount - goal.currentAmount}
                productName={product.name}
                onSuccess={refetch}
            />

            <InviteMembersModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                groupName={groupDetails?.name || goal.name || "Group"}
            />

            {/* Top Navigation */}
            <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
                <div className="container mx-auto max-w-3xl flex items-center">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to dashboard
                    </button>
                </div>
            </div>

            <div className="container mx-auto max-w-2xl px-4 py-6 space-y-6">

                {/* Main Goal Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-[#eef0ff] flex items-center justify-center shrink-0">
                                    <Users className="h-6 w-6 text-[#3b5bdb]" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1">
                                        {groupDetails?.name || goal.name}
                                    </h1>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#f0f4ff] text-[#3b5bdb]">
                                        Group Goal
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="md:text-right">
                            <p className="text-sm font-bold text-gray-500 mb-1">Target</p>
                            <p className="text-3xl font-extrabold text-[#3b5bdb] tracking-tight">
                                GH¢ {goal.targetAmount.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        <div className="flex items-end justify-between text-sm">
                            <div>
                                <p className="font-bold text-gray-900">GH¢ {goal.currentAmount.toLocaleString()} <span className="text-gray-400 font-medium">saved of GH¢ {goal.targetAmount.toLocaleString()}</span></p>
                            </div>
                            <p className="font-bold text-[#3b5bdb]">{Math.round(goal.progress)}%</p>
                        </div>
                        <Progress value={goal.progress} className="h-2.5 bg-gray-100" />
                        {groupDetails?.myContribution !== undefined && (
                            <p className="text-xs text-gray-500 font-medium">
                                Your contribution: <span className="font-bold text-gray-900">GH¢ {groupDetails.myContribution.toLocaleString()}</span>
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={() => setIsContributeOpen(true)}
                            className="w-full h-12 bg-[#2d3369] hover:bg-[#3d4a99] text-white font-semibold rounded-xl"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Contribute
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsInviteOpen(true)}
                            className="w-full h-12 border-gray-200 text-[#3b5bdb] hover:bg-gray-50 font-semibold rounded-xl"
                        >
                            <UserPlus className="w-4 h-4 mr-2" /> Invite Members
                        </Button>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="w-full flex border-b border-gray-100 rounded-none bg-transparent h-14 p-0">
                            <TabsTrigger value="details" className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#3b5bdb] data-[state=active]:text-[#3b5bdb] data-[state=active]:shadow-none font-semibold text-gray-500 transition-none">
                                Details
                            </TabsTrigger>
                            <TabsTrigger value="members" className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#3b5bdb] data-[state=active]:text-[#3b5bdb] data-[state=active]:shadow-none font-semibold text-gray-500 transition-none">
                                Members ({groupDetails?.membersCount || 1})
                            </TabsTrigger>
                            <TabsTrigger value="transactions" className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#3b5bdb] data-[state=active]:text-[#3b5bdb] data-[state=active]:shadow-none font-semibold text-gray-500 transition-none">
                                Transactions
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-6">
                            {/* DETAILS TAB */}
                            <TabsContent value="details" className="m-0 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <HandCoins className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Contribution</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 capitalize">
                                            {groupDetails?.contributionType.toLowerCase()}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Deadline</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">
                                            {groupDetails?.targetDate ? new Date(groupDetails.targetDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No deadline'}
                                        </p>
                                    </div>
                                </div>

                                {groupDetails?.description && (
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-gray-900">Description</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">{groupDetails.description}</p>
                                    </div>
                                )}

                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900">Goal Product</h3>
                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white">
                                        <div className="h-16 w-16 rounded-lg bg-gray-50 overflow-hidden relative border border-gray-100 shrink-0">
                                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-[#3b5bdb] uppercase font-bold truncate">{(product as any).brand || "Store"}</p>
                                            <p className="text-sm font-bold text-gray-900 truncate leading-tight mt-0.5">{product.name}</p>
                                            <p className="text-sm font-bold text-[#3b5bdb] mt-0.5">GH¢ {(product.price || 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* MEMBERS TAB */}
                            <TabsContent value="members" className="m-0 space-y-4">
                                <div className="flex items-center justify-between pb-2">
                                    <h3 className="text-sm font-bold text-gray-900">Group Members</h3>
                                    {isGroupAdmin && (
                                        <Button variant="ghost" size="sm" onClick={() => setIsInviteOpen(true)} className="text-[#3b5bdb] hover:bg-[#f0f4ff] hover:text-[#2d3369] h-8 text-xs font-bold px-3">
                                            + Invite
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {/* Admin (You) Mock */}
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#f0f4ff] font-bold text-[#3b5bdb] flex items-center justify-center border border-[#e4e9fe]">
                                                Y
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                                    You <Crown className="w-3.5 h-3.5 text-yellow-500" />
                                                </p>
                                                <p className="text-xs text-gray-500 font-medium text-[#3b5bdb] bg-[#f0f4ff] px-1.5 py-0.5 rounded inline-block mt-0.5">Admin</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-0.5">Contributed</p>
                                            <p className="text-sm font-bold text-gray-900">¢ {(groupDetails?.myContribution || 0).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Mock Member 1 */}
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-50 font-bold text-orange-600 flex items-center justify-center border border-orange-100">
                                                KA
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Kofi Asante</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Joined 24 Jan 2026</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-0.5">Contributed</p>
                                            <p className="text-sm font-bold text-gray-900">¢ 10,000</p>
                                        </div>
                                    </div>

                                    {/* Mock Member 2 */}
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-50 font-bold text-purple-600 flex items-center justify-center border border-purple-100">
                                                AM
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Ama Mensah</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Joined 22 Jan 2026</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-0.5">Contributed</p>
                                            <p className="text-sm font-bold text-gray-900">¢ 5,000</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* TRANSACTIONS TAB */}
                            <TabsContent value="transactions" className="m-0 space-y-4">
                                <h3 className="text-sm font-bold text-gray-900 pb-2">Recent Contributions</h3>
                                <div className="space-y-4">
                                    {goal.deposits && goal.deposits.length > 0 ? (
                                        goal.deposits.map((deposit) => (
                                            <div key={deposit.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                                        <ArrowUpRight className="w-5 h-5 text-green-500" />
                                                    </div>
                                                    <div>
                                                        {/* method is re-purposed as contributor name in the mock */}
                                                        <p className="text-sm font-bold text-gray-900">{deposit.method}</p>
                                                        <p className="text-[11px] text-gray-500 font-medium mt-0.5 uppercase tracking-wide">
                                                            {new Date(deposit.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-green-600">+ GH¢ {deposit.amount.toLocaleString()}</p>
                                                    <p className="text-[10px] text-green-500/80 font-bold uppercase tracking-wider mt-0.5">Success</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-sm text-gray-500">No contributions yet.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
