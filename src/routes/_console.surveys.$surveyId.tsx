import { Link, createFileRoute } from "@tanstack/react-router";
import { ExternalLink, FileText, Inbox, Pencil } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pendingResource } from "@/lib/api-placeholder";
import { QUESTION_TYPE_LABELS, type Survey } from "@/types/survey";

const TITLE = "Survey details — SurveyFlow";
const DESCRIPTION =
  "Review a survey's questions, sharing link, and response summary before or after it goes live.";

export const Route = createFileRoute("/_console/surveys/$surveyId")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: SurveyDetailsPage,
});

function SurveyDetailsPage() {
  const { surveyId } = Route.useParams();

  // TODO: Integrate Spring Boot endpoint for fetching a survey by id.
  const survey = pendingResource<Survey>();

  return (
    <>
      <PageHeader
        title={survey?.title ?? "Survey"}
        description={survey?.description ?? "Questions, sharing, and response summary."}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/responses">
                <Inbox className="size-4" aria-hidden="true" />
                Responses
              </Link>
            </Button>
            {/* TODO: Integrate Spring Boot endpoint for editing this survey. */}
            <Button>
              <Pencil className="size-4" aria-hidden="true" />
              Edit survey
            </Button>
          </>
        }
      >
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/surveys">Surveys</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{survey?.title ?? surveyId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {survey ? (
          <div className="mb-4">
            <StatusBadge status={survey.status} />
          </div>
        ) : null}
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Responses"
          value={survey ? String(survey.responseCount) : "—"}
          hint="Total submissions"
          icon={Inbox}
        />
        <StatCard
          label="Questions"
          value={survey?.questions ? String(survey.questions.length) : "—"}
          hint="In this survey"
          icon={FileText}
        />
        <StatCard
          label="Status"
          value={survey ? survey.status : "—"}
          hint="Visible to respondents when active"
          icon={ExternalLink}
        />
      </div>

      <Tabs defaultValue="questions">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-4">
          {survey?.questions?.length ? (
            <ol className="space-y-3">
              {survey.questions.map((question, index) => (
                <li key={question.id}>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {index + 1}. {question.title}
                      </CardTitle>
                      <CardDescription>
                        {QUESTION_TYPE_LABELS[question.type]}
                        {question.required ? " · Required" : ""}
                      </CardDescription>
                    </CardHeader>
                    {question.options?.length ? (
                      <CardContent>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                          {question.options.map((option) => (
                            <li key={option}>{option}</li>
                          ))}
                        </ul>
                      </CardContent>
                    ) : null}
                  </Card>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState
              icon={FileText}
              title="No questions loaded"
              description="Questions appear here once this survey is connected to the API."
              action={
                <Button asChild variant="outline">
                  <Link to="/surveys/new">Create a survey</Link>
                </Button>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="share" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Public link</CardTitle>
              <CardDescription>
                Anyone with this link can respond while the survey is active.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                {`https://surveyflow.app/s/${surveyId}`}
              </code>
              {/* TODO: Integrate Spring Boot endpoint for issuing/rotating the public share link. */}
              <Button variant="outline">Copy link</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
