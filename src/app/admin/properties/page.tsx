"use client";

import { useState, useEffect, useCallback } from "react";
import { propertyApi } from "@/lib/api";
import {
  XCircle,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Star,
  ListFilter,
  Search,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface Property {
  _id: string;
  title: string;
  type: string;
  purpose: string;
  price: number;
  area: number;
  areaUnit: string;
  status: "pending" | "active" | "rejected";
  isFeatured: boolean;
  rejectionReason?: string;
  address: { city: string; state: string };
  images: { url: string; isPrimary: boolean }[];
  features: string[];
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  createdAt: string;
  owner: { _id: string; name: string; email: string; photo?: string };
}

function formatPrice(p: number) {
  if (p >= 10000000) return `${(p / 10000000).toFixed(1)} Cr`;
  if (p >= 100000) return `${(p / 100000).toFixed(1)} Lac`;
  return `PKR ${p.toLocaleString()}`;
}

function ReviewModal({
  prop,
  onClose,
  onApprove,
  onReject,
}: {
  prop: Property;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const cover =
    prop.images.find((i) => i.isPrimary)?.url ?? prop.images[0]?.url;

  async function handleApprove() {
    setProcessing(true);
    await onApprove(prop._id);
    setProcessing(false);
    onClose();
  }

  async function handleReject() {
    if (!reason.trim()) return;
    setProcessing(true);
    await onReject(prop._id, reason.trim());
    setProcessing(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E2EAD8]">
        <div className="sticky top-0 bg-white border-b border-[#E2EAD8] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-base font-bold text-[#1C1C1C]">
              Review Listing Submission
            </h2>
            <p className="text-xs text-[#6B7280]">
              Inspect property attributes before approval
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#1C1C1C] p-1 rounded-lg hover:bg-[#F8FAF6]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {cover && (
            <img
              src={cover}
              alt={prop.title}
              className="w-full h-48 object-cover rounded-xl border border-[#E2EAD8]"
            />
          )}
          {prop.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {prop.images.slice(1).map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  className="w-16 h-12 object-cover rounded-lg shrink-0 border border-[#E2EAD8]"
                />
              ))}
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-[#1C1C1C]">{prop.title}</h3>
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-[#6B7280]">
              <span className="capitalize bg-[#EAF3DE] text-[#3B6D11] font-bold px-2 py-0.5 rounded-md border border-[#C0DD97]">
                {prop.type}
              </span>
              <span className="bg-[#EAF3DE] text-[#3B6D11] font-bold px-2 py-0.5 rounded-md capitalize border border-[#C0DD97]">
                {prop.purpose === "rent" ? "For Rent" : "For Sale"}
              </span>
              <span className="flex items-center gap-1 bg-[#F8FAF6] px-2 py-0.5 rounded-md border border-[#E2EAD8]">
                <MapPin className="h-3 w-3 text-[#3B6D11]" />
                {prop.address.city}
              </span>
              {prop.bedrooms && (
                <span className="bg-[#F8FAF6] px-2 py-0.5 rounded-md border border-[#E2EAD8]">
                  🛏 {prop.bedrooms} beds
                </span>
              )}
              {prop.bathrooms && (
                <span className="bg-[#F8FAF6] px-2 py-0.5 rounded-md border border-[#E2EAD8]">
                  🚿 {prop.bathrooms} baths
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F8FAF6] rounded-xl p-3.5 border border-[#E2EAD8]">
              <p className="text-xs text-[#6B7280]">Asking Price</p>
              <p className="font-bold text-[#3B6D11] text-base mt-0.5">
                {formatPrice(prop.price)}
              </p>
            </div>
            <div className="bg-[#F8FAF6] rounded-xl p-3.5 border border-[#E2EAD8]">
              <p className="text-xs text-[#6B7280]">Covered Area</p>
              <p className="font-bold text-[#1C1C1C] text-base mt-0.5">
                {prop.area} {prop.areaUnit}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-[#1C1C1C] mb-1">Description</p>
            <p className="text-xs text-[#6B7280] bg-[#F8FAF6] rounded-xl p-3.5 border border-[#E2EAD8] leading-relaxed">
              {prop.description || "No description provided."}
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#F8FAF6] rounded-xl border border-[#E2EAD8]">
            {prop.owner?.photo ? (
              <img
                src={prop.owner.photo}
                alt={prop.owner.name}
                className="w-10 h-10 rounded-full object-cover border border-[#E2EAD8]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#3B6D11] flex items-center justify-center text-white font-bold text-sm">
                {(prop.owner?.name ?? "A").charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#1C1C1C] truncate">
                {prop.owner?.name ?? "Agent"}
              </p>
              <p className="text-[11px] text-[#6B7280] truncate">
                {prop.owner?.email}
              </p>
            </div>
          </div>

          {rejectMode ? (
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-rose-700">
                Reason for Declining:
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this listing is being declined..."
                className="w-full text-xs p-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 bg-rose-50/40"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setRejectMode(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={!reason.trim() || processing}
                  onClick={handleReject}
                  className="text-xs rounded-xl font-bold"
                >
                  {processing ? "Processing..." : "Confirm Decline"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 justify-end pt-2 border-t border-[#E2EAD8]">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRejectMode(true)}
                className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl font-bold"
              >
                Decline Listing
              </Button>
              <Button
                size="sm"
                disabled={processing}
                onClick={handleApprove}
                className="text-xs bg-[#3B6D11] hover:bg-[#2d540d] text-white rounded-xl font-bold px-4 shadow-xs"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                {processing ? "Approving..." : "Approve & Publish"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPropertiesPage() {
  const [tab, setTab] = useState<"pending" | "active">("pending");
  const [search, setSearch] = useState("");

  const [pendingProps, setPendingProps] = useState<Property[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [pendingLoading, setPendingLoading] = useState(true);

  const [activeProps, setActiveProps] = useState<Property[]>([]);
  const [activeTotal, setActiveTotal] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [activeTotalPages, setActiveTotalPages] = useState(1);
  const [activeLoading, setActiveLoading] = useState(true);

  const [selected, setSelected] = useState<Property | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setPendingLoading(true);
    try {
      const { data } = await propertyApi.getPending({
        page: pendingPage,
        limit: 15,
      });
      setPendingProps(data.data);
      setPendingTotal(data.pagination?.total ?? 0);
      setPendingTotalPages(data.pagination?.totalPages ?? 1);
    } catch {
      /* silent */
    } finally {
      setPendingLoading(false);
    }
  }, [pendingPage]);

  const fetchActive = useCallback(async () => {
    setActiveLoading(true);
    try {
      const { data } = await propertyApi.getAll({
        status: "active",
        page: activePage,
        limit: 15,
      });
      setActiveProps(data.data);
      setActiveTotal(data.pagination?.total ?? 0);
      setActiveTotalPages(data.pagination?.totalPages ?? 1);
    } catch {
      /* silent */
    } finally {
      setActiveLoading(false);
    }
  }, [activePage]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);
  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  async function handleApprove(id: string) {
    await propertyApi.approve(id);
    fetchPending();
    fetchActive();
  }

  async function handleReject(id: string, reason: string) {
    await propertyApi.reject(id, reason);
    fetchPending();
  }

  async function handleToggleFeatured(id: string) {
    setTogglingId(id);
    try {
      await propertyApi.toggleFeatured(id);
      setActiveProps((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isFeatured: !p.isFeatured } : p,
        ),
      );
    } catch {
      /* silent */
    } finally {
      setTogglingId(null);
    }
  }

  const filteredPending = pendingProps.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.city?.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredActive = activeProps.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.city?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2EAD8] pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-[#1C1C1C]">
              Property Moderation
            </h1>
            <Badge
              variant="green"
              className="bg-[#EAF3DE] text-[#3B6D11] border-[#C0DD97]"
            >
              Inventory Governance
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Review submissions, manage featured status, and moderate live
            marketplace listings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E2EAD8] bg-white focus:outline-none focus:border-[#3B6D11] w-48 shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[#E2EAD8] pb-1">
        <button
          onClick={() => setTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            tab === "pending"
              ? "bg-[#3B6D11] text-white shadow-xs"
              : "text-[#6B7280] hover:bg-[#F8FAF6] hover:text-[#1C1C1C]"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Pending Submissions
          {pendingTotal > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                tab === "pending"
                  ? "bg-white text-[#3B6D11]"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {pendingTotal}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("active")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            tab === "active"
              ? "bg-[#3B6D11] text-white shadow-xs"
              : "text-[#6B7280] hover:bg-[#F8FAF6] hover:text-[#1C1C1C]"
          }`}
        >
          <ListFilter className="h-3.5 w-3.5" />
          Active Marketplace
          {activeTotal > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                tab === "active"
                  ? "bg-white text-[#3B6D11]"
                  : "bg-[#EAF3DE] text-[#3B6D11]"
              }`}
            >
              {activeTotal}
            </span>
          )}
        </button>
      </div>

      {tab === "pending" && (
        <Card className="border-[#E2EAD8] shadow-xs overflow-hidden">
          <CardContent className="p-0">
            {pendingLoading ? (
              <div className="py-20 flex items-center justify-center">
                <LoadingSpinner
                  size="md"
                  text="Loading Pending Submissions..."
                />
              </div>
            ) : filteredPending.length === 0 ? (
              <div className="py-20 text-center text-[#9CA3AF] bg-[#F8FAF6]/40">
                <Building2 className="h-10 w-10 mx-auto mb-2 opacity-40 text-[#3B6D11]" />
                <p className="font-bold text-xs text-[#1C1C1C]">
                  No properties pending review
                </p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  All agent listing submissions have been moderated
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#E2EAD8] bg-[#F8FAF6]">
                      <TableHead className="text-xs font-bold text-[#374151]">
                        Property
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#374151]">
                        Agent
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#374151]">
                        Price
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#374151]">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#374151] text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPending.map((prop) => {
                      const cover =
                        prop.images?.find((i) => i.isPrimary)?.url ??
                        prop.images?.[0]?.url;
                      return (
                        <TableRow
                          key={prop._id}
                          className="border-[#E2EAD8] hover:bg-[#F8FAF6]/80"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-[#E2EAD8]">
                                {cover ? (
                                  <img
                                    src={cover}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Building2 className="h-4 w-4 text-[#9CA3AF] m-auto mt-3" />
                                )}
                              </div>
                              <div className="min-w-0 max-w-[200px]">
                                <p className="text-xs font-bold text-[#1C1C1C] truncate">
                                  {prop.title}
                                </p>
                                <p className="text-[10px] text-[#6B7280] flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-[#3B6D11]" />
                                  {prop.address?.city ?? "Pakistan"} •{" "}
                                  {prop.area} {prop.areaUnit}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-xs font-bold text-[#1C1C1C]">
                              {prop.owner?.name ?? "Agent"}
                            </p>
                            <p className="text-[10px] text-[#6B7280]">
                              {prop.owner?.email}
                            </p>
                          </TableCell>
                          <TableCell className="text-xs font-bold text-[#3B6D11]">
                            {formatPrice(prop.price)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                                prop.status === "pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {prop.status === "pending" ? (
                                <Clock className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {prop.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => setSelected(prop)}
                              className="h-7 text-xs bg-[#3B6D11] hover:bg-[#2d540d] text-white rounded-lg font-bold px-3"
                            >
                              <Eye className="h-3 w-3 mr-1" /> Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {pendingTotalPages > 1 && (
                  <div className="px-6 py-3 border-t border-[#E2EAD8] flex items-center justify-between">
                    <p className="text-xs text-[#6B7280]">
                      Showing {(pendingPage - 1) * 15 + 1}–
                      {Math.min(pendingPage * 15, pendingTotal)} of{" "}
                      {pendingTotal}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setPendingPage((p) => Math.max(1, p - 1))
                        }
                        disabled={pendingPage === 1}
                        className="h-7 text-xs border-[#E2EAD8]"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-xs text-[#6B7280]">
                        {pendingPage} / {pendingTotalPages}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setPendingPage((p) =>
                            Math.min(pendingTotalPages, p + 1),
                          )
                        }
                        disabled={pendingPage === pendingTotalPages}
                        className="h-7 text-xs border-[#E2EAD8]"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "active" && (
        <Card className="border-[#E2EAD8] shadow-xs overflow-hidden">
          <CardContent className="p-0">
            {activeLoading ? (
              <div className="py-20 flex items-center justify-center">
                <LoadingSpinner size="md" text="Loading Active Properties..." />
              </div>
            ) : filteredActive.length === 0 ? (
              <div className="py-20 text-center text-[#9CA3AF] bg-[#F8FAF6]/40">
                <Building2 className="h-10 w-10 mx-auto mb-2 opacity-40 text-[#3B6D11]" />
                <p className="font-bold text-xs text-[#1C1C1C]">
                  No active properties found
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#E2EAD8] bg-[#F8FAF6]">
                      <TableHead className="text-xs font-bold text-[#374151]">
                        Property
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#374151]">
                        Agent
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#374151]">
                        Price
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#374151]">
                        Purpose
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#374151] text-right">
                        Featured
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActive.map((prop) => {
                      const cover =
                        prop.images?.find((i) => i.isPrimary)?.url ??
                        prop.images?.[0]?.url;
                      const isToggling = togglingId === prop._id;
                      return (
                        <TableRow
                          key={prop._id}
                          className="border-[#E2EAD8] hover:bg-[#F8FAF6]/80"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-[#E2EAD8]">
                                {cover ? (
                                  <img
                                    src={cover}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Building2 className="h-4 w-4 text-[#9CA3AF] m-auto mt-3" />
                                )}
                              </div>
                              <div className="min-w-0 max-w-[200px]">
                                <p className="text-xs font-bold text-[#1C1C1C] truncate">
                                  {prop.title}
                                </p>
                                <p className="text-[10px] text-[#6B7280] flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-[#3B6D11]" />
                                  {prop.address?.city ?? "Pakistan"} •{" "}
                                  {prop.area} {prop.areaUnit}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-xs font-bold text-[#1C1C1C]">
                              {prop.owner?.name ?? "Agent"}
                            </p>
                            <p className="text-[10px] text-[#6B7280]">
                              {prop.owner?.email}
                            </p>
                          </TableCell>
                          <TableCell className="text-xs font-bold text-[#3B6D11]">
                            {formatPrice(prop.price)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                prop.purpose === "rent" ? "blue" : "green"
                              }
                              className="text-[10px] capitalize"
                            >
                              {prop.purpose === "rent"
                                ? "For Rent"
                                : "For Sale"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={() => handleToggleFeatured(prop._id)}
                              disabled={isToggling}
                              title={
                                prop.isFeatured
                                  ? "Remove from featured"
                                  : "Mark as featured"
                              }
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl border transition-all disabled:opacity-50 ${
                                prop.isFeatured
                                  ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                                  : "bg-[#F8FAF6] border-[#E2EAD8] text-[#9CA3AF] hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50"
                              }`}
                            >
                              {isToggling ? (
                                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Star
                                  className={`h-3.5 w-3.5 ${prop.isFeatured ? "fill-amber-400 text-amber-400" : ""}`}
                                />
                              )}
                              {prop.isFeatured ? "Featured" : "Feature"}
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {activeTotalPages > 1 && (
                  <div className="px-6 py-3 border-t border-[#E2EAD8] flex items-center justify-between">
                    <p className="text-xs text-[#6B7280]">
                      Showing {(activePage - 1) * 15 + 1}–
                      {Math.min(activePage * 15, activeTotal)} of {activeTotal}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                        disabled={activePage === 1}
                        className="h-7 text-xs border-[#E2EAD8]"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-xs text-[#6B7280]">
                        {activePage} / {activeTotalPages}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setActivePage((p) =>
                            Math.min(activeTotalPages, p + 1),
                          )
                        }
                        disabled={activePage === activeTotalPages}
                        className="h-7 text-xs border-[#E2EAD8]"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {selected && (
        <ReviewModal
          prop={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
