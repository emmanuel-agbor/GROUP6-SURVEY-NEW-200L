import type { SurveyStatus } from "@/types/survey";

export type NeedsAttentionKind = "draft" | "closing_soon" | "unread" | "pending_review";

export interface NeedsAttentionItem {
  id: string;
  kind: NeedsAttentionKind;
  label: string;
  count: number;
  href: "/surveys" | "/responses";
}

export interface RecentSurveyRow {
  id: string;
  title: string;
  status: SurveyStatus;
  responses: number;
  updatedAt: string;
}

export type ActivityKind = "response" | "published" | "closed" | "draft_saved";

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  message: string;
  occurredAt: string;
}

export interface DashboardOverview {
  totalSurveys: number;
  totalSurveysTrend: string;
  activeSurveys: number;
  totalResponses: number;
  needsAttention: NeedsAttentionItem[];
  recentSurveys: RecentSurveyRow[];
  activity: ActivityEntry[];
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

function buildOverview(): DashboardOverview {
  return {
    totalSurveys: 24,
    totalSurveysTrend: "+2 this week",
    activeSurveys: 9,
    totalResponses: 1842,
    needsAttention: [
      { id: "attn-draft", kind: "draft", label: "Draft surveys", count: 4, href: "/surveys" },
      {
        id: "attn-closing",
        kind: "closing_soon",
        label: "Closing within 3 days",
        count: 2,
        href: "/surveys",
      },
      {
        id: "attn-unread",
        kind: "unread",
        label: "Unread responses",
        count: 15,
        href: "/responses",
      },
      {
        id: "attn-pending",
        kind: "pending_review",
        label: "Pending review",
        count: 3,
        href: "/responses",
      },
    ],
    recentSurveys: [
      {
        id: "survey-1",
        title: "Customer Feedback Q3",
        status: "active",
        responses: 482,
        updatedAt: ago(2 * HOUR),
      },
      {
        id: "survey-2",
        title: "Employee Engagement Survey",
        status: "active",
        responses: 216,
        updatedAt: ago(1 * DAY),
      },
      {
        id: "survey-3",
        title: "Event Registration — Homecoming",
        status: "closed",
        responses: 340,
        updatedAt: ago(3 * DAY),
      },
      {
        id: "survey-4",
        title: "Course Evaluation — CS301",
        status: "draft",
        responses: 0,
        updatedAt: ago(5 * DAY),
      },
      {
        id: "survey-5",
        title: "Alumni Outreach Survey",
        status: "archived",
        responses: 128,
        updatedAt: ago(14 * DAY),
      },
    ],
    activity: [
      {
        id: "activity-1",
        kind: "response",
        message: "Customer Feedback Q3 received 12 new responses.",
        occurredAt: ago(10 * MINUTE),
      },
      {
        id: "activity-2",
        kind: "published",
        message: "Employee Engagement Survey was published.",
        occurredAt: ago(3 * HOUR),
      },
      {
        id: "activity-3",
        kind: "closed",
        message: "Event Registration — Homecoming closed to new responses.",
        occurredAt: ago(1 * DAY),
      },
      {
        id: "activity-4",
        kind: "draft_saved",
        message: "Course Evaluation — CS301 draft was saved.",
        occurredAt: ago(2 * DAY),
      },
      {
        id: "activity-5",
        kind: "response",
        message: "Alumni Outreach Survey received 5 new responses.",
        occurredAt: ago(3 * DAY),
      },
    ],
  };
}

/** Simulates a network round-trip so loading states are exercised. */
export function fetchDashboardOverview(): Promise<DashboardOverview> {
  // TODO: Integrate Spring Boot endpoint GET /api/dashboard/overview
  return new Promise((resolve) => {
    setTimeout(() => resolve(buildOverview()), 500);
  });
}

/** Formats an ISO timestamp as a short relative time, e.g. "3 hrs ago". */
export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();

  const minutes = Math.round(diffMs / MINUTE);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(diffMs / HOUR);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(diffMs / DAY);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  const weeks = Math.round(days / 7);
  return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
}
