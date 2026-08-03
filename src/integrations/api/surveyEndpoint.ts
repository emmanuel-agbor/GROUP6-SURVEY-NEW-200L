// src/services/surveys.ts
import request from "./client"; // adjust to your actual request helper path
import { getStoredToken } from "@/lib/auth";
import type { SurveyQuestion, QuestionType } from "@/types/survey";

export type BackendQuestionType =
  "SHORT_TEXT" | "LONG_TEXT" | "NUMBER" | "DROPDOWN" | "MULTI_CHOICE" | "RATING" | "DATE" | "EMAIL";

export interface OptionRequest {
  label: string;
}

export interface QuestionRequest {
  text: string;
  type: BackendQuestionType;
  required: boolean;
  options?: OptionRequest[];
}

export interface CreateSurveyRequest {
  title: string;
  description: string;
  questions: QuestionRequest[];
}

// updateSurvey expects the same shape as create (full replace of title/description/questions)
export type UpdateSurveyRequest = CreateSurveyRequest;

export interface OptionDto {
  id: string;
  label: string;
  orderIndex: number;
}

export interface QuestionDto {
  id: string;
  text: string;
  type: BackendQuestionType;
  orderIndex: number;
  required: boolean;
  options: OptionDto[];
}

export interface SurveyDto {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  status: string;
  questions: QuestionDto[];
  createdAt: string;
  updatedAt: string;
}

// ---- auth helper ----

// Builds a headers object with the JWT Authorization header when a token is
// present. Throws if a token is required but missing, so callers fail fast
// instead of silently hitting a 401.
function authHeaders(required = true): HeadersInit {
  const token = getStoredToken();
  if (!token) {
    if (required) {
      throw new Error("Not authenticated: no token found");
    }
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

export const createSurvey = (creatorId: string, payload: CreateSurveyRequest) =>
  request(`api/surveys?creatorId=${encodeURIComponent(creatorId)}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  }) as unknown as Promise<SurveyDto>;

export const updateSurvey = (surveyId: string, userId: string, payload: UpdateSurveyRequest) =>
  request(`api/surveys/${surveyId}?userId=${encodeURIComponent(userId)}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  }) as unknown as Promise<SurveyDto>;

// Reading a single survey may be public (e.g. respondents filling it out),
// so the token is attached when present but not required.
export const getSurvey = (surveyId: string) =>
  request(`api/surveys/${surveyId}`, {
    headers: authHeaders(false),
  }) as unknown as Promise<SurveyDto>;

export const getSurveysByCreator = (creatorId: string) =>
  request(`api/surveys?creatorId=${encodeURIComponent(creatorId)}`, {
    headers: authHeaders(),
  }) as unknown as Promise<SurveyDto[]>;

export const publishSurvey = (surveyId: string, userId: string) =>
  request(`api/surveys/${surveyId}/publish?userId=${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: authHeaders(),
  }) as unknown as Promise<SurveyDto>;

export const deleteSurvey = (surveyId: string, userId: string) =>
  request(`api/surveys/${surveyId}?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: authHeaders(),
  }) as unknown as Promise<SurveyDto>;

// ---- form (frontend) <-> API (backend) mapping ----

const QUESTION_TYPE_MAP: Record<QuestionType, BackendQuestionType> = {
  short_text: "SHORT_TEXT",
  long_text: "LONG_TEXT",
  number: "NUMBER",
  dropdown: "DROPDOWN",
  checkbox: "MULTI_CHOICE",
  multiple_choice: "MULTI_CHOICE",
  rating: "RATING",
  date: "DATE",
  email: "EMAIL",
};

const REVERSE_QUESTION_TYPE_MAP: Record<BackendQuestionType, QuestionType> = {
  SHORT_TEXT: "short_text",
  LONG_TEXT: "long_text",
  NUMBER: "number",
  DROPDOWN: "dropdown",
  MULTI_CHOICE: "multiple_choice",
  RATING: "rating",
  DATE: "date",
  EMAIL: "email",
};

const CHOICE_TYPES = new Set<BackendQuestionType>(["DROPDOWN", "MULTI_CHOICE"]);

export function toQuestionRequest(question: SurveyQuestion): QuestionRequest {
  const type = QUESTION_TYPE_MAP[question.type];
  const req: QuestionRequest = { text: question.title, type, required: question.required };

  if (CHOICE_TYPES.has(type) && Array.isArray(question.options)) {
    req.options = question.options.map((label) => ({ label }));
  }

  return req;
}

export function toSurveyPayload(
  title: string,
  description: string,
  questions: SurveyQuestion[],
): CreateSurveyRequest {
  return { title, description, questions: questions.map(toQuestionRequest) };
}

export function fromQuestionDto(dto: QuestionDto): SurveyQuestion {
  return {
    id: dto.id,
    type: REVERSE_QUESTION_TYPE_MAP[dto.type],
    title: dto.text,
    required: dto.required,
    options: dto.options?.length ? dto.options.map((o) => o.label) : undefined,
  };
}

export function fromSurveyDto(dto: SurveyDto): {
  title: string;
  description: string;
  questions: SurveyQuestion[];
} {
  return {
    title: dto.title,
    description: dto.description ?? "",
    questions: (dto.questions ?? []).map(fromQuestionDto),
  };
}
