import { Link, createFileRoute } from "@tanstack/react-router";
import { FilePlus2, FileText, MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SearchBar } from "@/components/shared/search-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { TablePagination } from "@/components/shared/table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pendingCollection } from "@/lib/api-placeholder";
import type { Survey, SurveyStatus } from "@/types/survey";

const TITLE = "Surveys — SurveyFlow";
const DESCRIPTION =
  "Search, filter, and manage every survey in your SurveyFlow workspace from a single list.";

const STATUS_FILTERS: { value: SurveyStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "archived", label: "Archived" },
];

export const Route = createFileRoute("/_console/surveys/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: SurveysPage,
});

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SurveysPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SurveyStatus | "all">("all");
  const [page, setPage] = useState(1);

  // TODO: Integrate Spring Boot endpoint for fetching surveys (search, status filter, pagination).
  const surveys = pendingCollection<Survey>();

  const visibleSurveys = useMemo(() => {
    const term = query.trim().toLowerCase();
    return surveys.filter(
      (survey) =>
        (status === "all" || survey.status === status) &&
        (term === "" || survey.title.toLowerCase().includes(term)),
    );
  }, [surveys, query, status]);

  const pageCount = Math.max(1, Math.ceil(visibleSurveys.length / 10));

  return (
    <>
      <PageHeader
        title="Surveys"
        description="Every survey in this workspace, newest first."
        actions={
          <Button asChild>
            <Link to="/surveys/new">
              <FilePlus2 className="size-4" aria-hidden="true" />
              Create survey
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar
              label="Search surveys"
              placeholder="Search by title…"
              value={query}
              onChange={(value) => {
                setQuery(value);
                setPage(1);
              }}
            />
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as SurveyStatus | "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-44" aria-label="Filter by status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {visibleSurveys.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={query || status !== "all" ? "No surveys match those filters" : "No surveys yet"}
              description={
                query || status !== "all"
                  ? "Try a different search term or clear the status filter."
                  : "Create your first survey to start collecting responses."
              }
              action={
                query || status !== "all" ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery("");
                      setStatus("all");
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/surveys/new">Create survey</Link>
                  </Button>
                )
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Responses</TableHead>
                      <TableHead>Last updated</TableHead>
                      <TableHead className="w-10 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleSurveys.map((survey) => (
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
                        <TableCell className="text-muted-foreground">
                          {formatDate(survey.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">{survey.responseCount}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(survey.updatedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Actions for ${survey.title}`}
                              >
                                <MoreHorizontal className="size-4" aria-hidden="true" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to="/surveys/$surveyId" params={{ surveyId: survey.id }}>
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to="/surveys/$surveyId" params={{ surveyId: survey.id }}>
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              {/* TODO: Integrate Spring Boot endpoint for duplicating a survey. */}
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {/* TODO: Integrate Spring Boot endpoint for deleting a survey. */}
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <TablePagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}