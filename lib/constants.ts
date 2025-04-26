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
  subscription: {
    success: "/subscription/success",
    invoice: "/subscription/invoice",
  },
  privacy: "/privacy",
  terms: "/terms",
};
// TODO
// - Add all features
// - Use this data in the frontend components
// - Update the drawer component to display the free tier

export const SUBSCRIPTION_TIERS = {
  free: {
    price: "FREE",
    features: [],
  },
  pro: {
    price: 6.99,
    features: [],
  },
} as const;

export const ACCOUNT_LIMITS: Record<
  keyof typeof SUBSCRIPTION_TIERS,
  {
    tableTopicLimit: number;
    videoSizeLimit: number;
    tableTopicOptions: {
      difficulty: boolean;
      theme: boolean;
    };
  }
> = {
  free: {
    tableTopicLimit: 5,
    videoSizeLimit: convertMegabytesToBytes(10), // mb
    tableTopicOptions: {
      difficulty: false,
      theme: false,
    },
  },
  pro: {
    tableTopicLimit: 50,
    videoSizeLimit: convertMegabytesToBytes(25), // mb
    tableTopicOptions: {
      difficulty: true,
      theme: true,
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
