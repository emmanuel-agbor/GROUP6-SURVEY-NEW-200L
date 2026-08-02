import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-[var(--shadow-soft)]">
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pb-2">
        <CardTitle className="truncate text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="font-display text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}