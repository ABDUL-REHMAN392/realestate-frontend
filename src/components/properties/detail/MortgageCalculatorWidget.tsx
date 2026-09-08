"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/constants";

export default function MortgageCalculatorWidget({ propertyPrice }: { propertyPrice: number }) {
  const [downPct, setDownPct] = useState("20");
  const [years, setYears] = useState("20");

  const result = useMemo(() => {
    const loan = propertyPrice * (1 - Number(downPct) / 100);
    const r = 0.18 / 12;
    const n = Number(years) * 12;
    const emi = r === 0 ? loan / n : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { loan, emi };
  }, [propertyPrice, downPct, years]);

  return (
    <div className="bg-white border border-[#E2EAD8] rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#EAF3DE] flex items-center justify-center">
          <Calculator className="h-3.5 w-3.5 text-[#3B6D11]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#1C1C1C]">Mortgage Calculator</h3>
          <p className="text-xs text-[#9CA3AF]">Estimate your monthly payments</p>
        </div>
      </div>

      {/* Property Price */}
      <div className="space-y-1">
        <label className="text-xs text-[#6B7280]">Property Price</label>
        <div className="border border-[#E2EAD8] rounded-xl px-3 py-2.5 text-sm text-[#1C1C1C] bg-gray-50">
          {formatPrice(propertyPrice)}
        </div>
      </div>

      {/* Down Payment */}
      <div className="space-y-1">
        <label className="text-xs text-[#6B7280]">Down Payment</label>
        <div className="relative">
          <select
            value={downPct} onChange={(e) => setDownPct(e.target.value)}
            className="w-full border border-[#E2EAD8] rounded-xl px-3 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#3B6D11] appearance-none bg-white"
          >
            {[10, 15, 20, 25, 30, 35, 40].map((p) => (
              <option key={p} value={p}>
                PKR {Math.round((propertyPrice * p) / 100).toLocaleString()}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
        </div>
      </div>

      {/* Loan Term */}
      <div className="space-y-1">
        <label className="text-xs text-[#6B7280]">Loan Term</label>
        <div className="relative">
          <select
            value={years} onChange={(e) => setYears(e.target.value)}
            className="w-full border border-[#E2EAD8] rounded-xl px-3 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#3B6D11] appearance-none bg-white"
          >
            {[5, 10, 15, 20, 25, 30].map((y) => (
              <option key={y} value={y}>{y} Years</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none" />
        </div>
      </div>

      {/* Result */}
      <div className="bg-gray-50 border border-[#E2EAD8] rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-[#6B7280]">Estimated Monthly Payment</span>
        <span className="text-sm font-bold text-[#3B6D11]">{formatPrice(Math.round(result.emi))}</span>
      </div>

      <Link
        href="/calculator"
        className="block w-full text-center bg-[#3B6D11] hover:bg-[#2d5409] text-white font-semibold text-sm py-3 rounded-xl transition-colors"
      >
        Calculate Now
      </Link>
    </div>
  );
}