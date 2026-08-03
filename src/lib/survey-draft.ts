import type { Survey, SurveyQuestion } from "@/types/survey";

/**
 * Local draft persistence for the survey builder.
 * Drafts live in localStorage until the Spring Boot API is wired up.
 */
export interface SurveyDraft {
  title: string;
  description: string;
  questions: SurveyQuestion[];
  savedAt: string;
}

const DRAFT_KEY = "surveyflow-survey-draft";
const PUBLISHED_KEY = "surveyflow-published-surveys";

export const emptyDraft: SurveyDraft = {
  title: "",
  description: "",
  questions: [],
  savedAt: "",
};

export function loadDraft(): SurveyDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SurveyDraft>;
    if (typeof parsed !== "object" || parsed === null) return null;
    return {
      title: typeof parsed.title === "string" ? parsed.title : "",
      description: typeof parsed.description === "string" ? parsed.description : "",
      questions: Array.isArray(parsed.questions) ? (parsed.questions as SurveyQuestion[]) : [],
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : "",
    };
  } catch {
    return null;
  }
}

export function saveDraft(draft: Omit<SurveyDraft, "savedAt">): SurveyDraft {
  const next: SurveyDraft = { ...draft, savedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode / quota) — autosave is best-effort.
  }
  return next;
}

export function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function loadPublishedSurveys(): Survey[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PUBLISHED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Survey => {
      if (typeof item !== "object" || item === null) return false;
      const survey = item as Partial<Survey>;
      return (
        typeof survey.id === "string" &&
        typeof survey.title === "string" &&
        typeof survey.status === "string" &&
        typeof survey.createdAt === "string" &&
        typeof survey.updatedAt === "string" &&
        typeof survey.responseCount === "number"
      );
    });
  } catch {
    return [];
  }
}

export function loadPublishedSurvey(id: string): Survey | null {
  return loadPublishedSurveys().find((survey) => survey.id === id) ?? null;
}

export function publishSurvey(payload: {
  title: string;
  description: string;
  questions: SurveyQuestion[];
}): Survey {
  const now = new Date().toISOString();
  const survey: Survey = {
    id: `survey-${now}-${Math.random().toString(36).slice(2, 8)}`,
    title: payload.title.trim(),
    description: payload.description.trim(),
    status: "active",
    createdAt: now,
    updatedAt: now,
    responseCount: 0,
    questions: payload.questions,
  };

  try {
    const existing = loadPublishedSurveys();
    window.localStorage.setItem(PUBLISHED_KEY, JSON.stringify([survey, ...existing]));
  } catch {
    // Storage unavailable (private mode / quota) — publish is best-effort.
  }

  return survey;
}
