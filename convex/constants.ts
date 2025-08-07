import { DIFFICULTY_OPTIONS, THEME_OPTIONS } from "./schema";
import { convertMegabytesToBytes } from "./utils";

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
