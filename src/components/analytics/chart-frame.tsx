import type { ReactNode } from "react";

interface ChartFrameProps {
  /** Screen-reader description of what the chart shows. */
  label: string;
  /** Accessible table fallback rendered for assistive tech. */
  table: ReactNode;
  height?: string;
  children: ReactNode;
}

/**
 * Wraps a canvas chart so keyboard and screen-reader users get an equivalent
 * data table, while pointer users get chart.js hover tooltips.
 */
export function ChartFrame({ label, table, height = "h-64", children }: ChartFrameProps) {
  return (
    <figure className="space-y-2">
      <div className={height} role="img" aria-label={label} tabIndex={0}>
        {children}
      </div>
      <figcaption className="sr-only">{label}</figcaption>
      <div className="sr-only">{table}</div>
    </figure>
  );
}