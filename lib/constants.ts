import { Theme } from "@prisma/client";
import { convertMegabytesToBytes } from "./utils";

export const ROUTES = {
  landing: "/",
  dashboard: {
    root: "/dashboard",
    tableTopics: {
      record: "/dashboard/table-topics/record",
      manage: "/dashboard/table-topics/manage",
    },
    contact: "/dashboard/contact",
  },
  privacy: "/privacy",
  terms: "/terms",
};

export const ACCOUNT_LIMITS = {
  free: {
    tableTopicLimit: 5,
    videoSizeLimit: convertMegabytesToBytes(10), // mb
    tableTopicOptions: {
      difficulty: false,
      theme: false,
    },
  },
} as const;

export enum ERROR_CODES {
  reachedVideoLimit = "VL",
  videoSizeLimitExceeded = "SL",
}

export const CONTACT_FORM_REASONS = {
  issue: { key: "issue", value: "Issue" },
  feedback: { key: "feedback", value: "Application feedback" },
  support: { key: "support", value: "Application support" },
  other: { key: "other", value: "Other" },
};

export const THEME_MAP: Record<Theme, string> = {
  CREATIVITY_AND_IMAGINATION: "Creativity and Imagination",
  CULTURE_AND_SOCIETY: "Culture and Society",
  CURRENT_EVENTS: "Current Events",
  ETHICAL_DILEMMAS: "Ethical Dilemmas",
  GENERAL: "General",
  HYPOTHETICAL_SCENARIOS: "Hypothetical Scenarios",
  NATURE_AND_ENVIRONMENT: "Nature and Environment",
  PERSONAL_EXPERIENCES: "Personal Experiences",
  PROFESSIONAL_DEVELOPMENT: "Professional Development",
};
