import { Badge } from "@/components/ui/badge";
import type { SurveyStatus } from "@/types/survey";

const STATUS_STYLES: Record<SurveyStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "border-border bg-muted text-muted-foreground",
  },
  active: {
    label: "Active",
    className: "border-success/30 bg-success/12 text-success",
  },
  closed: {
    label: "Closed",
    className: "border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning",
  },
  archived: {
    label: "Archived",
    className: "border-border bg-secondary text-secondary-foreground",
  },
};

export function StatusBadge({ status }: { status: SurveyStatus }) {
  const { label, className } = STATUS_STYLES[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}