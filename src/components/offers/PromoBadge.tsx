import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PromoBadgeProps = {
  children: ReactNode;
  tone?: "red" | "slate" | "yellow" | "green" | "blue" | "orange";
  className?: string;
};

const toneClasses = {
  red: "border-red-200 bg-red-50 text-[#B91C1C]",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  yellow: "border-yellow-200 bg-yellow-50 text-yellow-800",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
};

export function PromoBadge({
  children,
  tone = "slate",
  className,
}: PromoBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-3 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
