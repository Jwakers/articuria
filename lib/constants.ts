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
  },
} as const;

export enum ERROR_CODES {
  reachedVideoLimit = "VL",
  videoSizeLimitExceeded = "SL",
}

export const CONTACT_FORM_REASONS = {
  issue: { key: "issue", value: "Issue" },
  feedback: { key: "feedback", value: "Application feedback" },
  other: { key: "other", value: "Other" },
};
