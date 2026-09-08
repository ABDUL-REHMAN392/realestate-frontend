"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { WhyGharFind } from "@/components/homepage/WhyGharFind";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { Testimonials } from "@/components/homepage/Testimonials";
import { TrustedPartners } from "@/components/homepage/TrustedPartners";
import { FAQSection } from "@/components/homepage/FAQSection";
import {
  Calculator,
  Home,
  Percent,
  Calendar,
  DollarSign,
  TrendingDown,
  PieChart,
  Info,
  Building2,
  TrendingUp,
  FileText,
  BarChart3,
  ChevronRight,
  Lightbulb,
  BadgePercent,
  Wallet,
  MapPin,
  Star,
} from "lucide-react";

// ─── FORMATTERS ───────────────────────────────────────────────────────────────
function formatPKR(n: number) {
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `PKR ${(n / 100_000).toFixed(2)} Lac`;
  return `PKR ${Math.round(n).toLocaleString()}`;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function InputField({
  label,
  icon: Icon,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  hint,
  type = "number",
}: {
  label: string;
  icon: React.ElementType;
  value: number | string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151]">
        <Icon className="h-3.5 w-3.5 text-[#3B6D11]" />
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm text-[#9CA3AF] font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step ?? 1}
          className={`w-full h-11 border border-[#E2EAD8] rounded-xl text-sm text-[#1C1C1C] bg-white focus:outline-none focus:border-[#3B6D11] focus:ring-1 focus:ring-[#3B6D11]/20 transition-all ${prefix ? "pl-10" : "pl-4"} ${suffix ? "pr-14" : "pr-4"}`}
        />
        {suffix && (
          <span className="absolute right-3 text-sm text-[#9CA3AF] font-medium pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-[#9CA3AF]">{hint}</p>}
    </div>
  );
}

function SelectField({
  label,
  icon: Icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151]">
        <Icon className="h-3.5 w-3.5 text-[#3B6D11]" />
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 border border-[#E2EAD8] rounded-xl text-sm text-[#1C1C1C] bg-white focus:outline-none focus:border-[#3B6D11] px-4 transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color = "green",
}: {
  label: string;
  value: string;
  sub?: string;
  color?: "green" | "blue" | "amber" | "red" | "purple";
}) {
  const colors = {
    green: "bg-[#EAF3DE] text-[#3B6D11] border-[#C0DD97]",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <div className={`rounded-2xl border p-4 ${colors[color]}`}>
      <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
      <p className="text-xl font-bold leading-tight">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-3 border-b border-[#F0F6E8] last:border-0 ${highlight ? "font-semibold" : ""}`}
    >
      <span className="text-sm text-[#6B7280]">{label}</span>
      <span
        className={`text-sm ${highlight ? "text-[#3B6D11] text-base font-bold" : "text-[#1C1C1C] font-medium"}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── PIE CHART ────────────────────────────────────────────────────────────────
function DonutChart({
  slices,
}: {
  slices: { label: string; value: number; color: string }[];
}) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total === 0) return null;
  const r = 56,
    cx = 70,
    cy = 70,
    circ = 2 * Math.PI * r;
  let offset = circ * 0.25;
  return (
    <div className="flex items-center gap-6">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {slices.map((s) => {
          const dash = (s.value / total) * circ;
          const el = (
            <circle
              key={s.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="22"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset + circ * 0.25}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          offset += dash;
          return el;
        })}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fill="#374151"
          fontSize="9"
          fontWeight="600"
        >
          Breakdown
        </text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill="#6B7280" fontSize="8">
          {formatPKR(total)}
        </text>
      </svg>
      <div className="space-y-2.5">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: s.color }}
            />
            <div>
              <p className="text-xs text-[#6B7280]">{s.label}</p>
              <p className="text-xs font-semibold text-[#1C1C1C]">
                {((s.value / total) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AMORTIZATION TABLE ───────────────────────────────────────────────────────
function AmortizationTable({
  principal,
  annualRate,
  months,
}: {
  principal: number;
  annualRate: number;
  months: number;
}) {
  const monthlyRate = annualRate / 100 / 12;
  const emi =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
  const rows = [];
  let balance = principal;
  const show = Math.min(months, 24);
  for (let i = 1; i <= show; i++) {
    const intPay = balance * monthlyRate;
    const prinPay = emi - intPay;
    balance -= prinPay;
    rows.push({
      month: i,
      emi,
      interest: intPay,
      principal: prinPay,
      balance: Math.max(0, balance),
    });
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E2EAD8]">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[#F8FAF6] border-b border-[#E2EAD8]">
            {["Month", "EMI", "Interest", "Principal", "Balance"].map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 text-left font-semibold text-[#374151]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.month}
              className={`border-b border-[#F0F6E8] ${i % 2 === 0 ? "bg-white" : "bg-[#FAFBF8]"}`}
            >
              <td className="px-3 py-2 text-[#374151] font-medium">
                {row.month}
              </td>
              <td className="px-3 py-2 text-[#374151]">{formatPKR(row.emi)}</td>
              <td className="px-3 py-2 text-red-600">
                {formatPKR(row.interest)}
              </td>
              <td className="px-3 py-2 text-[#3B6D11]">
                {formatPKR(row.principal)}
              </td>
              <td className="px-3 py-2 text-[#6B7280]">
                {formatPKR(row.balance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {months > 24 && (
        <p className="text-center text-xs text-[#9CA3AF] py-2 bg-[#F8FAF6]">
          Showing first 24 of {months} months
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. LOAN CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════
function LoanCalculator() {
  const [price, setPrice] = useState("10000000");
  const [downPct, setDownPct] = useState("20");
  const [rate, setRate] = useState("18");
  const [years, setYears] = useState("20");
  const [showTable, setShowTable] = useState(false);

  const calc = useMemo(() => {
    const P = Number(price),
      dp = Math.min(Number(downPct), 100);
    const r = Number(rate),
      y = Number(years);
    if (!P || !r || !y || P < 0 || r < 0 || y < 0) return null;
    const downAmt = P * (dp / 100);
    const loan = P - downAmt;
    const months = y * 12;
    const mRate = r / 100 / 12;
    const emi =
      mRate === 0
        ? loan / months
        : (loan * mRate * Math.pow(1 + mRate, months)) /
          (Math.pow(1 + mRate, months) - 1);
    const totalPay = emi * months;
    const totalInt = totalPay - loan;
    return { downAmt, loan, emi, totalPay, totalInt, months, annualRate: r };
  }, [price, downPct, rate, years]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-[#E2EAD8] rounded-2xl p-6 space-y-5 h-fit">
        <h2 className="font-semibold text-[#1C1C1C] flex items-center gap-2">
          <Home className="h-4 w-4 text-[#3B6D11]" /> Loan Details
        </h2>
        <InputField
          label="Property Price"
          icon={DollarSign}
          value={price}
          onChange={setPrice}
          min={100000}
          step={100000}
          prefix="PKR"
          hint={price ? formatPKR(Number(price)) : ""}
        />
        <InputField
          label="Down Payment"
          icon={TrendingDown}
          value={downPct}
          onChange={setDownPct}
          min={0}
          max={95}
          step={1}
          suffix="%"
          hint={
            price && downPct
              ? `= ${formatPKR(Number(price) * (Number(downPct) / 100))}`
              : ""
          }
        />
        <InputField
          label="Annual Interest Rate"
          icon={Percent}
          value={rate}
          onChange={setRate}
          min={0}
          max={40}
          step={0.1}
          suffix="% p.a."
          hint="Pakistan bank rates typically 18–22%"
        />
        <InputField
          label="Loan Tenure"
          icon={Calendar}
          value={years}
          onChange={setYears}
          min={1}
          max={30}
          step={1}
          suffix="years"
          hint={years ? `= ${Number(years) * 12} monthly installments` : ""}
        />
        <div>
          <p className="text-xs text-[#9CA3AF] mb-2 font-medium">
            Quick Presets
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "50 Lac", value: "5000000" },
              { label: "1 Crore", value: "10000000" },
              { label: "2 Crore", value: "20000000" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPrice(p.value)}
                className={`text-xs py-2 rounded-xl border transition-all font-medium ${price === p.value ? "bg-[#3B6D11] text-white border-[#3B6D11]" : "border-[#E2EAD8] text-[#6B7280] hover:border-[#3B6D11] hover:text-[#3B6D11]"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#F8FAF6] border border-[#E2EAD8] rounded-xl p-3 flex gap-2">
          <Info className="h-4 w-4 text-[#3B6D11] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#6B7280]">
            Estimate only. Actual EMI may vary based on bank policies and fees.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {calc ? (
          <>
            <div className="bg-[#3B6D11] text-white rounded-2xl p-6">
              <p className="text-sm text-white/70 mb-1">
                Monthly Installment (EMI)
              </p>
              <p className="text-4xl font-bold">{formatPKR(calc.emi)}</p>
              <p className="text-xs text-white/60 mt-2">
                for {years} years ({calc.months} payments)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Loan Amount"
                value={formatPKR(calc.loan)}
                color="blue"
              />
              <StatCard
                label="Down Payment"
                value={formatPKR(calc.downAmt)}
                color="green"
              />
              <StatCard
                label="Total Interest"
                value={formatPKR(calc.totalInt)}
                color="red"
              />
              <StatCard
                label="Total Payment"
                value={formatPKR(calc.totalPay)}
                color="amber"
              />
            </div>
            <div className="bg-white border border-[#E2EAD8] rounded-2xl p-5">
              <h3 className="font-semibold text-[#1C1C1C] text-sm mb-4 flex items-center gap-2">
                <PieChart className="h-4 w-4 text-[#3B6D11]" /> Cost Breakdown
              </h3>
              <DonutChart
                slices={[
                  { label: "Principal", value: calc.loan, color: "#3B6D11" },
                  {
                    label: "Total Interest",
                    value: calc.totalInt,
                    color: "#FCA5A5",
                  },
                ]}
              />
            </div>
            <div className="bg-white border border-[#E2EAD8] rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowTable(!showTable)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F8FAF6] transition-colors"
              >
                <span className="font-semibold text-[#1C1C1C] text-sm">
                  Monthly Breakdown Schedule
                </span>
                <span className="text-xs text-[#3B6D11] font-medium">
                  {showTable ? "Hide ↑" : "Show ↓"}
                </span>
              </button>
              {showTable && (
                <div className="px-4 pb-4">
                  <AmortizationTable
                    principal={calc.loan}
                    annualRate={calc.annualRate}
                    months={calc.months}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white border border-[#E2EAD8] rounded-2xl p-12 text-center text-[#9CA3AF]">
            <Calculator className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Enter loan details to calculate</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. AFFORDABILITY CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════
function AffordabilityCalculator() {
  const [income, setIncome] = useState("200000");
  const [expenses, setExpenses] = useState("50000");
  const [rate, setRate] = useState("18");
  const [years, setYears] = useState("20");
  const [downPct, setDownPct] = useState("20");

  const calc = useMemo(() => {
    const netIncome = Number(income) - Number(expenses);
    const maxEMI = netIncome * 0.5; // 50% of net income for EMI (standard rule)
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;
    if (netIncome <= 0 || !r || !n) return null;
    const maxLoan =
      r === 0
        ? maxEMI * n
        : (maxEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    const dp = Number(downPct) / 100;
    const maxProperty = maxLoan / (1 - dp);
    const downAmt = maxProperty * dp;
    return { maxEMI, maxLoan, maxProperty, downAmt, netIncome, months: n };
  }, [income, expenses, rate, years, downPct]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-[#E2EAD8] rounded-2xl p-6 space-y-5 h-fit">
        <h2 className="font-semibold text-[#1C1C1C] flex items-center gap-2">
          <Wallet className="h-4 w-4 text-[#3B6D11]" /> Your Financial Details
        </h2>
        <InputField
          label="Monthly Income"
          icon={DollarSign}
          value={income}
          onChange={setIncome}
          min={10000}
          step={10000}
          prefix="PKR"
          hint={income ? formatPKR(Number(income)) : ""}
        />
        <InputField
          label="Monthly Expenses"
          icon={TrendingDown}
          value={expenses}
          onChange={setExpenses}
          min={0}
          step={5000}
          prefix="PKR"
          hint={expenses ? formatPKR(Number(expenses)) : ""}
        />
        <InputField
          label="Annual Interest Rate"
          icon={Percent}
          value={rate}
          onChange={setRate}
          min={0}
          max={40}
          step={0.1}
          suffix="% p.a."
        />
        <InputField
          label="Loan Tenure"
          icon={Calendar}
          value={years}
          onChange={setYears}
          min={1}
          max={30}
          step={1}
          suffix="years"
        />
        <InputField
          label="Down Payment"
          icon={TrendingDown}
          value={downPct}
          onChange={setDownPct}
          min={0}
          max={95}
          step={5}
          suffix="%"
        />
        <div className="bg-[#F8FAF6] border border-[#E2EAD8] rounded-xl p-3 flex gap-2">
          <Lightbulb className="h-4 w-4 text-[#3B6D11] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#6B7280]">
            Based on 50% of net income rule — standard for Pakistani banks.
            Actual eligibility may vary.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {calc ? (
          <>
            <div className="bg-[#3B6D11] text-white rounded-2xl p-6">
              <p className="text-sm text-white/70 mb-1">
                Maximum Property You Can Afford
              </p>
              <p className="text-4xl font-bold">
                {formatPKR(calc.maxProperty)}
              </p>
              <p className="text-xs text-white/60 mt-2">
                with {downPct}% down payment over {years} years
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Net Monthly Income"
                value={formatPKR(calc.netIncome)}
                color="green"
              />
              <StatCard
                label="Max Monthly EMI"
                value={formatPKR(calc.maxEMI)}
                color="blue"
                sub="50% of net income"
              />
              <StatCard
                label="Max Loan Eligible"
                value={formatPKR(calc.maxLoan)}
                color="amber"
              />
              <StatCard
                label="Required Down Payment"
                value={formatPKR(calc.downAmt)}
                color="purple"
              />
            </div>
            <div className="bg-white border border-[#E2EAD8] rounded-2xl p-5">
              <h3 className="font-semibold text-[#1C1C1C] text-sm mb-3">
                Affordability Breakdown
              </h3>
              <ResultRow
                label="Gross Monthly Income"
                value={formatPKR(Number(income))}
              />
              <ResultRow
                label="Monthly Expenses"
                value={formatPKR(Number(expenses))}
              />
              <ResultRow
                label="Net Disposable Income"
                value={formatPKR(calc.netIncome)}
              />
              <ResultRow
                label="Max Allowed EMI (50%)"
                value={formatPKR(calc.maxEMI)}
              />
              <ResultRow
                label="Maximum Loan Amount"
                value={formatPKR(calc.maxLoan)}
                highlight
              />
              <ResultRow
                label="Maximum Property Price"
                value={formatPKR(calc.maxProperty)}
                highlight
              />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Banks in Pakistan typically allow 40-50% of gross income as EMI.
                Maintain a good credit history for better rates.
              </p>
            </div>
          </>
        ) : (
          <div className="bg-white border border-[#E2EAD8] rounded-2xl p-12 text-center text-[#9CA3AF]">
            <Wallet className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Enter your income details to check affordability
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. ROI CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════
function ROICalculator() {
  const [purchasePrice, setPurchasePrice] = useState("10000000");
  const [renovationCost, setRenovationCost] = useState("500000");
  const [currentValue, setCurrentValue] = useState("13000000");
  const [holdYears, setHoldYears] = useState("3");
  const [monthlyRent, setMonthlyRent] = useState("60000");

  const calc = useMemo(() => {
    const pp = Number(purchasePrice);
    const rc = Number(renovationCost);
    const cv = Number(currentValue);
    const hy = Number(holdYears);
    const mr = Number(monthlyRent);
    if (!pp || !cv || !hy) return null;
    const totalInvested = pp + rc;
    const capitalGain = cv - totalInvested;
    const totalRent = mr * 12 * hy;
    const totalReturn = capitalGain + totalRent;
    const roi = (totalReturn / totalInvested) * 100;
    const annualROI = roi / hy;
    const grossYield = ((mr * 12) / pp) * 100;
    return {
      totalInvested,
      capitalGain,
      totalRent,
      totalReturn,
      roi,
      annualROI,
      grossYield,
    };
  }, [purchasePrice, renovationCost, currentValue, holdYears, monthlyRent]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-[#E2EAD8] rounded-2xl p-6 space-y-5 h-fit">
        <h2 className="font-semibold text-[#1C1C1C] flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#3B6D11]" /> Investment Details
        </h2>
        <InputField
          label="Purchase Price"
          icon={DollarSign}
          value={purchasePrice}
          onChange={setPurchasePrice}
          min={0}
          step={100000}
          prefix="PKR"
          hint={purchasePrice ? formatPKR(Number(purchasePrice)) : ""}
        />
        <InputField
          label="Renovation / Other Costs"
          icon={Home}
          value={renovationCost}
          onChange={setRenovationCost}
          min={0}
          step={10000}
          prefix="PKR"
          hint="Include furnishing, legal fees etc."
        />
        <InputField
          label="Current Market Value"
          icon={TrendingUp}
          value={currentValue}
          onChange={setCurrentValue}
          min={0}
          step={100000}
          prefix="PKR"
          hint={currentValue ? formatPKR(Number(currentValue)) : ""}
        />
        <InputField
          label="Holding Period"
          icon={Calendar}
          value={holdYears}
          onChange={setHoldYears}
          min={1}
          max={30}
          step={1}
          suffix="years"
        />
        <InputField
          label="Monthly Rental Income"
          icon={DollarSign}
          value={monthlyRent}
          onChange={setMonthlyRent}
          min={0}
          step={5000}
          prefix="PKR"
          hint="Leave 0 if not rented"
        />
        <div className="bg-[#F8FAF6] border border-[#E2EAD8] rounded-xl p-3 flex gap-2">
          <Info className="h-4 w-4 text-[#3B6D11] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#6B7280]">
            ROI = (Capital Gain + Total Rent) ÷ Total Invested × 100
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {calc ? (
          <>
            <div
              className={`${calc.roi >= 0 ? "bg-[#3B6D11]" : "bg-red-600"} text-white rounded-2xl p-6`}
            >
              <p className="text-sm text-white/70 mb-1">
                Total Return on Investment
              </p>
              <p className="text-4xl font-bold">{calc.roi.toFixed(2)}%</p>
              <p className="text-xs text-white/60 mt-2">
                {calc.annualROI.toFixed(2)}% per year over {holdYears} years
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Total Invested"
                value={formatPKR(calc.totalInvested)}
                color="blue"
              />
              <StatCard
                label="Gross Rental Yield"
                value={`${calc.grossYield.toFixed(2)}%`}
                color="green"
                sub="Annual"
              />
              <StatCard
                label="Capital Gain"
                value={formatPKR(calc.capitalGain)}
                color={calc.capitalGain >= 0 ? "green" : "red"}
              />
              <StatCard
                label="Total Rental Income"
                value={formatPKR(calc.totalRent)}
                color="amber"
              />
            </div>
            <div className="bg-white border border-[#E2EAD8] rounded-2xl p-5">
              <h3 className="font-semibold text-[#1C1C1C] text-sm mb-3">
                Return Breakdown
              </h3>
              <ResultRow
                label="Purchase Price"
                value={formatPKR(Number(purchasePrice))}
              />
              <ResultRow
                label="Additional Costs"
                value={formatPKR(Number(renovationCost))}
              />
              <ResultRow
                label="Total Invested"
                value={formatPKR(calc.totalInvested)}
              />
              <ResultRow
                label="Current Market Value"
                value={formatPKR(Number(currentValue))}
              />
              <ResultRow
                label="Capital Appreciation"
                value={formatPKR(calc.capitalGain)}
              />
              <ResultRow
                label="Total Rental Earnings"
                value={formatPKR(calc.totalRent)}
              />
              <ResultRow
                label="Total Return"
                value={formatPKR(calc.totalReturn)}
                highlight
              />
              <ResultRow
                label="Annual ROI"
                value={`${calc.annualROI.toFixed(2)}%`}
                highlight
              />
            </div>
          </>
        ) : (
          <div className="bg-white border border-[#E2EAD8] rounded-2xl p-12 text-center text-[#9CA3AF]">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Enter investment details to calculate ROI</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. STAMP DUTY CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════
const CITY_RATES: Record<
  string,
  { stampDuty: number; registrationFee: number; cvt: number; gst: number }
> = {
  lahore: { stampDuty: 3, registrationFee: 1, cvt: 2, gst: 0 },
  karachi: { stampDuty: 3, registrationFee: 0.5, cvt: 2, gst: 0 },
  islamabad: { stampDuty: 2, registrationFee: 1, cvt: 2, gst: 0 },
  rawalpindi: { stampDuty: 3, registrationFee: 1, cvt: 2, gst: 0 },
  peshawar: { stampDuty: 3, registrationFee: 1, cvt: 1.5, gst: 0 },
  quetta: { stampDuty: 2, registrationFee: 0.5, cvt: 1, gst: 0 },
  faisalabad: { stampDuty: 3, registrationFee: 1, cvt: 2, gst: 0 },
  multan: { stampDuty: 3, registrationFee: 1, cvt: 2, gst: 0 },
};

function StampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState("10000000");
  const [city, setCity] = useState("lahore");
  const [propertyType, setPropertyType] = useState("residential");
  const [agentCommission, setAgentCommission] = useState("2");

  const calc = useMemo(() => {
    const pv = Number(propertyValue);
    const rates = CITY_RATES[city];
    if (!pv || !rates) return null;
    const commercialMultiplier = propertyType === "commercial" ? 1.5 : 1;
    const stampDuty = ((pv * rates.stampDuty) / 100) * commercialMultiplier;
    const registrationFee = (pv * rates.registrationFee) / 100;
    const cvt = (pv * rates.cvt) / 100;
    const agentFee = (pv * Number(agentCommission)) / 100;
    const otherCharges = 15000; // misc fixed charges
    const totalCharges =
      stampDuty + registrationFee + cvt + agentFee + otherCharges;
    const totalCost = pv + totalCharges;
    return {
      stampDuty,
      registrationFee,
      cvt,
      agentFee,
      otherCharges,
      totalCharges,
      totalCost,
      rates,
      commercialMultiplier,
    };
  }, [propertyValue, city, propertyType, agentCommission]);

  const cityOptions = Object.keys(CITY_RATES).map((c) => ({
    label: c.charAt(0).toUpperCase() + c.slice(1),
    value: c,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-[#E2EAD8] rounded-2xl p-6 space-y-5 h-fit">
        <h2 className="font-semibold text-[#1C1C1C] flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#3B6D11]" /> Property & Location
          Details
        </h2>
        <InputField
          label="Property Value"
          icon={DollarSign}
          value={propertyValue}
          onChange={setPropertyValue}
          min={0}
          step={100000}
          prefix="PKR"
          hint={propertyValue ? formatPKR(Number(propertyValue)) : ""}
        />
        <SelectField
          label="City"
          icon={MapPin}
          value={city}
          onChange={setCity}
          options={cityOptions}
        />
        <SelectField
          label="Property Type"
          icon={Building2}
          value={propertyType}
          onChange={setPropertyType}
          options={[
            { label: "Residential", value: "residential" },
            { label: "Commercial", value: "commercial" },
          ]}
        />
        <InputField
          label="Agent Commission"
          icon={Percent}
          value={agentCommission}
          onChange={setAgentCommission}
          min={0}
          max={5}
          step={0.5}
          suffix="%"
        />
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
          <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Rates vary by city and year. Always verify with your local registrar
            for the most accurate figures.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {calc ? (
          <>
            <div className="bg-[#3B6D11] text-white rounded-2xl p-6">
              <p className="text-sm text-white/70 mb-1">
                Total Transaction Cost
              </p>
              <p className="text-4xl font-bold">{formatPKR(calc.totalCost)}</p>
              <p className="text-xs text-white/60 mt-2">
                Including all taxes & fees for{" "}
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </p>
            </div>
            <div className="bg-white border border-[#E2EAD8] rounded-2xl p-5">
              <h3 className="font-semibold text-[#1C1C1C] text-sm mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#3B6D11]" /> Charges
                Breakdown
              </h3>
              <ResultRow
                label="Property Value"
                value={formatPKR(Number(propertyValue))}
              />
              <ResultRow
                label={`Stamp Duty (${calc.rates.stampDuty * calc.commercialMultiplier}%)`}
                value={formatPKR(calc.stampDuty)}
              />
              <ResultRow
                label={`Registration Fee (${calc.rates.registrationFee}%)`}
                value={formatPKR(calc.registrationFee)}
              />
              <ResultRow
                label={`CVT / WHT (${calc.rates.cvt}%)`}
                value={formatPKR(calc.cvt)}
              />
              <ResultRow
                label={`Agent Commission (${agentCommission}%)`}
                value={formatPKR(calc.agentFee)}
              />
              <ResultRow
                label="Other / Miscellaneous"
                value={formatPKR(calc.otherCharges)}
              />
              <ResultRow
                label="Total Extra Charges"
                value={formatPKR(calc.totalCharges)}
                highlight
              />
              <ResultRow
                label="Total Cost to Buyer"
                value={formatPKR(calc.totalCost)}
                highlight
              />
            </div>
            <div className="bg-white border border-[#E2EAD8] rounded-2xl p-5">
              <h3 className="font-semibold text-[#1C1C1C] text-sm mb-4">
                Cost Distribution
              </h3>
              <DonutChart
                slices={[
                  {
                    label: "Property Value",
                    value: Number(propertyValue),
                    color: "#3B6D11",
                  },
                  {
                    label: "Stamp Duty",
                    value: calc.stampDuty,
                    color: "#60A5FA",
                  },
                  {
                    label: "Registration",
                    value: calc.registrationFee,
                    color: "#FCA5A5",
                  },
                  { label: "CVT/WHT", value: calc.cvt, color: "#FCD34D" },
                  {
                    label: "Agent Fee",
                    value: calc.agentFee,
                    color: "#A78BFA",
                  },
                ]}
              />
            </div>
          </>
        ) : (
          <div className="bg-white border border-[#E2EAD8] rounded-2xl p-12 text-center text-[#9CA3AF]">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Enter property details to calculate stamp duty
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. RENTAL YIELD CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════
function RentalYieldCalculator() {
  const [propertyValue, setPropertyValue] = useState("10000000");
  const [monthlyRent, setMonthlyRent] = useState("60000");
  const [vacancyRate, setVacancyRate] = useState("8");
  const [maintenanceCost, setMaintenanceCost] = useState("30000");
  const [propertyTax, setPropertyTax] = useState("20000");
  const [managementFee, setManagementFee] = useState("5");

  const calc = useMemo(() => {
    const pv = Number(propertyValue);
    const mr = Number(monthlyRent);
    const vr = Number(vacancyRate) / 100;
    const mc = Number(maintenanceCost);
    const pt = Number(propertyTax);
    const mf = Number(managementFee) / 100;
    if (!pv || !mr) return null;
    const annualRent = mr * 12;
    const grossYield = (annualRent / pv) * 100;
    const vacancyLoss = annualRent * vr;
    const effectiveRent = annualRent - vacancyLoss;
    const managementFeeAmt = effectiveRent * mf;
    const totalExpenses = mc + pt + managementFeeAmt;
    const netRent = effectiveRent - totalExpenses;
    const netYield = (netRent / pv) * 100;
    const paybackYears = netRent > 0 ? pv / netRent : Infinity;
    return {
      annualRent,
      grossYield,
      vacancyLoss,
      effectiveRent,
      managementFeeAmt,
      totalExpenses,
      netRent,
      netYield,
      paybackYears,
    };
  }, [
    propertyValue,
    monthlyRent,
    vacancyRate,
    maintenanceCost,
    propertyTax,
    managementFee,
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-[#E2EAD8] rounded-2xl p-6 space-y-5 h-fit">
        <h2 className="font-semibold text-[#1C1C1C] flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#3B6D11]" /> Rental Property
          Details
        </h2>
        <InputField
          label="Property Value"
          icon={DollarSign}
          value={propertyValue}
          onChange={setPropertyValue}
          min={0}
          step={100000}
          prefix="PKR"
          hint={propertyValue ? formatPKR(Number(propertyValue)) : ""}
        />
        <InputField
          label="Monthly Rent"
          icon={DollarSign}
          value={monthlyRent}
          onChange={setMonthlyRent}
          min={0}
          step={1000}
          prefix="PKR"
          hint={
            monthlyRent ? `Annual: ${formatPKR(Number(monthlyRent) * 12)}` : ""
          }
        />
        <InputField
          label="Vacancy Rate"
          icon={Percent}
          value={vacancyRate}
          onChange={setVacancyRate}
          min={0}
          max={50}
          step={1}
          suffix="%"
          hint="Typical: 5–10% in Pakistan"
        />
        <InputField
          label="Annual Maintenance Cost"
          icon={Home}
          value={maintenanceCost}
          onChange={setMaintenanceCost}
          min={0}
          step={5000}
          prefix="PKR"
        />
        <InputField
          label="Annual Property Tax"
          icon={FileText}
          value={propertyTax}
          onChange={setPropertyTax}
          min={0}
          step={1000}
          prefix="PKR"
        />
        <InputField
          label="Property Management Fee"
          icon={BadgePercent}
          value={managementFee}
          onChange={setManagementFee}
          min={0}
          max={20}
          step={0.5}
          suffix="%"
          hint="Of effective rental income"
        />
      </div>

      <div className="space-y-5">
        {calc ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#3B6D11] text-white rounded-2xl p-4">
                <p className="text-xs text-white/70 mb-1">Gross Yield</p>
                <p className="text-3xl font-bold">
                  {calc.grossYield.toFixed(2)}%
                </p>
                <p className="text-xs text-white/60 mt-1">per annum</p>
              </div>
              <div
                className={`${calc.netYield >= 4 ? "bg-blue-600" : "bg-amber-500"} text-white rounded-2xl p-4`}
              >
                <p className="text-xs text-white/70 mb-1">Net Yield</p>
                <p className="text-3xl font-bold">
                  {calc.netYield.toFixed(2)}%
                </p>
                <p className="text-xs text-white/60 mt-1">after expenses</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Gross Annual Rent"
                value={formatPKR(calc.annualRent)}
                color="green"
              />
              <StatCard
                label="Vacancy Loss"
                value={formatPKR(calc.vacancyLoss)}
                color="red"
              />
              <StatCard
                label="Net Annual Income"
                value={formatPKR(calc.netRent)}
                color="blue"
              />
              <StatCard
                label="Payback Period"
                value={
                  calc.paybackYears === Infinity
                    ? "N/A"
                    : `${calc.paybackYears.toFixed(1)} yrs`
                }
                color="amber"
              />
            </div>
            <div className="bg-white border border-[#E2EAD8] rounded-2xl p-5">
              <h3 className="font-semibold text-[#1C1C1C] text-sm mb-3">
                Income & Expense Breakdown
              </h3>
              <ResultRow
                label="Gross Annual Rent"
                value={formatPKR(calc.annualRent)}
              />
              <ResultRow
                label={`Vacancy Loss (${vacancyRate}%)`}
                value={`- ${formatPKR(calc.vacancyLoss)}`}
              />
              <ResultRow
                label="Effective Rental Income"
                value={formatPKR(calc.effectiveRent)}
              />
              <ResultRow
                label="Annual Maintenance"
                value={`- ${formatPKR(Number(maintenanceCost))}`}
              />
              <ResultRow
                label="Property Tax"
                value={`- ${formatPKR(Number(propertyTax))}`}
              />
              <ResultRow
                label={`Management Fee (${managementFee}%)`}
                value={`- ${formatPKR(calc.managementFeeAmt)}`}
              />
              <ResultRow
                label="Net Annual Income"
                value={formatPKR(calc.netRent)}
                highlight
              />
              <ResultRow
                label="Net Rental Yield"
                value={`${calc.netYield.toFixed(2)}%`}
                highlight
              />
            </div>
            <div
              className={`rounded-2xl p-4 border flex gap-3 ${calc.netYield >= 6 ? "bg-[#EAF3DE] border-[#C0DD97]" : calc.netYield >= 3 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}
            >
              <Star
                className={`h-4 w-4 flex-shrink-0 mt-0.5 ${calc.netYield >= 6 ? "text-[#3B6D11]" : calc.netYield >= 3 ? "text-amber-600" : "text-red-500"}`}
              />
              <p
                className={`text-xs ${calc.netYield >= 6 ? "text-[#3B6D11]" : calc.netYield >= 3 ? "text-amber-700" : "text-red-700"}`}
              >
                {calc.netYield >= 6
                  ? "Excellent yield! This property is a strong rental investment."
                  : calc.netYield >= 3
                    ? "Average yield. Consider negotiating price or improving rent."
                    : "Low yield. Review expenses or reconsider the investment."}
              </p>
            </div>
          </>
        ) : (
          <div className="bg-white border border-[#E2EAD8] rounded-2xl p-12 text-center text-[#9CA3AF]">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Enter property details to calculate rental yield
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROPERTY PRICE CALCULATOR (top section with Estimation Breakdown panel)
// ═══════════════════════════════════════════════════════════════════════════════
const LOCATIONS = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Quetta",
  "Faisalabad",
  "Multan",
];
const PROP_TYPES = ["House", "Apartment", "Plot", "Commercial", "Villa"];

function PropertyPriceCalculator() {
  const [propPrice, setPropPrice] = useState("25000000");
  const [downPct, setDownPct] = useState("30");
  const [location, setLocation] = useState("Lahore");
  const [propType, setPropType] = useState("House");
  const [taxRate, setTaxRate] = useState("3.0");
  const [agentComm, setAgentComm] = useState("2.0");

  const calc = useMemo(() => {
    const pp = Number(propPrice);
    const dp = pp * (Number(downPct) / 100);
    const rem = pp - dp;
    const tax = pp * (Number(taxRate) / 100);
    const agent = pp * (Number(agentComm) / 100);
    const other = 250000;
    const total = pp + tax + agent + other;
    return { pp, dp, rem, tax, agent, other, total };
  }, [propPrice, downPct, taxRate, agentComm]);

  return (
    <div className="bg-white rounded-2xl border border-[#E2EAD8] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT — Form */}
        <div className="p-6 space-y-4 border-r border-[#E2EAD8]">
          <div>
            <h2 className="text-lg font-bold text-[#1C1C1C]">
              Property Price Calculator
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Calculate property total cost including taxes and fees.
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#374151]">
              Property Price (PKR)
            </label>
            <input
              type="number"
              value={propPrice}
              onChange={(e) => setPropPrice(e.target.value)}
              className="w-full h-11 border border-[#E2EAD8] rounded-lg px-3 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#3B6D11]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#374151]">
              Down Payment (PKR)
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={Math.round(calc.dp)}
                readOnly
                className="w-full h-11 border border-[#E2EAD8] rounded-lg px-3 text-sm text-[#1C1C1C] bg-white focus:outline-none"
              />
              <span className="absolute right-3 text-xs font-semibold text-white bg-[#3B6D11] px-2 py-1 rounded-md">
                {downPct}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={95}
              step={1}
              value={downPct}
              onChange={(e) => setDownPct(e.target.value)}
              className="w-full accent-[#3B6D11] h-1.5 mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#374151]">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 border border-[#E2EAD8] rounded-lg px-3 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#3B6D11]"
              >
                {LOCATIONS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#374151]">
                Property Type
              </label>
              <select
                value={propType}
                onChange={(e) => setPropType(e.target.value)}
                className="w-full h-11 border border-[#E2EAD8] rounded-lg px-3 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#3B6D11]"
              >
                {PROP_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#374151]">
                Tax Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  step={0.1}
                  min={0}
                  max={20}
                  className="w-full h-11 border border-[#E2EAD8] rounded-lg pl-3 pr-8 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#3B6D11]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">
                  %
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#374151]">
                Agent Commission (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={agentComm}
                  onChange={(e) => setAgentComm(e.target.value)}
                  step={0.1}
                  min={0}
                  max={10}
                  className="w-full h-11 border border-[#E2EAD8] rounded-lg pl-3 pr-8 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#3B6D11]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF]">
                  %
                </span>
              </div>
            </div>
          </div>
          <button className="w-full h-12 bg-[#3B6D11] hover:bg-[#2d5409] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
            <Calculator className="h-4 w-4" /> Calculate Now
          </button>
        </div>

        {/* RIGHT — Estimation Breakdown (dark panel) */}
        <div className="bg-[#1C2B0E] text-white p-6 flex flex-col">
          <h3 className="text-base font-bold text-white mb-5">
            Estimation Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Property Price</span>
              <span className="font-medium">
                PKR {Math.round(calc.pp).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Down Payment ({downPct}%)</span>
              <span className="font-medium text-red-400">
                - PKR {Math.round(calc.dp).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-white/10 pt-3">
              <span className="font-semibold">Remaining Amount</span>
              <span className="font-bold text-[#7BC96F]">
                PKR {Math.round(calc.rem).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-5 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Tax ({taxRate}%)</span>
              <span className="text-white/90">
                PKR {Math.round(calc.tax).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">
                Agent Commission ({agentComm}%)
              </span>
              <span className="text-white/90">
                PKR {Math.round(calc.agent).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Other Charges</span>
              <span className="text-white/90">
                PKR {calc.other.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-bold text-white">
                  Total Estimated Cost
                </p>
                <p className="text-xs text-white/50">All inclusive</p>
              </div>
              <p className="text-xl font-bold text-[#7BC96F]">
                PKR {Math.round(calc.total).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#3B6D11]/40 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-4 w-4 text-[#7BC96F]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Make Smart Decisions
              </p>
              <p className="text-xs text-white/50 mt-0.5">
                Our calculator gives you accurate estimates to help you plan
                your property investment wisely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { icon: Building2, label: "Loan Amount", value: "17,500,000 PKR" },
    { icon: Calculator, label: "Monthly Installment", value: "120,123 PKR" },
    { icon: Calendar, label: "Loan Tenure", value: "20 Years" },
    { icon: Percent, label: "Interest Rate", value: "7.5%" },
    { icon: DollarSign, label: "Total Cost", value: "26,500,000 PKR" },
  ];
  return (
    <div className="bg-white border border-[#E2EAD8] rounded-2xl grid grid-cols-2 md:grid-cols-5 divide-x divide-[#E2EAD8]">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="flex items-center gap-3 px-4 py-4">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
              <Icon className="h-4 w-4 text-[#3B6D11]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1C1C1C]">{s.value}</p>
              <p className="text-xs text-[#9CA3AF]">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const CALCULATORS = [
  {
    id: "loan",
    label: "Loan Calculator",
    icon: Calculator,
    desc: "Calculate monthly installments and total loan cost",
  },
  {
    id: "affordability",
    label: "Affordability Calculator",
    icon: Wallet,
    desc: "Find out how much property you can afford based on your income",
  },
  {
    id: "roi",
    label: "ROI Calculator",
    icon: TrendingUp,
    desc: "Calculate return on investment for your property",
  },
  {
    id: "stamp",
    label: "Stamp Duty Calculator",
    icon: FileText,
    desc: "Calculate stamp duty and registration charges for property",
  },
  {
    id: "rental",
    label: "Rental Yield Calculator",
    icon: BarChart3,
    desc: "Calculate rental income and potential yield on property",
  },
] as const;

type CalcId = (typeof CALCULATORS)[number]["id"];

const TRUST_BADGES = [
  {
    icon: Star,
    label: "100% Accurate Calculations",
    sub: "Based on latest market data",
  },
  {
    icon: Lightbulb,
    label: "Expert Verified Formulas",
    sub: "Trusted by real estate professionals",
  },
  {
    icon: TrendingUp,
    label: "Save Time & Money",
    sub: "Make better investment decisions",
  },
  {
    icon: BadgePercent,
    label: "Free to Use",
    sub: "All calculators are completely free",
  },
];

export default function CalculatorPage() {
  const [active, setActive] = useState<CalcId | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <div className="relative bg-white border-b border-[#E2EAD8] overflow-hidden">
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 16px 50px",
          }}
        >
          <div
            className="grid grid-cols-1 lg:grid-cols-2 items-center"
            style={{ gap: "32px" }}
          >
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B6D11] bg-[#EAF3DE] px-3 py-1.5 rounded-full mb-4">
                <Star className="h-3 w-3" /> Smart Property Planning
              </span>
              <h1
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  color: "#0a0a0a",
                  margin: "0 0 16px",
                }}
              >
                Real Estate
                <br />
                <span style={{ color: "#3b6d11" }}>Calculator</span>
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  color: "#6b7280",
                  lineHeight: 1.6,
                  margin: "0 0 24px",
                  fontWeight: 400,
                  maxWidth: "460px",
                }}
              >
                Use our advanced real estate calculators to make smart decisions
                and plan your property investment better.
              </p>
            </div>
            <div className="hidden lg:flex justify-end">
              <div
                style={{ position: "relative", width: "100%", height: "380px" }}
              >
                <Image
                  src="/calculator/herosection.png"
                  alt="Real Estate Calculator"
                  fill
                  className="object-contain object-center"
                  priority
                  sizes="50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* ── PROPERTY PRICE CALCULATOR ── */}
        <PropertyPriceCalculator />

        {/* ── STATS BAR ── */}
        <StatsBar />

        {/* ── POPULAR CALCULATORS ── */}
        <div>
          <h2 className="text-xl font-bold text-[#1C1C1C] mb-1">
            Popular Calculators
          </h2>
          <p className="text-sm text-[#6B7280] mb-5">
            Choose from our range of calculators to plan your real estate
            investment.
          </p>

          <div className="relative flex items-stretch gap-3">
            {/* Left arrow */}
            <button className="flex-shrink-0 w-8 h-8 self-center rounded-full border border-[#E2EAD8] bg-white hover:bg-[#F8FAF6] flex items-center justify-center shadow-sm transition-colors">
              <ChevronRight className="h-4 w-4 text-[#374151] rotate-180" />
            </button>

            {/* Cards grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {CALCULATORS.map((c) => {
                const Icon = c.icon;
                const isActive = active === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive(isActive ? null : c.id)}
                    className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${
                      isActive
                        ? "bg-[#EAF3DE] border-[#3B6D11]"
                        : "bg-white border-[#E2EAD8] hover:border-[#3B6D11]/50 hover:bg-[#F8FAF6]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EAF3DE] flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-[#3B6D11]" />
                    </div>
                    <p className="text-sm font-semibold text-[#1C1C1C] leading-snug mb-1">
                      {c.label}
                    </p>
                    <p className="text-xs text-[#9CA3AF] leading-snug mb-3 flex-1">
                      {c.desc}
                    </p>
                    <span className="text-xs font-semibold text-[#3B6D11] flex items-center gap-0.5">
                      Calculate <ChevronRight className="h-3 w-3" />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right arrow */}
            <button className="flex-shrink-0 w-8 h-8 self-center rounded-full border border-[#E2EAD8] bg-white hover:bg-[#F8FAF6] flex items-center justify-center shadow-sm transition-colors">
              <ChevronRight className="h-4 w-4 text-[#374151]" />
            </button>
          </div>
        </div>

        {/* ── ACTIVE CALCULATOR PANEL ── */}
        {active && (
          <div className="bg-white border border-[#E2EAD8] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2EAD8] bg-[#F8FAF6]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF3DE] flex items-center justify-center">
                  {(() => {
                    const Icon = CALCULATORS.find((c) => c.id === active)!.icon;
                    return <Icon className="h-4 w-4 text-[#3B6D11]" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1C1C1C]">
                    {CALCULATORS.find((c) => c.id === active)!.label}
                  </h3>
                  <p className="text-xs text-[#9CA3AF]">
                    {CALCULATORS.find((c) => c.id === active)!.desc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActive(null)}
                className="text-xs text-[#9CA3AF] hover:text-[#374151] transition-colors px-3 py-1 border border-[#E2EAD8] rounded-lg"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-6">
              {active === "loan" && <LoanCalculator />}
              {active === "affordability" && <AffordabilityCalculator />}
              {active === "roi" && <ROICalculator />}
              {active === "stamp" && <StampDutyCalculator />}
              {active === "rental" && <RentalYieldCalculator />}
            </div>
          </div>
        )}

        {/* ── NEED HELP ── */}
        <div className="rounded-2xl overflow-hidden bg-white border border-[#E2EAD8]">
          <div className="flex flex-col md:flex-row items-center gap-6 p-8">
            <div className="flex-shrink-0 w-28 h-28">
              <Image
                src="/calculator/needhelp.png"
                alt="Need Help"
                width={112}
                height={112}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-[#1C1C1C] mb-1">
                Need Help with Calculations?
              </h3>
              <p className="text-sm text-[#6B7280]">
                Our experts are here to help you with accurate calculations and
                smart investment advice.
              </p>
            </div>
            <button className="flex-shrink-0 flex items-center gap-2 border-2 border-[#3B6D11] text-[#3B6D11] hover:bg-[#3B6D11] hover:text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all">
              <Calculator className="h-4 w-4" /> Talk to an Expert
            </button>
          </div>
        </div>

        {/* ── TRUST BADGES ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6">
          {TRUST_BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EAF3DE] flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-[#3B6D11]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1C1C] leading-snug">
                    {b.label}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">{b.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
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
