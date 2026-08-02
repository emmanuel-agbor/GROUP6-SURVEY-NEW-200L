import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronRight,
  FilePlus2,
  Inbox,
  LayoutTemplate,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickAction {
  title: string;
  description: string;
  href: "/surveys/new" | "/responses" | "/analytics";
  icon: LucideIcon;
}

// TODO: point "Browse templates" at a dedicated template-gallery route once
// one exists; it opens the survey builder in the meantime.
const ACTIONS: QuickAction[] = [
  {
    title: "Create new survey",
    description: "Start from a blank canvas",
    href: "/surveys/new",
    icon: FilePlus2,
  },
  {
    title: "View responses",
    description: "See what's coming in",
    href: "/responses",
    icon: Inbox,
  },
  {
    title: "View analytics",
    description: "Track trends and completion",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Browse templates",
    description: "Launch faster with a template",
    href: "/surveys/new",
    icon: LayoutTemplate,
  },
];

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump straight to the thing you came here for.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        {ACTIONS.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="group flex items-center gap-3 rounded-lg border border-transparent px-2.5 py-2.5 transition-all hover:border-border hover:bg-accent/50 hover:shadow-[var(--shadow-soft)]"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <action.icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">
                {action.title}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {action.description}
              </span>
            </span>
            <ChevronRight
              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
              aria-hidden="true"
            />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
