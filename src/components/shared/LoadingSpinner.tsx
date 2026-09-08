"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export function BrandLoader({
  size = "md",
  className,
  color = "#3B6D11",
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: { container: "w-8 h-8", icon: 16, ring: "border-2" },
    md: { container: "w-14 h-14", icon: 28, ring: "border-[2.5px]" },
    lg: { container: "w-20 h-20", icon: 40, ring: "border-[3px]" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn("relative flex items-center justify-center", currentSize.container)}>
        {/* Outer Rotating Track */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-t-transparent animate-spin",
            currentSize.ring
          )}
          style={{
            borderColor: `${color} transparent ${color} transparent`,
          }}
        />

        {/* Outer Subtle Pulse Glow */}
        <div
          className="absolute inset-0 rounded-full opacity-15 animate-ping"
          style={{ backgroundColor: color }}
        />

        {/* Center Logo Icon */}
        <div className="relative z-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-xs p-1 shadow-xs">
          <Image
            src="/icon.png"
            alt="GharFind"
            width={currentSize.icon}
            height={currentSize.icon}
            className="object-contain animate-pulse"
            style={{ width: currentSize.icon, height: currentSize.icon }}
          />
        </div>
      </div>

      {text && (
        <p className="text-xs font-semibold text-[#6B7280] tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAF6] flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
}

export default function LoadingSpinner(props: LoadingSpinnerProps) {
  return <BrandLoader {...props} />;
}
