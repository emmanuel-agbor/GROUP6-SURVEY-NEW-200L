import { Archive, MessageSquare, Rocket, Save, type LucideIcon } from "lucide-react";
import {
  formatRelativeTime,
  type ActivityEntry,
  type ActivityKind,
} from "@/lib/dashboard-placeholder";

const KIND_ICON: Record<ActivityKind, LucideIcon> = {
  response: MessageSquare,
  published: Rocket,
  closed: Archive,
  draft_saved: Save,
};

const KIND_TONE: Record<ActivityKind, string> = {
  response: "bg-accent text-accent-foreground",
  published: "bg-success/15 text-success",
  closed: "bg-secondary text-secondary-foreground",
  draft_saved: "bg-muted text-muted-foreground",
};

interface ActivityTimelineProps {
  items: ActivityEntry[];
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  return (
    <ol>
      {items.map((item, index) => {
        const Icon = KIND_ICON[item.kind];
        const isLast = index === items.length - 1;

        return (
          <li key={item.id} className={isLast ? undefined : "border-b border-border/70"}>
            <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full ${KIND_TONE[item.kind]}`}
              >
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm leading-snug text-foreground">{item.message}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatRelativeTime(item.occurredAt)}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
