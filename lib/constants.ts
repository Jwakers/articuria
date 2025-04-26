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

type TierKeys = "free" | "pro";

export const ACCOUNT_LIMITS: Record<
  TierKeys,
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
};

export const SUBSCRIPTION_TIERS: Record<
  TierKeys,
  {
    price: number | undefined;
    features: {
      title: string;
      description: string;
      shortDescription: string;
      comingSoon?: boolean;
    }[];
  }
> = {
  free: {
    price: undefined,
    features: [
      {
        title: "Save table topics",
        description: `Save and rewatch up to ${ACCOUNT_LIMITS.free.tableTopicLimit} table topics`,
        shortDescription: `Save and rewatch up to ${ACCOUNT_LIMITS.free.tableTopicLimit} table topics`,
      },
    ],
  },
  pro: {
    price: 6.99,
    features: [
      {
        title: "Save table topics",
        description: `Save up to ${ACCOUNT_LIMITS.pro.tableTopicLimit} table topics to review later and see your progress over time`,
        shortDescription: `Save and rewatch up to ${ACCOUNT_LIMITS.pro.tableTopicLimit} table topics`,
      },
      {
        title: "AI generation",
        description: `Generate new topics with AI, with additional options for difficulty and theme`,
        shortDescription: `Generate AI table topics, with difficulty and theme options`,
      },
      {
        title: "Speech feedback",
        description:
          "Generate feedback and stats on your recorded topics to guide your progress",
        shortDescription: "Generate feedback and stats on your recorded topics",
        comingSoon: true,
      },
    ],
  },
};

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
