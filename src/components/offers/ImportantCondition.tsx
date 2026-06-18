import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ImportantConditionProps = {
  tone?: "warning" | "success" | "neutral";
  title: string;
  children: ReactNode;
  compact?: boolean;
};

export function ImportantCondition({
  tone = "neutral",
  title,
  children,
  compact = false,
}: ImportantConditionProps) {
  const Icon = tone === "success" ? CheckCircle2 : AlertTriangle;

  return (
    <div
      className={cn(
        "rounded-xl border text-sm leading-6",
        compact ? "p-3" : "p-4",
        tone === "warning" &&
          "border-yellow-200 bg-[#FEF3C7] text-yellow-950",
        tone === "success" &&
          "border-emerald-200 bg-[#DCFCE7] text-emerald-950",
        tone === "neutral" && "border-slate-200 bg-slate-50 text-slate-700"
      )}
    >
      <div className="flex gap-3">
        <Icon
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            tone === "warning" && "text-yellow-700",
            tone === "success" && "text-emerald-700",
            tone === "neutral" && "text-[#DA291C]"
          )}
        />
        <div>
          <p className="font-semibold">{title}</p>
          <div className={cn("text-sm", compact ? "mt-0.5" : "mt-1")}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
