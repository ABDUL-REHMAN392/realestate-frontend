// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { propertyApi } from "@/lib/api";
import { HeroSection } from "@/components/homepage/HeroSection";
export default function HomePage() {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [purpose, setPurpose] = useState("sale");
  const [propType, setPropType] = useState("");

  useEffect(() => {
    propertyApi
      .getAll({ sortBy: "newest", limit: 8 })
      .then(({ data }) => setLatest(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingLatest(false));

    propertyApi
      .getAll({ purpose: "rent", sortBy: "newest", limit: 8 })
      .then(({ data }) => setRentals(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingRentals(false));

    propertyApi
      .getAll({ isFeatured: true, limit: 8 })
      .then(({ data }) => setFeatured(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  function doSearch() {
    const p = new URLSearchParams();
    if (searchText) p.set("search", searchText);
    if (purpose) p.set("purpose", purpose);
    if (propType) p.set("type", propType);
    router.push(`/properties?${p.toString()}`);
  }

  return (
    <div
      style={{
        color: "#111",
        background: "#fff",
      }}
    >
      <HeroSection
        searchText={searchText}
        onSearchTextChange={setSearchText}
        purpose={purpose}
        onPurposeChange={setPurpose}
        propType={propType}
        onPropTypeChange={setPropType}
        onSearch={doSearch}
        onCityClick={(city) =>
          router.push(`/properties?city=${city}&purpose=${purpose}`)
        }
      />
    </div>
  );
}
