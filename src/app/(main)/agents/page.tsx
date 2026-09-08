"use client";

import { useState, useEffect, useCallback } from "react";
import { agentApi } from "@/lib/api";
import { AgentHero } from "@/components/agents/AgentHero";
import { AgentSidebar, type AgentFilters } from "@/components/agents/AgentSidebar";
import { AgentGrid } from "@/components/agents/AgentGrid";
import { WhyChooseUs, Testimonials, JoinCTA, TrustBar, type Review } from "@/components/agents/AgentSections";
import type { Agent } from "@/components/agents/AgentCard";
import { WhyGharFind } from "@/components/homepage/WhyGharFind";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Testimonials as HomeTestimonials } from "@/components/homepage/Testimonials";
import { TrustedPartners } from "@/components/homepage/TrustedPartners";
import { FAQSection } from "@/components/homepage/FAQSection";

export default function AgentsPage() {
  /* ── Agents state ── */
  const [agents,     setAgents]     = useState<Agent[]>([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sortBy,     setSortBy]     = useState("rating");

  /* ── Reviews state ── */
  const [reviews,        setReviews]        = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  /* ── Filters ── */
  const [filters, setFilters] = useState<AgentFilters>({
    city:           "",
    specialization: "",
    minExperience:  "",
    minRating:      "",
    isVerified:     "",
  });

  const updateFilter = (k: keyof AgentFilters, v: string) =>
    setFilters((prev) => ({ ...prev, [k]: v }));

  const clearFilters = () =>
    setFilters({ city: "", specialization: "", minExperience: "", minRating: "", isVerified: "" });

  /* ── Fetch agents ── */
  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page, limit: 9, sortBy,
      };
      if (filters.city)           params.city           = filters.city;
      if (filters.specialization) params.specialization = filters.specialization;
      if (filters.minExperience)  params.minExperience  = Number(filters.minExperience);
      if (filters.minRating)      params.minRating      = Number(filters.minRating);
      if (filters.isVerified)     params.isVerified     = filters.isVerified;

      const { data } = await agentApi.getAllAgents(params);
      setAgents(data.data ?? []);
      // Support both pagination shapes
      setTotal(data.pagination?.total ?? data.total ?? 0);
      setTotalPages(data.pagination?.totalPages ?? data.totalPages ?? 1);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [filters, page, sortBy]);

  /* Reset page when filters/sort change */
  useEffect(() => { setPage(1); }, [filters, sortBy]);
  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  /* ── Fetch reviews ── */
  useEffect(() => {
    const loadReviews = async () => {
      setReviewsLoading(true);
      try {
        const { data: agentsData } = await agentApi.getAllAgents({
          page: 1, limit: 3, sortBy: "rating",
        });
        const topAgents: Agent[] = agentsData.data ?? [];

        const results = await Promise.all(
          topAgents.map((agent: Agent) =>
            agentApi
              .getReviews(agent._id, { page: 1, limit: 1, sortBy: "rating" })
              .then(({ data }: { data: { data: Review[] } }) => {
                const r = data.data?.[0];
                if (!r || (r.comment?.length ?? 0) <= 10) return null;
                return { ...r, agent: { city: agent.city } } as Review;
              })
              .catch(() => null)
          )
        );
        setReviews(results.filter((r): r is Review => r !== null));
      } catch { /* silent */ }
      finally { setReviewsLoading(false); }
    };
    loadReviews();
  }, []);

  /* Hero search handler */
  const handleHeroSearch = (city: string, specialty: string, exp: string) => {
    setFilters((prev) => ({
      ...prev,
      city:           city || prev.city,
      specialization: specialty || prev.specialization,
      minExperience:  exp || prev.minExperience,
    }));
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <AgentHero
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        sidebarOpen={sidebarOpen}
        onSearch={handleHeroSearch}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar — toggles on More Filters */}
          {sidebarOpen && (
            <AgentSidebar
              filters={filters}
              onChange={updateFilter}
              onApply={fetchAgents}
            />
          )}

          {/* Grid */}
          <AgentGrid
            agents={agents}
            total={total}
            loading={loading}
            filters={filters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            clearFilters={clearFilters}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Agent-specific bottom sections */}
      <WhyChooseUs />
      <Testimonials reviews={reviews} loading={reviewsLoading} />
      <JoinCTA />
      <TrustBar />

      {/* Homepage sections */}
      <WhyGharFind />
      <HowItWorks />
      <HomeTestimonials />
      <TrustedPartners />
      <FAQSection />
    </div>
  );
}