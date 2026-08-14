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
          "border-amber-300/40 bg-amber-100 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100",
        tone === "success" &&
          "border-emerald-300/40 bg-emerald-100 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100",
        tone === "neutral" && "border-border bg-muted text-foreground"
      )}
    >
      <div className="flex gap-3">
        <Icon
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            tone === "warning" && "text-yellow-700",
            tone === "success" && "text-emerald-700",
            tone === "neutral" && "text-primary"
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
