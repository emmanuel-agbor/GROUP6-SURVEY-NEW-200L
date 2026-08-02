/**
 * Domain types shared across the SurveyFlow frontend.
 * These mirror the contracts the Spring Boot API is expected to expose.
 * No data is defined here — only shapes.
 */

export type SurveyStatus = "draft" | "active" | "closed" | "archived";

export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "checkbox"
  | "dropdown"
  | "rating"
  | "date"
  | "email"
  | "number";

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string | undefined;
  required: boolean;
  options?: string[] | undefined;
}

export interface Survey {
  id: string;
  title: string;
  description?: string | undefined;
  status: SurveyStatus;
  createdAt: string;
  updatedAt: string;
  responseCount: number;
  questions?: SurveyQuestion[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  surveyTitle: string;
  respondent?: string | undefined;
  submittedAt: string;
  completed: boolean;
}

export interface DashboardMetrics {
  totalSurveys: number;
  activeSurveys: number;
  responsesCollected: number;
  draftSurveys: number;
}

export interface ActivityItem {
  id: string;
  message: string;
  occurredAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

/** Async UI state used by every data-driven screen. */
export type AsyncState = "loading" | "error" | "empty" | "ready";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  short_text: "Short text",
  long_text: "Long text",
  multiple_choice: "Multiple choice",
  checkbox: "Checkbox",
  dropdown: "Dropdown",
  rating: "Rating",
  date: "Date",
  email: "Email",
  number: "Number",
};

export const CHOICE_QUESTION_TYPES: QuestionType[] = ["multiple_choice", "checkbox", "dropdown"];
