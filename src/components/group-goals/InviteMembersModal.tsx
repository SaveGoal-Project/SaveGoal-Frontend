"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Link as LinkIcon, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";

interface InviteMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupName: string;
}

export function InviteMembersModal({ isOpen, onClose, groupName }: InviteMembersModalProps) {
    const [copied, setCopied] = useState(false);
    const inviteCode = "CLASS2024BUS"; // Mock invite code
    const inviteLink = "https://ld-preview-fa2dafec-af71-44e2-804";

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-6">
                <DialogHeader className="text-center sm:text-center space-y-4">
                    <div className="mx-auto w-14 h-14 bg-[#eef0ff] rounded-full flex items-center justify-center">
                        <UsersIcon className="w-7 h-7 text-[#3b5bdb]" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-gray-900">Invite Members</DialogTitle>
                    <p className="text-sm text-[#3b5bdb]">
                        Share the link below to invite friends and family to join your group goal
                    </p>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Invite Code</label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    value={inviteLink}
                                    readOnly
                                    className="pl-9 h-12 bg-gray-50 border-gray-200 text-sm text-gray-600 truncate pr-4 rounded-xl"
                                />
                            </div>
                            <Button
                                onClick={handleCopy}
                                variant="outline"
                                className="h-12 w-12 shrink-0 rounded-xl border-gray-200 hover:bg-gray-50"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-[#3b5bdb]" />}
                            </Button>
                        </div>
                    </div>

                    <div className="bg-[#f0f4ff] rounded-xl p-4 text-center">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Invite Code</p>
                        <p className="text-2xl font-bold text-[#3b5bdb] tracking-widest">{inviteCode}</p>
                    </div>

                    <div className="space-y-3">
                        <Button className="w-full h-12 bg-[#2d3369] hover:bg-[#3d4a99] text-white rounded-xl font-semibold gap-2">
                            <MessageCircle className="w-5 h-5" />
                            Share via Whatsapp
                        </Button>
                        <Button variant="outline" className="w-full h-12 border-gray-200 text-[#3b5bdb] hover:bg-gray-50 rounded-xl font-semibold gap-2">
                            <Share2 className="w-5 h-5" />
                            More Share Options
                        </Button>
                    </div>

                    <p className="text-[10px] text-center text-gray-400 px-4">
                        Anyone with this link can request to join your group. You'll receive a notification when someone joins.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Minimal Users icon since import from lucide in main block usually causes issues if not top level
function UsersIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 40 0 0 0-4-4H6a4 40 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
