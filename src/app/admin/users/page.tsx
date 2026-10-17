"use client";

import { useState, useEffect, useCallback } from "react";
import { userApi } from "@/lib/api";
import {
  Search, CheckCircle, XCircle, ChevronLeft,
  ChevronRight, BadgeCheck, Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "buyer" | "agent" | "admin";
  photo?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

function RoleBadge({ role }: { role: User["role"] }) {
  const map = {
    buyer: "bg-[#EAF3DE] text-[#3B6D11]",
    agent: "bg-[#EAF3DE] text-[#3B6D11]",
    admin: "bg-[#EAF3DE] text-[#3B6D11]",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${map[role]}`}>
      {role === "agent" && <BadgeCheck className="h-3 w-3" />}
      {role}
    </span>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers]         = useState<User[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]     = useState(true);
  const [roleFilter, setRoleFilter] = useState<"" | "buyer" | "agent" | "admin">("");
  const [search, setSearch]       = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userApi.getAllUsers({
        page, limit: 15,
        role: roleFilter || undefined,
      });
      setUsers(data.data);
      setTotal(data.pagination?.total ?? 0);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function toggleStatus(user: User) {
    setTogglingId(user._id);
    try {
      await userApi.toggleUserStatus(user._id, !user.isActive);
      setUsers((prev) =>
        prev.map((u) => u._id === user._id ? { ...u, isActive: !u.isActive } : u),
      );
    } catch {
      // silent
    } finally {
      setTogglingId(null);
    }
  }

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1C1C1C]">Users</h1>
        <p className="text-[#6B7280] mt-1">Manage all registered accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#E2EAD8] p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 border-[#D1E5B8]"
          />
        </div>
        <div className="flex gap-2">
          {(["", "buyer", "agent", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`text-xs font-medium px-3 py-2 rounded-xl border transition-all ${
                roleFilter === r
                  ? "bg-[#3B6D11] text-white border-[#3B6D11]"
                  : "bg-white text-[#6B7280] border-[#D1E5B8] hover:border-[#3B6D11]"
              }`}
            >
              {r === "" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2EAD8] overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <LoadingSpinner size="md" text="Loading Users..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[#9CA3AF]">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E2EAD8] bg-[#F8FAF6]">
                  <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-6 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">Joined</th>
                  <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id} className="border-b border-[#F0F6E8] hover:bg-[#F8FAF6] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {u.photo ? (
                          <img src={u.photo} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#3B6D11] flex items-center justify-center text-white text-sm font-semibold">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-[#1C1C1C]">{u.name}</p>
                          <p className="text-xs text-[#9CA3AF]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-4 text-xs text-[#9CA3AF]">
                      {new Date(u.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                        u.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}>
                        {u.isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {u.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => toggleStatus(u)}
                          disabled={togglingId === u._id}
                          className={`text-xs font-medium px-3 py-1.5 rounded-xl transition-colors ${
                            u.isActive
                              ? "text-red-600 bg-red-50 hover:bg-red-100"
                              : "text-green-700 bg-green-50 hover:bg-green-100"
                          } disabled:opacity-50`}
                        >
                          {togglingId === u._id ? "..." : u.isActive ? "Suspend" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-[#E2EAD8] flex items-center justify-between">
                <p className="text-sm text-[#9CA3AF]">
                  Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, total)} of {total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl border border-[#E2EAD8] text-[#6B7280] hover:border-[#3B6D11] disabled:opacity-40 transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-[#6B7280] px-3 py-2">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-xl border border-[#E2EAD8] text-[#6B7280] hover:border-[#3B6D11] disabled:opacity-40 transition"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
