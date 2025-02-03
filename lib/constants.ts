import { convertMegabytesToBytes } from "./utils";

export const ROUTES = {
  landing: "/",
  dashboard: {
    root: "/dashboard",
    tableTopics: {
      record: "/dashboard/table-topics/record",
      manage: "/dashboard/table-topics/manage",
    },
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
