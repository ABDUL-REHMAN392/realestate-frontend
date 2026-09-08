"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Building2, ArrowLeft } from "lucide-react";
import { propertyApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PropertyDetail, SimilarProperty } from "@/lib/types";
import {
  ImageGallery,
  PropertyDetailsTable,
  AmenitiesSection,
  DescriptionSection,
  MapAndNearby,
  SimilarProperties,
  AgentSidebar,
  SellPropertyBanner,
  PropertyPageHeader,
} from "@/components/properties/detail";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [similar, setSimilar] = useState<SimilarProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    propertyApi
      .getById(id)
      .then(({ data }) => {
        setProperty(data.data);
        return propertyApi.getAll({
          type: data.data.type,
          city: data.data.address.city,
          limit: 4,
          exclude: id,
        });
      })
      .then(({ data }) => setSimilar(data.data ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  /* Loading */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded w-48" />
        <div className="aspect-[16/9] bg-gray-100 rounded-2xl" />
        <div className="h-6 bg-gray-100 rounded w-2/3" />
      </div>
    );
  }

  /* Error */
  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <Building2 className="h-12 w-12 text-[#D1E5B8] mx-auto mb-3" />
        <p className="font-medium text-[#374151]">Property not found</p>
        <Button onClick={() => router.push("/properties")} variant="outline" className="mt-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Properties
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <PropertyPageHeader property={property} />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left — content */}
          <div className="lg:col-span-2 space-y-5">
            <ImageGallery images={property.images} />
            <PropertyDetailsTable property={property} />
            <AmenitiesSection features={property.features} />
            <DescriptionSection description={property.description} />
            <MapAndNearby property={property} />
          </div>

          {/* Right — sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <AgentSidebar property={property} />
            </div>
          </div>
        </div>

        {/* Similar */}
        <SimilarProperties
          similar={similar}
          type={property.type}
          city={property.address.city}
        />

        {/* Banner */}
        <div className="mt-8">
          <SellPropertyBanner />
        </div>

      </div>
    </div>
  );
}