import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, CheckCircle2, Inbox, TrendingUp } from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { ChartFrame } from "@/components/analytics/chart-frame";
import { EmptyState } from "@/components/shared/empty-state";
import { ChartSkeleton, StatCardSkeleton } from "@/components/shared/loading";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  fetchAnalyticsSnapshot,
  type AnalyticsRange,
  type AnalyticsSnapshot,
} from "@/lib/analytics-placeholder";

const ResponseTrendChart = lazy(() =>
  import("@/components/analytics/charts").then((m) => ({ default: m.ResponseTrendChart })),
);
const CompletionRateChart = lazy(() =>
  import("@/components/analytics/charts").then((m) => ({ default: m.CompletionRateChart })),
);
const TopSurveysChart = lazy(() =>
  import("@/components/analytics/charts").then((m) => ({ default: m.TopSurveysChart })),
);

const TITLE = "Analytics — SurveyFlow";
const DESCRIPTION =
  "Track response volume, completion rate, and per-question breakdowns across your SurveyFlow surveys.";

export const Route = createFileRoute("/_console/analytics")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const hydrated = useHydrated();
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [data, setData] = useState<AnalyticsSnapshot | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // TODO: Integrate Spring Boot endpoint for fetching aggregate analytics.
  useEffect(() => {
    let active = true;
    setStatus("loading");
    fetchAnalyticsSnapshot(range)
      .then((snapshot) => {
        if (!active) return;
        setData(snapshot);
        setStatus("loaded");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [range, reloadKey]);

  const loading = status === "loading" || !hydrated;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="How your surveys are performing over the selected period."
        actions={
          <Select value={range} onValueChange={(value) => setRange(value as AnalyticsRange)}>
            <SelectTrigger className="w-40" aria-label="Select time range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {status === "error" ? (
        <ErrorState
          title="Couldn't load analytics"
          description="The analytics service didn't reply. Try again in a moment."
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
            ) : (
              <>
                <StatCard
                  label="Responses collected"
                  value={String(data?.metrics.responsesCollected ?? 0)}
                  hint="All surveys"
                  icon={Inbox}
                />
                <StatCard
                  label="Active surveys"
                  value={String(data?.metrics.activeSurveys ?? 0)}
                  hint="Accepting responses"
                  icon={TrendingUp}
                />
                <StatCard
                  label="Completion rate"
                  value={`${data?.completionRate ?? 0}%`}
                  hint="Finished vs. started"
                  icon={CheckCircle2}
                />
                <StatCard
                  label="Avg. time to complete"
                  value={`${data?.avgMinutesToComplete ?? 0} min`}
                  hint="Across submissions"
                  icon={BarChart3}
                />
              </>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Response trends</CardTitle>
                <CardDescription>
                  Surveys started vs. completed for the selected period. Hover a point for exact
                  counts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ChartSkeleton />
                ) : data && data.trend.length > 0 ? (
                  <Suspense fallback={<ChartSkeleton />}>
                    <ChartFrame
                      label="Line chart of surveys started and completed per day"
                      table={
                        <table>
                          <caption>Responses started and completed per day</caption>
                          <thead>
                            <tr>
                              <th scope="col">Date</th>
                              <th scope="col">Started</th>
                              <th scope="col">Completed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.trend.map((point) => (
                              <tr key={point.label}>
                                <th scope="row">{point.label}</th>
                                <td>{point.started}</td>
                                <td>{point.completed}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      }
                    >
                      <ResponseTrendChart data={data.trend} />
                    </ChartFrame>
                  </Suspense>
                ) : (
                  <EmptyState
                    icon={BarChart3}
                    title="No data to chart yet"
                    description="This chart fills in once responses start arriving."
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion rate</CardTitle>
                <CardDescription>Share of started surveys that were finished.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <ChartSkeleton />
                ) : data ? (
                  <Suspense fallback={<ChartSkeleton />}>
                    <ChartFrame
                      label={`Doughnut chart: ${data.completionRate}% of surveys completed`}
                      table={
                        <p>{`${data.completionRate}% completed, ${100 - data.completionRate}% abandoned.`}</p>
                      }
                    >
                      <CompletionRateChart rate={data.completionRate} />
                    </ChartFrame>
                  </Suspense>
                ) : (
                  <EmptyState
                    icon={CheckCircle2}
                    title="No completion data yet"
                    description="Completion rate appears after the first submission."
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top surveys</CardTitle>
              <CardDescription>Ranked by responses collected.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ChartSkeleton />
              ) : data && data.topSurveys.length > 0 ? (
                <Suspense fallback={<ChartSkeleton />}>
                  <ChartFrame
                    label="Horizontal bar chart of surveys ranked by responses collected"
                    table={
                      <table>
                        <caption>Surveys ranked by responses collected</caption>
                        <thead>
                          <tr>
                            <th scope="col">Survey</th>
                            <th scope="col">Responses</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.topSurveys.map((item) => (
                            <tr key={item.title}>
                              <th scope="row">{item.title}</th>
                              <td>{item.responses}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    }
                  >
                    <TopSurveysChart data={data.topSurveys} />
                  </ChartFrame>
                </Suspense>
              ) : (
                <EmptyState
                  icon={TrendingUp}
                  title="No survey ranking yet"
                  description="Publish a survey and collect responses to see rankings here."
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
