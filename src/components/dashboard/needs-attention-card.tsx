import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronRight,
  Clock,
  Eye,
  Inbox,
  PencilRuler,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { NeedsAttentionItem, NeedsAttentionKind } from "@/lib/dashboard-placeholder";

const KIND_ICON: Record<NeedsAttentionKind, LucideIcon> = {
  draft: PencilRuler,
  closing_soon: Clock,
  unread: Inbox,
  pending_review: Eye,
};

interface NeedsAttentionCardProps {
  items: NeedsAttentionItem[];
}

/**
 * Fourth "metric" slot in the top row. Deliberately styled differently from
 * the plain stat cards — tinted background and left accent — so it reads as
 * actionable rather than another number to skim past.
 */
export function NeedsAttentionCard({ items }: NeedsAttentionCardProps) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="border-primary/25 bg-accent/25 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-raised)]">
      <CardHeader className="pb-2">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <CardTitle className="truncate text-sm font-medium text-muted-foreground">
            Needs attention
          </CardTitle>
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
            <AlertCircle className="size-4" aria-hidden="true" />
          </span>
        </div>
        <CardDescription className="text-xs">
          {total > 0 ? `${total} things worth a quick look` : "You're all caught up"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-0.5 pt-0">
        {items.length === 0 ? (
          <p className="py-3 text-sm text-muted-foreground">Nothing pending right now.</p>
        ) : (
          items.map((item) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <Link
                key={item.id}
                to={item.href}
                className="group -mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-background/70"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Icon className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate text-xs text-foreground">{item.label}</span>
                </span>
                <span className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-foreground">
                  {item.count}
                  <ChevronRight
                    className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
