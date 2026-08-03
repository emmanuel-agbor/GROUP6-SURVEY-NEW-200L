import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, HelpCircle, Loader2, Plus, RotateCcw, Save, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { QuestionEditor } from "@/components/surveys/question-editor";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clearDraft, loadDraft, publishSurvey, saveDraft } from "@/lib/survey-draft";
import type { SurveyQuestion } from "@/types/survey";

const TITLE = "Create a survey — SurveyFlow";
const DESCRIPTION =
  "Build a survey with short text, choice, rating, date, and number questions in the SurveyFlow builder.";

export const Route = createFileRoute("/_console/surveys/new")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: CreateSurveyPage,
});

let questionCounter = 0;

function createQuestion(): SurveyQuestion {
  questionCounter += 1;
  return {
    id: `question-${questionCounter}`,
    type: "short_text",
    title: "",
    required: false,
  };
}

function CreateSurveyPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [status, setStatus] = useState<"loading" | "loaded">("loading");
  const [savedAt, setSavedAt] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [restored, setRestored] = useState(false);
  const dirtyRef = useRef(false);

  // Restore any locally autosaved draft on first paint.
  // TODO: Integrate Spring Boot endpoint for loading a server-side draft.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setTitle(draft.title);
      setDescription(draft.description);
      setQuestions(draft.questions);
      setSavedAt(draft.savedAt);
      const maxId = draft.questions.reduce((max, question) => {
        const parsed = Number.parseInt(question.id.replace("question-", ""), 10);
        return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
      }, 0);
      questionCounter = Math.max(questionCounter, maxId);
      setRestored(true);
    }
    setStatus("loaded");
  }, []);

  const persist = useCallback(
    (options?: { explicit?: boolean }) => {
      setSaving(true);
      const next = saveDraft({ title, description, questions });
      setSavedAt(next.savedAt);
      setSaving(false);
      if (options?.explicit) toast.success("Draft saved locally");
    },
    [title, description, questions],
  );

  // Debounced autosave whenever the draft changes.
  useEffect(() => {
    if (status !== "loaded") return;
    if (!dirtyRef.current) {
      dirtyRef.current = true;
      return;
    }
    const timer = setTimeout(() => persist(), 800);
    return () => clearTimeout(timer);
  }, [status, persist]);

  const discardDraft = () => {
    clearDraft();
    setTitle("");
    setDescription("");
    setQuestions([]);
    setSavedAt("");
    setRestored(false);
    toast.success("Draft discarded");
  };

  const canPublish =
    title.trim() !== "" &&
    questions.length > 0 &&
    questions.every((question) => question.title.trim() !== "");

  const handlePublish = () => {
    if (!canPublish) {
      toast.error("Add a title and complete every question before publishing.");
      return;
    }

    const publishedSurvey = publishSurvey({
      title: title.trim(),
      description: description.trim(),
      questions,
    });

    clearDraft();
    setTitle("");
    setDescription("");
    setQuestions([]);
    setSavedAt("");
    setRestored(false);
    toast.success("Survey published locally");
    navigate({ to: "/surveys/$surveyId", params: { surveyId: publishedSurvey.id } });
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    setQuestions((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      if (moved) next.splice(target, 0, moved);
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Create survey"
        description="Add your questions, mark what's required, then publish when it reads well."
        actions={
          <>
            {/* TODO: Integrate Spring Boot endpoint for saving a survey draft server-side. */}
            <Button variant="outline" onClick={() => persist({ explicit: true })} disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="size-4" aria-hidden="true" />
              )}
              Save draft
            </Button>
            <Button disabled={!canPublish} onClick={handlePublish}>
              <Send className="size-4" aria-hidden="true" />
              Publish
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
              <BreadcrumbPage>New survey</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </PageHeader>

      <div
        className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
        aria-live="polite"
      >
        {status === "loading" ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Restoring your draft…
          </span>
        ) : savedAt ? (
          <span className="inline-flex items-center gap-2">
            <Check className="size-4 text-success" aria-hidden="true" />
            {restored ? "Draft restored — " : ""}Autosaved at{" "}
            {new Date(savedAt).toLocaleTimeString()}
          </span>
        ) : (
          <span>Changes autosave to this browser as you type.</span>
        )}
        {savedAt ? (
          <Button variant="ghost" size="sm" onClick={discardDraft}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Discard draft
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Survey details</CardTitle>
          <CardDescription>Respondents see this before the first question.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="survey-title">Title</Label>
            <Input
              id="survey-title"
              placeholder="Customer onboarding feedback"
              required
              value={title}
              disabled={status === "loading"}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="survey-description">Description</Label>
            <Textarea
              id="survey-description"
              rows={3}
              placeholder="Tell respondents why you're asking and how long this will take."
              value={description}
              disabled={status === "loading"}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <section aria-label="Questions" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Questions</h2>
            <p className="text-sm text-muted-foreground">
              {questions.length === 0
                ? "No questions yet."
                : `${questions.length} question${questions.length === 1 ? "" : "s"} in this survey.`}
            </p>
          </div>
          <Button variant="outline" onClick={() => setQuestions((c) => [...c, createQuestion()])}>
            <Plus className="size-4" aria-hidden="true" />
            Add question
          </Button>
        </div>

        {questions.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title="Start with one question"
            description="Pick an answer type, write the question, and mark it required if you need an answer."
            action={
              <Button onClick={() => setQuestions([createQuestion()])}>
                Add your first question
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                index={index}
                total={questions.length}
                onChange={(updated) =>
                  setQuestions((current) =>
                    current.map((item) => (item.id === updated.id ? updated : item)),
                  )
                }
                onRemove={() =>
                  setQuestions((current) => current.filter((item) => item.id !== question.id))
                }
                onMove={(direction) => moveQuestion(index, direction)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
