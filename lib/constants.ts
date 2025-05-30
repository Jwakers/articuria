import { DIFFICULTY_OPTIONS, THEME_OPTIONS } from "@/convex/schema";
import { convertMegabytesToBytes } from "./utils";

export const ROUTES = {
  landing: "/",
  dashboard: {
    root: "/dashboard",
    tableTopics: {
      root: "/dashboard/table-topics",
      record: "/dashboard/table-topics/record",
      manage: "/dashboard/table-topics/manage",
    },
    subscription: "/dashboard/subscription",
    contact: "/dashboard/contact",
  },
  success: "/success",
  privacy: "/privacy",
  terms: "/terms-of-service",
} as const;

type TierKeys = "free" | "pro";

export const ACCOUNT_LIMITS: Record<
  TierKeys,
  {
    tableTopicLimit: number;
    videoSizeLimit: number;
    tableTopicTranscription: boolean;
    tableTopicReport: boolean;
    tableTopicOptions: {
      difficulty: boolean;
      theme: boolean;
    };
  }
> = {
  free: {
    tableTopicLimit: 5,
    tableTopicTranscription: false,
    tableTopicReport: false,
    videoSizeLimit: convertMegabytesToBytes(10), // mb
    tableTopicOptions: {
      difficulty: false,
      theme: false,
    },
  },
  pro: {
    tableTopicLimit: 50,
    tableTopicTranscription: true,
    tableTopicReport: true,
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
      {
        title: "Transcript and feedback",
        description:
          "Generate 1 transcript and feedback report of your table topic to get a taste of this pro feature",
        shortDescription: "Generate 1 transcript and feedback report for free",
      },
    ],
  },
  pro: {
    price: 799,
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
      },
      {
        title: "Transcripts",
        description:
          "Generate transcripts of your recordings with timestamp playback",
        shortDescription: "Generate transcripts of your recordings",
      },
      {
        title: "Speech Assistant",
        description:
          "With AI technology we can help you write, improve, rehearse and perfect your upcoming speech or presentation",
        shortDescription:
          "Write and perfect your next speech with our speech assistant",
        comingSoon: true,
      },
    ],
  },
};

export const CONTACT_FORM_REASONS = {
  issue: { key: "issue", value: "Issue" },
  feedback: { key: "feedback", value: "Application feedback" },
  support: { key: "support", value: "Application support" },
  other: { key: "other", value: "Other" },
};

export const DIFFICULTY_MAP: Record<
  (typeof DIFFICULTY_OPTIONS)[number],
  string
> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
} as const;

export const THEME_MAP: Record<(typeof THEME_OPTIONS)[number], string> = {
  CREATIVITY_AND_IMAGINATION: "Creativity and Imagination",
  CULTURE_AND_SOCIETY: "Culture and Society",
  CURRENT_EVENTS: "Current Events",
  ETHICAL_DILEMMAS: "Ethical Dilemmas",
  GENERAL: "General",
  HYPOTHETICAL_SCENARIOS: "Hypothetical Scenarios",
  NATURE_AND_ENVIRONMENT: "Nature and Environment",
  PERSONAL_EXPERIENCES: "Personal Experiences",
  PROFESSIONAL_DEVELOPMENT: "Professional Development",
} as const;

export const DISFLUENCIES = [
  "um",
  "uh",
  "hmm",
  "mhm",
  "uh-huh",
  "ah",
  "huh",
  "hm",
  "m",
] as const;
