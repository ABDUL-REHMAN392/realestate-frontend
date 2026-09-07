// components/PropCard.tsx
import Link from "next/link";
import { Building2, MapPin, Bed, Bath, Maximize2, Home, TreePine, Briefcase, Castle } from "lucide-react";

export interface Property {
  _id: string; title: string; type: string; purpose: "sale" | "rent";
  price: number; area: number; areaUnit: string;
  bedrooms?: number; bathrooms?: number;
  address?: { city?: string };
  images?: { url: string; isPrimary?: boolean }[];
  isFeatured?: boolean;
}

export function formatPrice(p?: number) {
  if (!p && p !== 0) return "0";
  if (p >= 10000000) return `${(p / 10000000).toFixed(1)} Cr`;
  if (p >= 100000) return `${(p / 100000).toFixed(0)} Lac`;
  return Number(p).toLocaleString();
}

export const TYPE_ICONS: Record<string, React.ElementType> = {
  house: Home, apartment: Building2, plot: TreePine, commercial: Briefcase, villa: Castle,
};

export function PropCard({ prop }: { prop: Property }) {
  if (!prop) return null;
  const cover = prop.images?.find((i) => i.isPrimary)?.url ?? prop.images?.[0]?.url;
  const TypeIcon = TYPE_ICONS[prop.type] ?? Building2;
  const city = prop.address?.city || "Pakistan";

  return (
    <>
      <style>{`
        .prop-card {
          flex-shrink: 0;
          width: 320px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #f0f0f0;
          background: #ffffff;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        @media (max-width: 640px) {
          .prop-card { width: 280px; }
        }
        .cards-grid .prop-card { width: auto; flex-shrink: unset; }
        .prop-card:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.09); transform: translateY(-3px); }
        .prop-img-wrap {
          position: relative;
          width: 100%;
          height: 195px;
          flex-shrink: 0;
          overflow: hidden;
          background: #f4f4f5;
        }
        .prop-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .prop-card:hover .prop-img { transform: scale(1.05); }
        .prop-img-placeholder {
          width: 100%; height: 100%; background: #f8faf6;
          display: flex; align-items: center; justify-content: center;
        }
        .prop-placeholder-icon { width: 42px; height: 42px; color: #c0dd97; }
        .prop-badge {
          position: absolute; top: 12px; left: 12px; font-size: 10px; font-weight: 700;
          padding: 4px 10px; border-radius: 999px; letter-spacing: 0.02em; z-index: 2;
        }
        .badge-sale { background: #0a0a0a; color: #fff; }
        .badge-rent { background: #1d4ed8; color: #fff; }
        .badge-featured { background: #f59e0b; color: #fff; top: 12px; left: auto; right: 12px; z-index: 2; }
        .prop-info {
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
          background: #ffffff;
        }
        .prop-price { font-size: 18px; font-weight: 800; color: #0a0a0a; margin: 0 0 2px; letter-spacing: -0.02em; }
        .prop-price-unit { font-size: 12px; font-weight: 500; color: #6b7280; }
        .prop-title { font-size: 13px; color: #1f2937; margin: 0 0 4px; line-height: 1.4; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .prop-location { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #6b7280; margin: 0 0 8px; }
        .prop-loc-icon { width: 12px; height: 12px; color: #9ca3af; }
        .prop-meta { display: flex; align-items: center; gap: 10px; padding-top: 10px; border-top: 1px solid #f3f4f6; margin-top: auto; }
        .prop-meta-item { display: flex; align-items: center; gap: 4px; font-size: 11.5px; color: #6b7280; white-space: nowrap; }
        .prop-meta-icon { width: 12px; height: 12px; color: #9ca3af; }
        .prop-meta-right { margin-left: auto; }
        .prop-capitalize { text-transform: capitalize; }
      `}</style>
      <Link href={`/properties/${prop._id}`} className="prop-card">
        <div className="prop-img-wrap">
          <img
            src={cover || "/property/property-placeholder.png"}
            alt={prop.title || "Property"}
            className="prop-img"
            onError={(e) => { e.currentTarget.src = "/property/property-placeholder.png"; }}
          />
          <span className={`prop-badge ${prop.purpose === "sale" ? "badge-sale" : "badge-rent"}`}>
            {prop.purpose === "sale" ? "For Sale" : "For Rent"}
          </span>
          {prop.isFeatured && <span className="prop-badge badge-featured">★ Featured</span>}
        </div>
        <div className="prop-info">
          <div>
            <p className="prop-price">
              PKR {formatPrice(prop.price)}
              {prop.purpose === "rent" && <span className="prop-price-unit">/mo</span>}
            </p>
            <p className="prop-title" title={prop.title}>{prop.title || "Untitled Property"}</p>
            <p className="prop-location"><MapPin className="prop-loc-icon" />{city}</p>
          </div>
          <div className="prop-meta">
            <span className="prop-meta-item"><TypeIcon className="prop-meta-icon" /><span className="prop-capitalize">{prop.type || "Home"}</span></span>
            {prop.bedrooms !== undefined && <span className="prop-meta-item"><Bed className="prop-meta-icon" />{prop.bedrooms} bed</span>}
            {prop.bathrooms !== undefined && <span className="prop-meta-item"><Bath className="prop-meta-icon" />{prop.bathrooms} bath</span>}
            <span className="prop-meta-item prop-meta-right"><Maximize2 className="prop-meta-icon" />{prop.area || 0} {prop.areaUnit || "Marla"}</span>
          </div>
        </div>
      </Link>
    </>
  );
}