import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Brand({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label="SurveyFlow home"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true" fill="none">
          <path
            d="M3 13.5c3-6 5-6 7 0s4 5 7-2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="font-display text-base font-semibold tracking-tight text-foreground">
        SurveyFlow
      </span>
    </Link>
  );
}