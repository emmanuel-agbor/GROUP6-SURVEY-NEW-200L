import { createFileRoute } from "@tanstack/react-router";
import { Download, Inbox, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loading";
import { PageHeader } from "@/components/shared/page-header";
import { SearchBar } from "@/components/shared/search-bar";
import { TablePagination } from "@/components/shared/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadCsv, toCsv, type CsvColumn } from "@/lib/csv";
import { fetchResponses } from "@/lib/responses-placeholder";
import type { SurveyResponse } from "@/types/survey";

const PAGE_SIZE = 10;

const CSV_COLUMNS: CsvColumn<SurveyResponse>[] = [
  { header: "Response ID", value: (row) => row.id },
  { header: "Survey", value: (row) => row.surveyTitle },
  { header: "Respondent", value: (row) => row.respondent ?? "Anonymous" },
  { header: "Submitted at", value: (row) => row.submittedAt },
  { header: "Completion", value: (row) => (row.completed ? "Complete" : "Partial") },
];

const TITLE = "Responses — SurveyFlow";
const DESCRIPTION =
  "Browse individual survey submissions, filter by survey, and export response data for analysis.";

export const Route = createFileRoute("/_console/responses")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ResponsesPage,
});

function ResponsesPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [exportProgress, setExportProgress] = useState<number | null>(null);

  // TODO: Integrate Spring Boot endpoint for fetching survey responses (search + pagination).
  useEffect(() => {
    let active = true;
    setStatus("loading");
    fetchResponses()
      .then((rows) => {
        if (!active) return;
        setResponses(rows);
        setStatus("loaded");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return responses;
    return responses.filter(
      (response) =>
        response.surveyTitle.toLowerCase().includes(term) ||
        (response.respondent ?? "").toLowerCase().includes(term),
    );
  }, [responses, query]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const pageRows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const exporting = exportProgress !== null;

  const handleExport = async () => {
    if (visible.length === 0 || exporting) return;
    setExportProgress(5);
    try {
      // Chunked so the progress bar reflects real work on large result sets.
      const chunkSize = 200;
      const rows: SurveyResponse[] = [];
      for (let index = 0; index < visible.length; index += chunkSize) {
        rows.push(...visible.slice(index, index + chunkSize));
        setExportProgress(Math.min(95, Math.round((rows.length / visible.length) * 95)));
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      downloadCsv(`surveyflow-responses-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows, CSV_COLUMNS));
      setExportProgress(100);
      toast.success(`Exported ${rows.length} response${rows.length === 1 ? "" : "s"} to CSV`);
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setTimeout(() => setExportProgress(null), 400);
    }
  };

  return (
    <>
      <PageHeader
        title="Responses"
        description="Individual submissions across all of your surveys."
        actions={
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={status !== "loaded" || visible.length === 0 || exporting}
          >
            {exporting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="size-4" aria-hidden="true" />
            )}
            {exporting ? "Exporting…" : "Export CSV"}
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
          <SearchBar
            label="Search responses"
            placeholder="Search by survey or respondent…"
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
          />

          {exporting ? (
            <div className="space-y-2" aria-live="polite">
              <p className="text-sm text-muted-foreground">
                Preparing CSV… {exportProgress}%
              </p>
              <Progress value={exportProgress ?? 0} aria-label="CSV export progress" />
            </div>
          ) : null}

          {status === "loading" ? (
            <TableSkeleton rows={6} columns={4} />
          ) : status === "error" ? (
            <ErrorState
              title="Couldn't load responses"
              description="The responses service didn't reply. Try again in a moment."
              onRetry={() => setReloadKey((key) => key + 1)}
            />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title={query ? "No responses match that search" : "No responses yet"}
              description={
                query
                  ? "Try a different survey name or respondent."
                  : "Once people submit your active surveys, their answers appear here."
              }
              action={
                query ? (
                  <Button variant="outline" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Survey</TableHead>
                      <TableHead>Respondent</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Completion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell className="max-w-56 truncate font-medium">
                          {response.surveyTitle}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {response.respondent ?? "Anonymous"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(response.submittedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={response.completed ? "default" : "secondary"}>
                            {response.completed ? "Complete" : "Partial"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                page={page}
                pageCount={pageCount}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}