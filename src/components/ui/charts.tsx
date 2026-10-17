"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, CheckCircle, Clock, Circle } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// 1. SPARKLINE COMPONENT (Mini inline area/line graph for KPI cards)
// ─────────────────────────────────────────────────────────────────────────────
export interface SparklineProps {
  data: number[];
  color?: string;
  fillColor?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  data,
  color = "#3B6D11",
  fillColor = "rgba(59, 109, 17, 0.12)",
  width = 120,
  height = 36,
  className,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const linePath = points.reduce((acc, curr, i) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = points[i - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, "");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className={cn("inline-block shrink-0 overflow-hidden", className)}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id={`spark-grad-${color.replace(/[^a-zA-Z0-9]/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#spark-grad-${color.replace(/[^a-zA-Z0-9]/g, "")})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. INDUSTRIAL METRIC CARD (Linear / Stripe style with Sparkline & Trend Delta)
// ─────────────────────────────────────────────────────────────────────────────
export interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  sparklineData?: number[];
  sparklineColor?: string;
  icon?: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  className?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  sparklineData,
  sparklineColor = "#3B6D11",
  icon: Icon,
  iconColor = "text-[#3B6D11]",
  iconBg = "bg-[#EAF3DE]",
  className,
  onClick,
}: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border border-[#E2EAD8] bg-white p-5 shadow-xs transition-all duration-200 hover:border-[#C0DD97] hover:shadow-md",
        onClick && "cursor-pointer group",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-[#6B7280] tracking-wide uppercase">{title}</span>
        {Icon && (
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
            <Icon className={cn("h-4.5 w-4.5", iconColor)} />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C1C1C] leading-none">
            {value}
          </div>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold">
              <span
                className={cn(
                  "inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold",
                  trend.isPositive ? "bg-[#EAF3DE] text-[#3B6D11]" : "bg-rose-50 text-rose-700"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                )}
                {trend.value}
              </span>
              <span className="text-[#9CA3AF] font-normal text-[11px]">{trend.label || "vs last month"}</span>
            </div>
          )}
          {subtitle && !trend && <p className="text-xs text-[#9CA3AF] mt-1">{subtitle}</p>}
        </div>

        {sparklineData && sparklineData.length > 1 && (
          <Sparkline data={sparklineData} color={sparklineColor} width={100} height={34} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. INTERACTIVE AREA / LINE CHART (High-resolution SVG with Hover Tooltip)
// ─────────────────────────────────────────────────────────────────────────────
export interface AreaChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  formattedValue?: string;
  date?: string;
}

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryColor?: string;
  secondaryColor?: string;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  className?: string;
}

export function AreaChart({
  data,
  primaryLabel = "Primary",
  secondaryLabel,
  primaryColor = "#3B6D11",
  secondaryColor = "#2563EB",
  height = 260,
  valuePrefix = "",
  valueSuffix = "",
  className,
}: AreaChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center text-slate-400 text-xs">
        No chart data available
      </div>
    );
  }

  const allValues = [
    ...data.map((d) => d.value),
    ...(secondaryLabel ? data.map((d) => d.secondaryValue || 0) : []),
  ];
  const min = 0;
  const max = Math.max(...allValues) * 1.15 || 100;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const width = 700; // SVG coordinate width

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getPoints = (valKey: "value" | "secondaryValue") =>
    data.map((d, i) => {
      const val = d[valKey] || 0;
      const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - (val / max) * chartHeight;
      return { x, y, data: d };
    });

  const primaryPoints = getPoints("value");
  const secondaryPoints = secondaryLabel ? getPoints("secondaryValue") : [];

  const buildPath = (points: { x: number; y: number }[]) =>
    points.reduce((acc, curr, i) => {
      if (i === 0) return `M ${curr.x} ${curr.y}`;
      const prev = points[i - 1];
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }, "");

  const primaryLine = buildPath(primaryPoints);
  const primaryArea = `${primaryLine} L ${primaryPoints[primaryPoints.length - 1].x} ${paddingTop + chartHeight} L ${primaryPoints[0].x} ${paddingTop + chartHeight} Z`;

  const secondaryLine = secondaryPoints.length ? buildPath(secondaryPoints) : "";

  // Grid lines
  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const val = Math.round(min + (i / gridCount) * max);
    const y = paddingTop + chartHeight - (i / gridCount) * chartHeight;
    return { val, y };
  });

  const activePoint = hoverIndex !== null ? primaryPoints[hoverIndex] : null;

  return (
    <div className={cn("relative w-full select-none", className)}>
      {/* Legend & Hover Display */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: primaryColor }} />
            <span className="text-slate-700">{primaryLabel}</span>
          </div>
          {secondaryLabel && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: secondaryColor }} />
              <span className="text-slate-700">{secondaryLabel}</span>
            </div>
          )}
        </div>

        {activePoint && (
          <div className="text-xs bg-slate-900 text-white font-mono px-2.5 py-1 rounded-lg shadow-md animate-in fade-in-50 duration-150">
            <span className="font-bold text-slate-300 mr-2">{activePoint.data.label}:</span>
            <span className="font-bold text-emerald-400">
              {valuePrefix}
              {activePoint.data.formattedValue || activePoint.data.value.toLocaleString()}
              {valueSuffix}
            </span>
            {secondaryLabel && activePoint.data.secondaryValue !== undefined && (
              <span className="ml-2 text-blue-300">
                ({valuePrefix}
                {activePoint.data.secondaryValue.toLocaleString()}
                {valueSuffix})
              </span>
            )}
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.28" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((g, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={g.y}
                x2={width - paddingRight}
                y2={g.y}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={g.y + 3}
                textAnchor="end"
                className="fill-slate-400 text-[10px] font-mono"
              >
                {g.val >= 1000 ? `${(g.val / 1000).toFixed(0)}k` : g.val}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <path d={primaryArea} fill="url(#primaryAreaGrad)" />

          {/* Secondary Line (if available) */}
          {secondaryLine && (
            <path
              d={secondaryLine}
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2.5"
              strokeDasharray="4 2"
              strokeLinecap="round"
            />
          )}

          {/* Primary Line */}
          <path
            d={primaryLine}
            fill="none"
            stroke={primaryColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X Axis Labels */}
          {data.map((d, i) => {
            const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
            return (
              <text
                key={i}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  hoverIndex === i ? "fill-slate-900 font-bold" : "fill-slate-400"
                )}
              >
                {d.label}
              </text>
            );
          })}

          {/* Hover Overlay Columns for interaction */}
          {primaryPoints.map((pt, i) => {
            const colWidth = chartWidth / data.length;
            return (
              <g key={i}>
                <rect
                  x={pt.x - colWidth / 2}
                  y={paddingTop}
                  width={colWidth}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoverIndex(i)}
                />
                {hoverIndex === i && (
                  <>
                    <line
                      x1={pt.x}
                      y1={paddingTop}
                      x2={pt.x}
                      y2={paddingTop + chartHeight}
                      stroke={primaryColor}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke={primaryColor} strokeWidth="3" />
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ROUNDED BAR CHART (Volume & Comparison metrics)
// ─────────────────────────────────────────────────────────────────────────────
export interface BarChartDataPoint {
  label: string;
  value: number;
  target?: number;
  formattedValue?: string;
}

export interface BarChartProps {
  data: BarChartDataPoint[];
  barColor?: string;
  targetColor?: string;
  height?: number;
  valuePrefix?: string;
  className?: string;
}

export function BarChart({
  data,
  barColor = "#3B6D11",
  targetColor = "#E2E8F0",
  height = 200,
  valuePrefix = "",
  className,
}: BarChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => Math.max(d.value, d.target || 0))) * 1.15 || 100;

  return (
    <div className={cn("w-full select-none", className)}>
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((item, i) => {
          const heightPercent = Math.min((item.value / maxVal) * 100, 100);
          const isHovered = hoverIdx === i;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            >
              {/* Tooltip on hover */}
              <div
                className={cn(
                  "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white mb-1.5 transition-all duration-150 shadow-sm",
                  isHovered ? "opacity-100 -translate-y-0.5" : "opacity-0"
                )}
              >
                {valuePrefix}
                {item.formattedValue || item.value.toLocaleString()}
              </div>

              {/* Bar track and fill */}
              <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                <div
                  className="w-full rounded-t-xl transition-all duration-500 ease-out"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: isHovered ? "#1E3A0F" : barColor,
                  }}
                />
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[11px] font-semibold mt-2 truncate w-full text-center transition-colors",
                  isHovered ? "text-slate-900 font-bold" : "text-slate-400"
                )}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DONUT DISTRIBUTION CHART (Clean Ring Chart with Legend)
// ─────────────────────────────────────────────────────────────────────────────
export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
  className?: string;
}

export function DonutChart({
  data,
  size = 180,
  strokeWidth = 24,
  centerLabel,
  centerValue,
  className,
}: DonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-center gap-6", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {data.map((seg, i) => {
            const percent = seg.value / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            const isHovered = hoveredIdx === i;

            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {centerValue && (
            <span className="text-xl font-extrabold text-slate-900 leading-none">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
              {centerLabel}
            </span>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2 text-xs w-full max-w-[200px]">
        {data.map((seg, i) => {
          const percent = Math.round((seg.value / total) * 100);
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer",
                isHovered ? "bg-slate-100 font-bold" : "hover:bg-slate-50"
              )}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                <span className="text-[#1C1C1C] text-xs truncate">{seg.label}</span>
              </div>
              <span className="font-mono text-[#1C1C1C] font-bold text-xs shrink-0">{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. COUNT-UP ANIMATED NUMBER
// ─────────────────────────────────────────────────────────────────────────────
export interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function CountUp({
  end,
  duration = 1200,
  prefix = "",
  suffix = "",
  className,
  decimals = 0,
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4);
            setValue(eased * end);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value)}
      {suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PROGRESS RING (Circular Progress Indicator)
// ─────────────────────────────────────────────────────────────────────────────
export interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  size = 44,
  strokeWidth = 4,
  color = "#3B6D11",
  trackColor = "#E2EAD8",
  label,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {label && (
        <span className="absolute text-[9px] font-bold text-[#1C1C1C]">{label}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. STATUS TIMELINE (Vertical Timeline with status dots and labels)
// ─────────────────────────────────────────────────────────────────────────────
export interface TimelineStep {
  label: string;
  description?: string;
  status: "completed" | "active" | "pending";
  timestamp?: string;
}

export interface StatusTimelineProps {
  steps: TimelineStep[];
  color?: string;
  className?: string;
}

export function StatusTimeline({
  steps,
  color = "#3B6D11",
  className,
}: StatusTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const StatusIcon = step.status === "completed" ? CheckCircle : step.status === "active" ? Clock : Circle;

        return (
          <div key={i} className="flex gap-3">
            {/* Dot + connector */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
                  step.status === "completed"
                    ? "border-transparent"
                    : step.status === "active"
                    ? "border-transparent"
                    : "border-slate-200 bg-white"
                )}
                style={{
                  backgroundColor: step.status === "completed" ? color : step.status === "active" ? `${color}22` : undefined,
                }}
              >
                <StatusIcon
                  className={cn(
                    "h-3.5 w-3.5",
                    step.status === "completed"
                      ? "text-white"
                      : step.status === "active"
                      ? "text-[#3B6D11]"
                      : "text-slate-300"
                  )}
                  style={step.status === "active" ? { color } : undefined}
                />
              </div>
              {!isLast && (
                <div
                  className="w-0.5 flex-1 min-h-[24px]"
                  style={{
                    backgroundColor: step.status === "completed" ? color : "#E2E8F0",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-5", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-xs font-bold leading-tight",
                  step.status === "completed" ? "text-[#1C1C1C]" : step.status === "active" ? "text-[#1C1C1C]" : "text-[#9CA3AF]"
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-[11px] text-[#6B7280] mt-0.5 leading-relaxed">{step.description}</p>
              )}
              {step.timestamp && (
                <p className="text-[10px] text-[#9CA3AF] mt-0.5 font-mono">{step.timestamp}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. ACTIVITY HEATMAP (Weekly activity grid like GitHub)
// ─────────────────────────────────────────────────────────────────────────────
export interface ActivityHeatmapProps {
  /** 7×4 grid (28 cells) — row = day of week (Mon–Sun), col = week (W1–W4). Values 0-4 intensity. */
  data: number[][];
  color?: string;
  labels?: { days?: string[]; weeks?: string[] };
  className?: string;
}

export function ActivityHeatmap({
  data,
  color = "#3B6D11",
  labels = {},
  className,
}: ActivityHeatmapProps) {
  const dayLabels = labels.days || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekLabels = labels.weeks || ["W1", "W2", "W3", "W4"];

  const getOpacity = (val: number) => {
    if (val <= 0) return 0.06;
    if (val === 1) return 0.2;
    if (val === 2) return 0.4;
    if (val === 3) return 0.65;
    return 0.9;
  };

  return (
    <div className={cn("select-none", className)}>
      <div className="flex gap-1.5">
        {/* Day labels */}
        <div className="flex flex-col gap-1.5 pt-6">
          {dayLabels.map((d) => (
            <div key={d} className="h-5 flex items-center">
              <span className="text-[9px] font-semibold text-[#9CA3AF] w-7">{d}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-1.5">
          {weekLabels.map((week, wi) => (
            <div key={week} className="flex flex-col gap-1.5">
              <span className="text-[9px] font-semibold text-[#9CA3AF] text-center h-5 flex items-center justify-center">
                {week}
              </span>
              {(data[wi] || Array(7).fill(0)).map((val, di) => (
                <div
                  key={di}
                  className="w-5 h-5 rounded-[4px] transition-colors cursor-default"
                  style={{
                    backgroundColor: color,
                    opacity: getOpacity(val),
                  }}
                  title={`${dayLabels[di]}, ${week}: ${val} activities`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Intensity legend */}
      <div className="flex items-center gap-1.5 mt-3 ml-9">
        <span className="text-[9px] text-[#9CA3AF] font-semibold mr-1">Less</span>
        {[0, 1, 2, 3, 4].map((v) => (
          <div
            key={v}
            className="w-3.5 h-3.5 rounded-sm"
            style={{ backgroundColor: color, opacity: getOpacity(v) }}
          />
        ))}
        <span className="text-[9px] text-[#9CA3AF] font-semibold ml-1">More</span>
      </div>
    </div>
  );
}
