import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  FilePlus2,
  FileText,
  Inbox,
  ListChecks,
  PencilRuler,
  PlayCircle,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatCardSkeleton, TableSkeleton } from "@/components/shared/loading";
import { pendingCollection, pendingResource } from "@/lib/api-placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem, DashboardMetrics, Survey } from "@/types/survey";

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
  // TODO: Integrate Spring Boot endpoint for fetching dashboard metrics.
  const metrics = pendingResource<DashboardMetrics>();
  // TODO: Integrate Spring Boot endpoint for fetching recent surveys.
  const recentSurveys = pendingCollection<Survey>();
  // TODO: Integrate Spring Boot endpoint for fetching recent workspace activity.
  const activity = pendingCollection<ActivityItem>();

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

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics ? (
          <>
            <StatCard
              label="Total surveys"
              value={String(metrics.totalSurveys)}
              hint="All surveys in this workspace"
              icon={ListChecks}
            />
            <StatCard
              label="Active surveys"
              value={String(metrics.activeSurveys)}
              hint="Currently accepting responses"
              icon={PlayCircle}
            />
            <StatCard
              label="Responses collected"
              value={String(metrics.responsesCollected)}
              hint="Across every survey"
              icon={Inbox}
            />
            <StatCard
              label="Draft surveys"
              value={String(metrics.draftSurveys)}
              hint="Not published yet"
              icon={PencilRuler}
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent surveys</CardTitle>
            <CardDescription>The surveys your team touched most recently.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSurveys.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No surveys yet"
                description="Create your first survey and it will show up here with its status and response count."
                action={
                  <Button asChild>
                    <Link to="/surveys/new">Create a survey</Link>
                  </Button>
                }
              />
            ) : (
              <TableSkeleton rows={4} columns={4} />
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Jump straight to the thing you came here for.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/surveys/new">
                  <FilePlus2 className="size-4" aria-hidden="true" />
                  Build a new survey
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/responses">
                  <Inbox className="size-4" aria-hidden="true" />
                  Review responses
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/surveys">
                  <ListChecks className="size-4" aria-hidden="true" />
                  Manage all surveys
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Changes made across the workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              {activity.length === 0 ? (
                <EmptyState
                  icon={Activity}
                  title="Nothing has happened yet"
                  description="Publishing a survey or receiving a response will appear in this feed."
                />
              ) : (
                <TableSkeleton rows={3} columns={1} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}