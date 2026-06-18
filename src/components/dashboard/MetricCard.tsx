import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export function MetricCard({ title, value, description, icon: Icon }: Props) {
  return (
    <Card className="rounded-lg border-white/10 bg-[#172033] text-white shadow-[0_16px_34px_rgba(0,0,0,0.20)]">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC] ring-1 ring-[#DA291C]/20">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-300">{title}</p>
          <p className="truncate text-2xl font-bold tracking-tight text-white">
            {value}
          </p>
          <p className="truncate text-xs text-slate-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
