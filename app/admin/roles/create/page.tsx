"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

interface PermissionCategory {
    title: string;
    permissions: { name: string; checked: boolean }[];
}

const INITIAL_CATEGORIES: PermissionCategory[] = [
    {
        title: "User Management",
        permissions: [
            { name: "View Users", checked: false },
            { name: "Edit Users", checked: false },
            { name: "Delete Users", checked: false },
            { name: "User Management", checked: false },
        ],
    },
    {
        title: "Merchant Management",
        permissions: [
            { name: "View Merchants", checked: false },
            { name: "Merchant Approval", checked: false },
            { name: "Edit Merchants", checked: false },
            { name: "Merchant Approval", checked: false },
        ],
    },
    {
        title: "Financial",
        permissions: [
            { name: "View Payments", checked: false },
            { name: "Process Refunds", checked: false },
            { name: "Financial Operations", checked: false },
            { name: "Process Refunds", checked: false },
        ],
    },
    {
        title: "Risk & Compliance",
        permissions: [
            { name: "Risk Assessment", checked: false },
            { name: "Flag Accounts", checked: false },
            { name: "KYC Review", checked: false },
            { name: "Risk Override", checked: false },
        ],
    },
    {
        title: "System",
        permissions: [
            { name: "System Configuration", checked: false },
            { name: "Full System Access", checked: false },
            { name: "Generate Risk Reports", checked: false },
            { name: "Full System Access", checked: false },
        ],
    },
];

export default function CreateRolePage() {
    const [roleName, setRoleName] = useState("");
    const [categories, setCategories] = useState<PermissionCategory[]>(INITIAL_CATEGORIES);

    const togglePermission = (catIdx: number, permIdx: number) => {
        setCategories((prev) =>
            prev.map((cat, ci) =>
                ci === catIdx
                    ? {
                        ...cat,
                        permissions: cat.permissions.map((p, pi) =>
                            pi === permIdx ? { ...p, checked: !p.checked } : p
                        ),
                    }
                    : cat
            )
        );
    };

    return (
        <div className="space-y-6">
            {/* Back Link */}
            <Link
                href="/admin/roles"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0754FF] hover:text-[#0643cc] transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Roles
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1e2a4a]">Roles & Permissions</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage admin roles and assign permissions for granular access control.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0754FF] text-white text-sm font-bold rounded-lg hover:bg-[#0643cc] transition-colors">
                    <Plus className="h-4 w-4" />
                    Create New Role
                </button>
            </div>

            {/* Create New Role Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Role</h2>

                {/* Role Name */}
                <div className="mb-8">
                    <label className="text-sm font-bold text-gray-900 block mb-2">Role Name</label>
                    <input
                        type="text"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        placeholder="eg. Marketting Admin"
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF] transition-colors"
                    />
                </div>

                {/* Assign Permissions */}
                <div className="mb-8">
                    <label className="text-sm font-bold text-gray-900 block mb-4">Assign Permissions</label>
                    <div className="space-y-4">
                        {categories.map((cat, catIdx) => (
                            <div key={catIdx} className="rounded-xl border border-gray-100 p-5 border-l-4 border-l-[#0754FF]">
                                <h4 className="text-sm font-bold text-gray-900 mb-3">{cat.title}</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {cat.permissions.map((perm, permIdx) => (
                                        <label key={permIdx} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={perm.checked}
                                                onChange={() => togglePermission(catIdx, permIdx)}
                                                className="w-4 h-4 rounded border-gray-300 text-[#0754FF] focus:ring-[#0754FF]"
                                            />
                                            <span className="text-sm text-gray-600">{perm.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/roles"
                        className="flex-1 py-3 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors text-center"
                    >
                        Cancel
                    </Link>
                    <button className="flex-1 py-3 bg-[#0754FF] text-white text-sm font-bold rounded-lg hover:bg-[#0643cc] transition-colors">
                        Create Role
                    </button>
                </div>
            </div>
        </div>
    );
}
