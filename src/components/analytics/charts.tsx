import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

function cssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function baseOptions(): ChartOptions<"line" | "bar" | "doughnut"> {
  const muted = cssVar("--muted-foreground", "#6b7280");
  const border = cssVar("--border", "#e5e7eb");
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { labels: { color: muted, usePointStyle: true, boxWidth: 8 } },
      tooltip: {
        backgroundColor: cssVar("--popover", "#111827"),
        titleColor: cssVar("--popover-foreground", "#f9fafb"),
        bodyColor: cssVar("--popover-foreground", "#f9fafb"),
        borderColor: border,
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      },
    },
    scales: {
      x: { ticks: { color: muted, maxRotation: 0, autoSkip: true }, grid: { display: false } },
      y: { ticks: { color: muted, precision: 0 }, grid: { color: border } },
    },
  } as ChartOptions<"line" | "bar" | "doughnut">;
}

export interface TrendPoint {
  label: string;
  started: number;
  completed: number;
}

export function ResponseTrendChart({ data }: { data: TrendPoint[] }) {
  const primary = cssVar("--primary", "#4f46e5");
  const success = cssVar("--success", "#16a34a");
  return (
    <Line
      options={baseOptions() as ChartOptions<"line">}
      data={{
        labels: data.map((point) => point.label),
        datasets: [
          {
            label: "Started",
            data: data.map((point) => point.started),
            borderColor: primary,
            backgroundColor: `color-mix(in oklab, ${primary} 18%, transparent)`,
            fill: true,
            tension: 0.35,
            pointRadius: 2,
            pointHoverRadius: 5,
          },
          {
            label: "Completed",
            data: data.map((point) => point.completed),
            borderColor: success,
            backgroundColor: "transparent",
            tension: 0.35,
            pointRadius: 2,
            pointHoverRadius: 5,
          },
        ],
      }}
    />
  );
}

export function CompletionRateChart({ rate }: { rate: number }) {
  const primary = cssVar("--primary", "#4f46e5");
  const border = cssVar("--border", "#e5e7eb");
  const options = baseOptions() as ChartOptions<"doughnut">;
  return (
    <Doughnut
      options={{ ...options, cutout: "70%", scales: {} }}
      data={{
        labels: ["Completed", "Abandoned"],
        datasets: [
          {
            data: [rate, Math.max(0, 100 - rate)],
            backgroundColor: [primary, border],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      }}
    />
  );
}

export function TopSurveysChart({ data }: { data: { title: string; responses: number }[] }) {
  const primary = cssVar("--primary", "#4f46e5");
  const options = baseOptions() as ChartOptions<"bar">;
  return (
    <Bar
      options={{
        ...options,
        indexAxis: "y",
        plugins: { ...options.plugins, legend: { display: false } },
      }}
      data={{
        labels: data.map((item) => item.title),
        datasets: [
          {
            label: "Responses",
            data: data.map((item) => item.responses),
            backgroundColor: primary,
            borderRadius: 4,
            maxBarThickness: 18,
          },
        ],
      }}
    />
  );
}
