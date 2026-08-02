import type { SurveyQuestion } from "@/types/survey";

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
