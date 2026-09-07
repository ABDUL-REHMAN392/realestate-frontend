import { cn } from "@/lib/utils";

interface BadgeProps {
  children:  React.ReactNode;
  variant?:  "green" | "blue" | "amber" | "red" | "gray";
  className?: string;
}

const variants = {
  green: "bg-[#EAF3DE] text-[#3B6D11]",
  blue:  "bg-blue-50  text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  red:   "bg-red-50   text-red-700",
  gray:  "bg-gray-100 text-gray-600",
};

export function Badge({ children, variant = "green", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}