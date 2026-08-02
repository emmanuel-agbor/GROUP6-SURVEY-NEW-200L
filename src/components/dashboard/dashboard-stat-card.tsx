import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  /** Optional short trend string, e.g. "+2 this week". Rendered with an upward arrow. */
  trend?: string;
  className?: string;
}

/**
 * Metric card for the dashboard overview. Mirrors the shared `StatCard`
 * used on the Analytics page, with an added trend indicator so it stays
 * local to the dashboard rather than changing shared UI used elsewhere.
 */
export function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  className,
}: DashboardStatCardProps) {
  return (
    <Card className={cn("transition-shadow hover:shadow-[var(--shadow-soft)]", className)}>
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pb-2">
        <CardTitle className="truncate text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="font-display text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {trend ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
              <TrendingUp className="size-3" aria-hidden="true" />
              {trend}
            </span>
          ) : null}
        </div>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
