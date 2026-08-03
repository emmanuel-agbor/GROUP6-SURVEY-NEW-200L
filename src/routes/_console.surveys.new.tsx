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
<<<<<<< HEAD
import { clearDraft, loadDraft, publishSurvey, saveDraft } from "@/lib/survey-draft";
=======
import { getStoredUser, isAuthenticated } from "@/lib/auth";
import {
  createSurvey,
  deleteSurvey,
  publishSurvey,
  toSurveyPayload,
  updateSurvey,
} from "@/integrations/api/surveyEndpoint";
>>>>>>> dc3eb68949178148324499c7f59a1636958d1302
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

function canSave(title: string, questions: SurveyQuestion[]) {
  if (title.trim() === "" || questions.length === 0) return false;
  return questions.every((q) => {
    if (q.title.trim() === "") return false;
    if (q.type === "multiple_choice" || q.type === "checkbox" || q.type === "dropdown") {
      return (q.options ?? []).filter((o) => o.trim() !== "").length >= 2;
    }
    return true;
  });
}

function CreateSurveyPage() {
  const navigate = useNavigate();
<<<<<<< HEAD
=======

  // Route guard: bounce unauthenticated visitors straight to sign-in.
  // (Belt-and-suspenders — the real gate should live in a route beforeLoad,
  // but this keeps the page safe even if that isn't wired up yet.)
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/login" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const user = getStoredUser();

>>>>>>> dc3eb68949178148324499c7f59a1636958d1302
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [savedAt, setSavedAt] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Set once the first save succeeds and the backend has assigned an id.
  // Everything after that point is an update against this same draft survey.
  const surveyIdRef = useRef<string | null>(null);

  const persist = useCallback(async () => {
    if (!user) return;
    if (!canSave(title, questions)) {
      toast.error("Add a title and finish every question before saving");
      return;
    }
    setSaving(true);
    const payload = toSurveyPayload(title, description, questions);
    try {
      if (surveyIdRef.current) {
        await updateSurvey(surveyIdRef.current, user.id, payload);
      } else {
        const created = await createSurvey(user.id, payload);
        surveyIdRef.current = created.id;
      }
      setSavedAt(new Date().toISOString());
      toast.success("Draft saved");
    } catch {
      toast.error("Couldn't save the draft");
    } finally {
      setSaving(false);
    }
  }, [title, description, questions, user]);

  const discardDraft = async () => {
    if (surveyIdRef.current && user) {
      try {
        await deleteSurvey(surveyIdRef.current, user.id);
      } catch {
        toast.error("Couldn't delete the saved draft — it may still exist on the server");
      }
      surveyIdRef.current = null;
    }
    setTitle("");
    setDescription("");
    setQuestions([]);
    setSavedAt("");
    toast.success("Draft discarded");
  };

<<<<<<< HEAD
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
=======
  const publish = async () => {
    if (!user) return;
    setPublishing(true);
    try {
      const payload = toSurveyPayload(title, description, questions);
      const surveyId = surveyIdRef.current
        ? (await updateSurvey(surveyIdRef.current, user.id, payload)).id
        : (await createSurvey(user.id, payload)).id;
      surveyIdRef.current = surveyId;
      await publishSurvey(surveyId, user.id);
      toast.success("Survey published");
      navigate({ to: "/surveys" });
    } catch {
      toast.error("Couldn't publish the survey");
    } finally {
      setPublishing(false);
    }
>>>>>>> dc3eb68949178148324499c7f59a1636958d1302
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

  const readyToPublish = !!user && canSave(title, questions) && !publishing;

  if (!user) {
    // Mid-redirect (see the effect above) — avoid flashing the form.
    return null;
  }

  return (
    <>
      <PageHeader
        title="Create survey"
        description="Add your questions, mark what's required, then publish when it reads well."
        actions={
          <>
            <Button variant="outline" onClick={() => persist()} disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="size-4" aria-hidden="true" />
              )}
              Save draft
            </Button>
<<<<<<< HEAD
            <Button disabled={!canPublish} onClick={handlePublish}>
              <Send className="size-4" aria-hidden="true" />
=======
            <Button disabled={!readyToPublish} onClick={publish}>
              {publishing ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="size-4" aria-hidden="true" />
              )}
>>>>>>> dc3eb68949178148324499c7f59a1636958d1302
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
        {savedAt ? (
          <span className="inline-flex items-center gap-2">
            <Check className="size-4 text-success" aria-hidden="true" />
            Saved at {new Date(savedAt).toLocaleTimeString()}
          </span>
        ) : (
          <span>Click "Save draft" to save your progress.</span>
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