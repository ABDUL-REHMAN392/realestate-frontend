"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { propertyApi } from "@/lib/api";
import { Property, Filters } from "@/lib/types";
import { SidebarFilters } from "@/components/properties/SidebarFilters";
import { HeroSection } from "@/components/properties/HeroSection";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { ConsultationBanner } from "@/components/properties/ConsultationBanner";
import { TrustStrip } from "@/components/properties/TrustStrip";
import { WhyGharFind } from "@/components/homepage/WhyGharFind";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Testimonials } from "@/components/homepage/Testimonials";
import { TrustedPartners } from "@/components/homepage/TrustedPartners";
import { FAQSection } from "@/components/homepage/FAQSection";

export default function PropertiesPage() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("search") ?? "",
    purpose: searchParams.get("purpose") ?? "",
    type: searchParams.get("type") ?? "",
    city: searchParams.get("city") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    bedrooms: searchParams.get("bedrooms") ?? "",
    bathrooms: "",
    minArea: "",
    maxArea: "",
    sortBy: searchParams.get("sortBy") ?? "newest",
  });

  const updateFilter = (k: string, v: string) =>
    setFilters((prev) => ({ ...prev, [k]: v }));

  const clearFilters = () =>
    setFilters((prev) => ({
      ...prev,
      purpose: "",
      type: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
    }));

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 9 };
      if (filters.search) params.search = filters.search;
      if (filters.purpose) params.purpose = filters.purpose;
      if (filters.type) params.type = filters.type;
      if (filters.city) params.city = filters.city;
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
      if (filters.bedrooms) params.bedrooms = Number(filters.bedrooms);
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const { data } = await propertyApi.getAll(params);
      setProperties(data.data ?? []);
      setTotal(data.pagination?.total ?? 0);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="bg-white min-h-screen">
      <HeroSection
        filters={filters}
        updateFilter={updateFilter}
        onSearch={fetchProperties}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar — conditionally shown */}
          {sidebarOpen && (
            <SidebarFilters
              filters={filters}
              onChange={updateFilter}
              onApply={fetchProperties}
              total={total}
            />
          )}

          <PropertyGrid
            properties={properties}
            total={total}
            loading={loading}
            viewMode={viewMode}
            setViewMode={setViewMode}
            filters={filters}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        <ConsultationBanner />
        <TrustStrip />
      </div>

      {/* Homepage sections */}
      <WhyGharFind />
      <HowItWorks />
      <Testimonials />
      <TrustedPartners />
      <FAQSection />
    </div>
  );
}