import type { DashboardMetrics } from "@/types/survey";

/**
 * Deterministic sample analytics used to render the charts until the
 * Spring Boot analytics endpoints are wired up.
 * TODO: Replace every export here with real API data.
 */
export type AnalyticsRange = "7d" | "30d" | "90d";

export interface AnalyticsSnapshot {
  metrics: DashboardMetrics;
  completionRate: number;
  avgMinutesToComplete: number;
  trend: { label: string; started: number; completed: number }[];
  topSurveys: { title: string; responses: number }[];
}

const RANGE_DAYS: Record<AnalyticsRange, number> = { "7d": 7, "30d": 30, "90d": 90 };

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Simulates a network round-trip so loading states are exercised. */
export function fetchAnalyticsSnapshot(range: AnalyticsRange): Promise<AnalyticsSnapshot> {
  // TODO: Integrate Spring Boot endpoint GET /api/analytics?range={range}
  return new Promise((resolve) => {
    setTimeout(() => resolve(buildSnapshot(range)), 600);
  });
}

function buildSnapshot(range: AnalyticsRange): AnalyticsSnapshot {
  const days = RANGE_DAYS[range];
  const step = days > 30 ? 3 : 1;
  const trend: AnalyticsSnapshot["trend"] = [];
  const now = Date.now();

  for (let index = days - 1; index >= 0; index -= step) {
    const date = new Date(now - index * 86_400_000);
    const started = 12 + Math.round(pseudoRandom(index + days) * 28);
    const completed = Math.max(4, Math.round(started * (0.6 + pseudoRandom(index) * 0.3)));
    trend.push({
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      started,
      completed,
    });
  }

  const started = trend.reduce((total, point) => total + point.started, 0);
  const completed = trend.reduce((total, point) => total + point.completed, 0);

  return {
    metrics: {
      totalSurveys: 18,
      activeSurveys: 6,
      responsesCollected: completed,
      draftSurveys: 4,
    },
    completionRate: started === 0 ? 0 : Math.round((completed / started) * 100),
    avgMinutesToComplete: 3 + Math.round(pseudoRandom(days) * 4),
    trend,
    topSurveys: [
      { title: "Customer onboarding feedback", responses: Math.round(completed * 0.34) },
      { title: "Q3 product satisfaction", responses: Math.round(completed * 0.26) },
      { title: "Website usability check", responses: Math.round(completed * 0.19) },
      { title: "Support follow-up", responses: Math.round(completed * 0.12) },
      { title: "Feature request poll", responses: Math.round(completed * 0.09) },
    ],
  };
}