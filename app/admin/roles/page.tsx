"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Settings,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Plus,
} from "lucide-react";
import { useAdminRoles, useDeleteRole, useUpdateRole } from "@/src/domains/admin/admin.hooks";
import { AdminLoadingSkeleton, AdminErrorState, AdminToast, AdminConfirmDialog } from "@/src/components/admin/AdminFeedback";
import type { AdminRole } from "@/src/domains/admin/admin.types";

export default function AdminRolesPage() {
  const { data: roles, isLoading, error, refetch } = useAdminRoles();
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const deleteRoleMutation = useDeleteRole();
  const updateRoleMutation = useUpdateRole();

  if (isLoading) return <AdminLoadingSkeleton />;
  if (error) return <AdminErrorState message={error} onRetry={refetch} />;

  const MOCK_ROLES = roles || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e2a4a]">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage admin roles and assign permissions for granular access control.
          </p>
        </div>
        <Link
          href="/admin/roles/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0754FF] text-white text-sm font-bold rounded-lg hover:bg-[#0643cc] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Role
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs font-medium text-gray-500">Total Roles</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-medium text-gray-500">Total Admin Users</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">15</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-amber-500" />
            <p className="text-xs font-medium text-gray-500">Permission Categories</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">5</p>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_ROLES.map((role, idx) => (
          <div key={role.id + idx} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
            {/* Role Header */}
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-gray-900">{role.name}</h3>
            </div>
            <p className="text-xs text-gray-500 ml-7 mb-4">{role.users} users</p>

            {/* Permissions */}
            <p className="text-sm font-bold text-gray-900 mb-2">Permissions ({role.permissions.length})</p>
            <div className="space-y-1.5 mb-2">
              {role.permissions.slice(0, 3).map((perm, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{perm}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-4">+{role.permissions.length - 3} more...</p>

            {/* Action Buttons */}
            <div className="mt-auto flex items-center gap-2">
              <button
                onClick={() => setEditingRole(role)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-[#0754FF] text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Role: {editingRole.name}</h2>
              <button
                onClick={() => setEditingRole(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Role Name Input */}
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-900 block mb-2">Role Name</label>
              <input
                type="text"
                defaultValue={editingRole.name}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#0754FF] focus:ring-1 focus:ring-[#0754FF] transition-colors"
              />
            </div>

            {/* Current Permissions */}
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-900 block mb-3">Current Permissions</label>
              <div className="space-y-2">
                {editingRole.permissions.map((perm, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 px-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-600">{perm}</span>
                    </div>
                    <button className="text-red-500 hover:text-red-600 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setEditingRole(null)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 bg-[#0754FF] text-white text-sm font-bold rounded-lg hover:bg-[#0643cc] transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
