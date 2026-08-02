import type { SurveyResponse } from "@/types/survey";

/**
 * Sample response rows so the responses table, pagination, and CSV export can be
 * exercised before the API exists.
 * TODO: Replace with Spring Boot endpoint GET /api/responses
 */
const SURVEYS = [
  "Customer onboarding feedback",
  "Q3 product satisfaction",
  "Website usability check",
  "Support follow-up",
  "Feature request poll",
];

const RESPONDENTS = [
  "ada@example.com",
  "grace@example.com",
  null,
  "linus@example.com",
  "margaret@example.com",
  null,
];

function buildResponses(count: number): SurveyResponse[] {
  const base = Date.UTC(2026, 6, 1, 9, 0, 0);
  return Array.from({ length: count }, (_, index) => {
    const surveyIndex = index % SURVEYS.length;
    return {
      id: `response-${index + 1}`,
      surveyId: `survey-${surveyIndex + 1}`,
      surveyTitle: SURVEYS[surveyIndex]!,
      respondent: RESPONDENTS[index % RESPONDENTS.length] ?? undefined,
      submittedAt: new Date(base + index * 5_400_000).toISOString(),
      completed: index % 4 !== 0,
    } satisfies SurveyResponse;
  });
}

/** Simulates a network round-trip so loading states are exercised. */
export function fetchResponses(): Promise<SurveyResponse[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(buildResponses(37)), 600);
  });
}
