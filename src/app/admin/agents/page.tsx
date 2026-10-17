"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/store/auth.store";
import { agentApi } from "@/lib/api";
import {
  CheckCircle, XCircle, Clock, Eye, ChevronLeft,
  ChevronRight, Search, Filter, BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

// ─── Types ────────────────────────────────────
interface AgentApplication {
  _id: string;
  applicationStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  licenseNumber: string;
  bio: string;
  experience: number;
  city: string;
  agencyName?: string;
  whatsapp?: string;
  passportPhoto?: string;
  cnicFront?: string;
  cnicBack?: string;
  utilityBill?: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
    photo?: string;
  };
}

// ─── Status Badge ─────────────────────────────
function StatusBadge({ status }: { status: AgentApplication["applicationStatus"] }) {
  const map = {
    pending:  { bg: "bg-amber-50",   text: "text-amber-700",  icon: Clock,        label: "Pending"  },
    approved: { bg: "bg-[#EAF3DE]",  text: "text-[#3B6D11]",  icon: BadgeCheck,   label: "Approved" },
    rejected: { bg: "bg-red-50",     text: "text-red-600",    icon: XCircle,      label: "Rejected" },
  }[status];
  const Icon = map.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${map.bg} ${map.text}`}>
      <Icon className="h-3.5 w-3.5" />{map.label}
    </span>
  );
}

// ─── Document Viewer Modal ────────────────────
function DocModal({
  app,
  onClose,
  onApprove,
  onReject,
}: {
  app: AgentApplication;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject:  (id: string, reason: string) => void;
}) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function handleApprove() {
    setProcessing(true);
    await onApprove(app._id);
    setProcessing(false);
    onClose();
  }

  async function handleReject() {
    if (!rejectReason.trim()) return;
    setProcessing(true);
    await onReject(app._id, rejectReason.trim());
    setProcessing(false);
    onClose();
  }

  const docs = [
    { label: "Passport Photo", url: app.passportPhoto },
    { label: "CNIC Front",     url: app.cnicFront     },
    { label: "CNIC Back",      url: app.cnicBack      },
    { label: "Utility Bill",   url: app.utilityBill   },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E2EAD8] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1C1C1C]">Application Review</h2>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#374151] transition-colors">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Applicant Info */}
          <div className="flex items-center gap-4 p-4 bg-[#F8FAF6] rounded-2xl">
            {app.user.photo ? (
              <img src={app.user.photo} alt={app.user.name} className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#3B6D11] flex items-center justify-center text-white text-xl font-semibold">
                {app.user.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-[#1C1C1C]">{app.user.name}</p>
              <p className="text-sm text-[#9CA3AF]">{app.user.email}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-[#6B7280]">
                <span>📍 {app.city}</span>
                <span>💼 {app.experience} yrs exp</span>
                {app.agencyName && <span>🏢 {app.agencyName}</span>}
              </div>
            </div>
            <div className="ml-auto">
              <StatusBadge status={app.applicationStatus} />
            </div>
          </div>

          {/* License Number */}
          <div className="p-4 bg-[#F8FAF6] rounded-2xl">
            <p className="text-xs text-[#9CA3AF] mb-1">Auto-Generated License Number</p>
            <p className="font-mono font-semibold text-[#3B6D11] text-lg">{app.licenseNumber}</p>
          </div>

          {/* Bio */}
          <div>
            <p className="text-sm font-medium text-[#374151] mb-2">Professional Bio</p>
            <p className="text-sm text-[#6B7280] bg-[#F8FAF6] rounded-xl p-4 leading-relaxed">{app.bio}</p>
          </div>

          {/* Documents */}
          <div>
            <p className="text-sm font-medium text-[#374151] mb-3">Submitted Documents</p>
            <div className="grid grid-cols-2 gap-3">
              {docs.map((doc) => (
                <div key={doc.label} className="rounded-2xl border border-[#E2EAD8] overflow-hidden">
                  <p className="text-xs font-medium text-[#6B7280] px-3 py-2 bg-[#F8FAF6] border-b border-[#E2EAD8]">
                    {doc.label}
                  </p>
                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noreferrer">
                      <img src={doc.url} alt={doc.label} className="w-full h-40 object-cover hover:opacity-90 transition-opacity" />
                    </a>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-[#9CA3AF] text-sm">
                      Not uploaded
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rejection reason if already rejected */}
          {app.applicationStatus === "rejected" && app.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-medium text-red-700">Previous rejection reason:</p>
              <p className="text-sm text-red-600 mt-1">{app.rejectionReason}</p>
            </div>
          )}

          {/* Actions — only if still pending */}
          {app.applicationStatus === "pending" && (
            <div className="border-t border-[#E2EAD8] pt-4 space-y-3">
              {!showRejectInput ? (
                <div className="flex gap-3">
                  <Button
                    onClick={handleApprove}
                    disabled={processing}
                    className="flex-1 gap-2 bg-[#3B6D11] hover:bg-[#2d5209]"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Agent
                  </Button>
                  <Button
                    onClick={() => setShowRejectInput(true)}
                    variant="outline"
                    disabled={processing}
                    className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-[#374151] mb-1.5 block">
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={3}
                      placeholder="Explain why this application is being rejected..."
                      className="w-full border border-red-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleReject}
                      disabled={!rejectReason.trim() || processing}
                      className="flex-1 gap-2 bg-red-600 hover:bg-red-700"
                    >
                      <XCircle className="h-4 w-4" />
                      Confirm Rejection
                    </Button>
                    <Button
                      onClick={() => setShowRejectInput(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────
export default function AdminAgentApplicationsPage() {
  const user   = useUser();
  const router = useRouter();

  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<"" | "pending" | "approved" | "rejected">("");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<AgentApplication | null>(null);

  // Route guard
  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/");
    if (!user) router.replace("/login");
  }, [user, router]);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await agentApi.getAllApplications({
        status: filter || undefined,
        page,
        limit: 10,
      });
      setApplications(data.data);
      setTotal(data.pagination?.total ?? 0);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  // Approve
  async function handleApprove(agentId: string) {
    await agentApi.verifyAgent(agentId, true);
    fetchApps();
  }

  // Reject
  async function handleReject(agentId: string, reason: string) {
    await agentApi.verifyAgent(agentId, false, reason);
    fetchApps();
  }

  // Filter search client-side
  const filtered = applications.filter((a) =>
    !search ||
    a.user.name.toLowerCase().includes(search.toLowerCase()) ||
    a.user.email.toLowerCase().includes(search.toLowerCase()) ||
    a.licenseNumber.toLowerCase().includes(search.toLowerCase()),
  );

  const pendingCount  = applications.filter((a) => a.applicationStatus === "pending").length;

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-[#F8FAF6]">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1C]">Agent Applications</h1>
            <p className="text-[#6B7280] mt-1">Review and manage agent verification requests</p>
          </div>
          {pendingCount > 0 && (
            <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full">
              {pendingCount} pending review{pendingCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#E2EAD8] p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or license..."
              className="pl-9 border-[#D1E5B8]"
            />
          </div>
          <div className="flex gap-2">
            {(["", "pending", "approved", "rejected"] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setFilter(s); setPage(1); }}
                className={`
                  text-xs font-medium px-3 py-2 rounded-xl border transition-all
                  ${filter === s
                    ? "bg-[#3B6D11] text-white border-[#3B6D11]"
                    : "bg-white text-[#6B7280] border-[#D1E5B8] hover:border-[#3B6D11]"
                  }
                `}
              >
                {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E2EAD8] overflow-hidden">
          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <LoadingSpinner size="md" text="Loading Applications..." />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-[#9CA3AF]">
              <Filter className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No applications found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2EAD8] bg-[#F8FAF6]">
                    <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-6 py-3">Applicant</th>
                    <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">License No.</th>
                    <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">City</th>
                    <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">Applied</th>
                    <th className="text-right text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <tr key={app._id} className="border-b border-[#F0F6E8] hover:bg-[#F8FAF6] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {app.user.photo ? (
                            <img src={app.user.photo} alt={app.user.name} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#3B6D11] flex items-center justify-center text-white text-sm font-semibold">
                              {app.user.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#1C1C1C]">{app.user.name}</p>
                            <p className="text-xs text-[#9CA3AF]">{app.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-[#3B6D11] bg-[#EAF3DE] px-2 py-1 rounded-lg">
                          {app.licenseNumber}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#6B7280]">{app.city}</td>
                      <td className="px-4 py-4"><StatusBadge status={app.applicationStatus} /></td>
                      <td className="px-4 py-4 text-xs text-[#9CA3AF]">
                        {new Date(app.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelected(app)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3B6D11] bg-[#EAF3DE] hover:bg-[#D8EFC4] px-3 py-1.5 rounded-xl transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-[#E2EAD8] flex items-center justify-between">
                  <p className="text-sm text-[#9CA3AF]">
                    Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-xl border border-[#E2EAD8] text-[#6B7280] hover:border-[#3B6D11] disabled:opacity-40 transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-[#6B7280] px-3 py-2">
                      {page} / {totalPages}
                    </span>
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

      {/* Document Review Modal */}
      {selected && (
        <DocModal
          app={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
