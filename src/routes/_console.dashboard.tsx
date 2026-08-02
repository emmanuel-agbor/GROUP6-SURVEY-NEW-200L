import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ClipboardList, FilePlus2, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { NeedsAttentionCard } from "@/components/dashboard/needs-attention-card";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCardSkeleton, TableSkeleton } from "@/components/shared/loading";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  fetchDashboardOverview,
  formatRelativeTime,
  type DashboardOverview,
} from "@/lib/dashboard-placeholder";

const TITLE = "Dashboard — SurveyFlow";
const DESCRIPTION =
  "Track total surveys, active surveys, collected responses, and drafts from one SurveyFlow overview.";

export const Route = createFileRoute("/_console/dashboard")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const hydrated = useHydrated();
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // TODO: Integrate Spring Boot endpoint for fetching the dashboard overview
  // (metrics, needs-attention items, recent surveys, and recent activity).
  useEffect(() => {
    let active = true;
    setStatus("loading");
    fetchDashboardOverview()
      .then((overview) => {
        if (!active) return;
        setData(overview);
        setStatus("loaded");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const loading = status === "loading" || !hydrated || !data;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A snapshot of your surveys and the responses coming in."
        actions={
          <Button asChild>
            <Link to="/surveys/new">
              <FilePlus2 className="size-4" aria-hidden="true" />
              New survey
            </Link>
          </Button>
        }
      />

      {status === "error" ? (
        <ErrorState
          title="Couldn't load your dashboard"
          description="The workspace overview didn't load. Try again in a moment."
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      ) : (
        <>
          <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
            ) : (
              <>
                <DashboardStatCard
                  label="Total surveys"
                  value={String(data.totalSurveys)}
                  hint="All surveys in this workspace"
                  icon={ClipboardList}
                  trend={data.totalSurveysTrend}
                />
                <DashboardStatCard
                  label="Active surveys"
                  value={String(data.activeSurveys)}
                  hint="Currently accepting responses"
                  icon={Activity}
                />
                <DashboardStatCard
                  label="Total responses"
                  value={data.totalResponses.toLocaleString()}
                  hint="Across every survey"
                  icon={MessageSquare}
                />
                <NeedsAttentionCard items={data.needsAttention} />
              </>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Recent surveys</CardTitle>
                <CardDescription>The surveys your team touched most recently.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <TableSkeleton rows={5} columns={4} />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Survey</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Responses</TableHead>
                          <TableHead>Last updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.recentSurveys.map((survey) => (
                          <TableRow key={survey.id}>
                            <TableCell className="max-w-56 truncate font-medium">
                              <Link
                                to="/surveys/$surveyId"
                                params={{ surveyId: survey.id }}
                                className="hover:underline"
                              >
                                {survey.title}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={survey.status} />
                            </TableCell>
                            <TableCell className="text-right">{survey.responses}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatRelativeTime(survey.updatedAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <QuickActionsCard />

              <Card>
                <CardHeader>
                  <CardTitle>Recent activity</CardTitle>
                  <CardDescription>Changes made across the workspace.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3" aria-hidden="true">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Skeleton className="size-8 shrink-0 rounded-full" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-4/5" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ActivityTimeline items={data.activity} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  );
}
