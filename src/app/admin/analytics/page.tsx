"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { userApi, agentApi, propertyApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/ui/charts";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

// ─── Types ───────────────────────────────────────────────────────────────────
interface PlatformStats {
  totalUsers: number;
  pendingAgents: number;
  approvedAgents: number;
  rejectedAgents: number;
  pendingProps: number;
  activeProps: number;
  totalProps: number;
}

function pct(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      userApi.getAllUsers({ page: 1, limit: 1 }),
      agentApi.getAllApplications({ status: "pending", page: 1, limit: 1 }),
      agentApi.getAllApplications({ status: "approved", page: 1, limit: 1 }),
      agentApi.getAllApplications({ status: "rejected", page: 1, limit: 1 }),
      propertyApi.getPending({ page: 1, limit: 1 }),
      propertyApi.getAll({ status: "active", page: 1, limit: 1 }),
      propertyApi.getAll({ page: 1, limit: 1 }),
    ])
      .then(
        ([
          users,
          pending,
          approved,
          rejected,
          pendingProp,
          activeProp,
          allProp,
        ]) => {
          const n = (
            r: PromiseSettledResult<{
              data: { pagination?: { total?: number } };
            }>,
          ) =>
            r.status === "fulfilled"
              ? (r.value.data?.pagination?.total ?? 0)
              : 0;

          setStats({
            totalUsers: n(users),
            pendingAgents: n(pending),
            approvedAgents: n(approved),
            rejectedAgents: n(rejected),
            pendingProps: n(pendingProp),
            activeProps: n(activeProp),
            totalProps: n(allProp),
          });
        },
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Analytics Console..." />
      </div>
    );
  }

  if (!stats) return null;

  const totalAgentApps =
    stats.pendingAgents + stats.approvedAgents + stats.rejectedAgents;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2EAD8] pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-[#1C1C1C]">
              Platform Analytics
            </h1>
            <Badge
              variant="green"
              className="bg-[#EAF3DE] text-[#3B6D11] border-[#C0DD97]"
            >
              Real-time Metrics
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Platform-wide governance metrics, verification throughput, and
            inventory moderation overview
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/properties">
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-[#E2EAD8] text-[#374151] hover:bg-[#F8FAF6]"
            >
              Moderate Properties
            </Button>
          </Link>
          <Link href="/admin/agents">
            <Button
              size="sm"
              className="text-xs bg-[#3B6D11] hover:bg-[#2d540d] text-white rounded-xl font-bold"
            >
              Review Agents
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1 — Users & Agents KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#E2EAD8] shadow-xs hover:border-[#C0DD97] transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#6B7280]">
                Total Platform Users
              </p>
              <div className="w-8 h-8 rounded-full bg-[#EAF3DE] flex items-center justify-center">
                <Users className="h-4 w-4 text-[#3B6D11]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1C1C1C]">
                <CountUp end={stats.totalUsers} duration={1200} />
              </span>
              <span className="text-[11px] font-semibold text-[#6B7280]">
                registered
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E2EAD8] shadow-xs hover:border-[#C0DD97] transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#6B7280]">
                Verified Agents
              </p>
              <div className="w-8 h-8 rounded-full bg-[#EAF3DE] flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-[#3B6D11]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1C1C1C]">
                <CountUp end={stats.approvedAgents} duration={1200} />
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                {totalAgentApps > 0
                  ? `${pct(stats.approvedAgents, totalAgentApps)}%`
                  : "100%"}{" "}
                rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E2EAD8] shadow-xs hover:border-[#C0DD97] transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#6B7280]">
                Pending Applications
              </p>
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1C1C1C]">
                <CountUp end={stats.pendingAgents} duration={1200} />
              </span>
              {stats.pendingAgents > 0 ? (
                <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  Action Needed
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-600">
                  Queue Clear
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E2EAD8] shadow-xs hover:border-[#C0DD97] transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#6B7280]">
                Active Properties
              </p>
              <div className="w-8 h-8 rounded-full bg-[#EAF3DE] flex items-center justify-center">
                <Building2 className="h-4 w-4 text-[#3B6D11]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1C1C1C]">
                <CountUp end={stats.activeProps} duration={1200} />
              </span>
              <span className="text-[11px] font-semibold text-[#6B7280]">
                of {stats.totalProps} total
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 — Agent Applications Funnel & Property Moderation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agent Application Funnel */}
        <Card className="border-[#E2EAD8] shadow-xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-[#1C1C1C]">
                Agent Verification Funnel
              </CardTitle>
              <CardDescription className="text-xs text-[#6B7280]">
                Application lifecycle throughput & approval metrics
              </CardDescription>
            </div>
            <Link href="/admin/agents">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-[#3B6D11] hover:bg-[#EAF3DE]"
              >
                Review Queue <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#1C1C1C]">
                  Total Agent Applications
                </span>
                <span className="font-bold text-[#1C1C1C]">
                  {totalAgentApps}
                </span>
              </div>
              <div className="h-2.5 bg-[#F8FAF6] rounded-full overflow-hidden border border-[#E2EAD8]">
                <div
                  className="h-full bg-[#3B6D11] rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#6B7280]">Approved & Verified</span>
                <span className="font-bold text-emerald-700">
                  {stats.approvedAgents} (
                  {pct(stats.approvedAgents, totalAgentApps)}%)
                </span>
              </div>
              <div className="h-2 bg-[#F8FAF6] rounded-full overflow-hidden border border-[#E2EAD8]">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{
                    width: `${pct(stats.approvedAgents, totalAgentApps)}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#6B7280]">Pending Admin Review</span>
                <span className="font-bold text-amber-600">
                  {stats.pendingAgents} (
                  {pct(stats.pendingAgents, totalAgentApps)}%)
                </span>
              </div>
              <div className="h-2 bg-[#F8FAF6] rounded-full overflow-hidden border border-[#E2EAD8]">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{
                    width: `${pct(stats.pendingAgents, totalAgentApps)}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#6B7280]">Declined / Incomplete</span>
                <span className="font-bold text-rose-600">
                  {stats.rejectedAgents} (
                  {pct(stats.rejectedAgents, totalAgentApps)}%)
                </span>
              </div>
              <div className="h-2 bg-[#F8FAF6] rounded-full overflow-hidden border border-[#E2EAD8]">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{
                    width: `${pct(stats.rejectedAgents, totalAgentApps)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 border-t border-[#E2EAD8] py-3">
            <Link href="/admin/agents" className="w-full">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-[#3B6D11] hover:bg-[#EAF3DE]"
              >
                Open Agent Application Manager{" "}
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Property Moderation Breakdown */}
        <Card className="border-[#E2EAD8] shadow-xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-[#1C1C1C]">
                Property Inventory Pipeline
              </CardTitle>
              <CardDescription className="text-xs text-[#6B7280]">
                Market listing moderation status & live inventory
              </CardDescription>
            </div>
            <Link href="/admin/properties">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-[#3B6D11] hover:bg-[#EAF3DE]"
              >
                Moderate <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#F8FAF6] border border-[#E2EAD8]">
                <p className="text-xs text-[#6B7280]">Active Live Listings</p>
                <p className="text-xl font-bold text-[#3B6D11] mt-1">
                  {stats.activeProps}
                </p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                  {pct(stats.activeProps, stats.totalProps)}% of platform
                  catalog
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAF6] border border-[#E2EAD8]">
                <p className="text-xs text-[#6B7280]">Pending Review</p>
                <p className="text-xl font-bold text-amber-600 mt-1">
                  {stats.pendingProps}
                </p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                  {pct(stats.pendingProps, stats.totalProps)}% awaiting review
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#F8FAF6] border border-[#E2EAD8]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B6D11]" />
                  <span className="font-semibold text-[#1C1C1C]">
                    Active Listings
                  </span>
                </div>
                <span className="font-bold text-[#3B6D11]">
                  {stats.activeProps}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#F8FAF6] border border-[#E2EAD8]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-[#1C1C1C]">
                    Under Moderation
                  </span>
                </div>
                <span className="font-bold text-amber-700">
                  {stats.pendingProps}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 border-t border-[#E2EAD8] py-3">
            <Link href="/admin/properties" className="w-full">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-[#3B6D11] hover:bg-[#EAF3DE]"
              >
                Manage Property Catalog{" "}
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Row 3 — Quick Management Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link href="/admin/agents">
          <Card className="border-[#E2EAD8] hover:border-[#C0DD97] hover:shadow-xs transition-all cursor-pointer p-4 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3DE] flex items-center justify-center shrink-0">
                <UserCheck className="h-5 w-5 text-[#3B6D11]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1C1C1C] group-hover:text-[#3B6D11] transition-colors">
                  Agent Applications
                </p>
                <p className="text-[11px] text-[#6B7280] truncate">
                  {stats.pendingAgents > 0
                    ? `${stats.pendingAgents} awaiting approval`
                    : "All reviewed"}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#3B6D11] transition-colors" />
            </div>
          </Card>
        </Link>

        <Link href="/admin/properties">
          <Card className="border-[#E2EAD8] hover:border-[#C0DD97] hover:shadow-xs transition-all cursor-pointer p-4 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3DE] flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-[#3B6D11]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1C1C1C] group-hover:text-[#3B6D11] transition-colors">
                  Property Moderation
                </p>
                <p className="text-[11px] text-[#6B7280] truncate">
                  {stats.pendingProps > 0
                    ? `${stats.pendingProps} pending review`
                    : "All moderated"}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#3B6D11] transition-colors" />
            </div>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="border-[#E2EAD8] hover:border-[#C0DD97] hover:shadow-xs transition-all cursor-pointer p-4 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3DE] flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-[#3B6D11]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1C1C1C] group-hover:text-[#3B6D11] transition-colors">
                  User Management
                </p>
                <p className="text-[11px] text-[#6B7280] truncate">
                  {stats.totalUsers} registered accounts
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#3B6D11] transition-colors" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
