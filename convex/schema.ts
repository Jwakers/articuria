import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const muxProcessingStatus = v.union(
  v.literal("WAITING"),
  v.literal("READY"),
  v.literal("ERRORED"),
);

export const DIFFICULTY_OPTIONS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
] as const;

export const difficultyUnion = v.union(...DIFFICULTY_OPTIONS.map(v.literal));

export const THEME_OPTIONS = [
  "GENERAL",
  "PERSONAL_EXPERIENCES",
  "HYPOTHETICAL_SCENARIOS",
  "CURRENT_EVENTS",
  "PROFESSIONAL_DEVELOPMENT",
  "ETHICAL_DILEMMAS",
  "CULTURE_AND_SOCIETY",
  "NATURE_AND_ENVIRONMENT",
  "CREATIVITY_AND_IMAGINATION",
] as const;

export const themeUnion = v.union(...THEME_OPTIONS.map(v.literal));

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    tableTopics: v.optional(v.array(v.id("tableTopics"))),
    subscription: v.optional(v.union(v.literal("FREE"), v.literal("PRO"))),
    stripeCustomerId: v.optional(v.string()),
    subscriptionData: v.optional(v.any()), // TODO: add validation
  }).index("by_clerk_id", ["clerkId"]),
  tableTopics: defineTable({
    topic: v.optional(v.string()),
    difficulty: v.optional(difficultyUnion),
    theme: v.optional(themeUnion),
  }).index("by_theme_difficulty", ["theme", "difficulty"]),
  videos: defineTable({
    user: v.string(),
    uploadId: v.optional(v.string()),
    assetId: v.optional(v.string()),
    status: muxProcessingStatus,
    publicPlaybackId: v.optional(v.string()),
    audioRenditionStatus: muxProcessingStatus,
    duration: v.optional(v.number()),
    tableTopic: v.id("tableTopics"),
    transcript: v.optional(v.id("transcripts")),
    report: v.optional(v.id("reports")),
  }).index("by_user", ["user"]),
  transcripts: defineTable({
    data: v.any(),
    user: v.string(),
    videoId: v.id("videos"),
    speakingDuration: v.optional(v.number()),
    wordsPerMinute: v.optional(v.number()),
    fillerWordCount: v.optional(v.number()),
  }),
  reports: defineTable({
    user: v.string(),
    videoId: v.id("videos"),
    creativity: v.optional(v.string()),
    creativityScore: v.optional(v.number()),
    clarity: v.optional(v.string()),
    clarityScore: v.optional(v.number()),
    engagement: v.optional(v.string()),
    engagementScore: v.optional(v.number()),
    tone: v.optional(v.string()),
    toneScore: v.optional(v.number()),
    pacing: v.optional(v.string()),
    pacingScore: v.optional(v.number()),
    language: v.optional(v.string()),
    languageScore: v.optional(v.number()),
    averageScore: v.optional(v.number()),
    recommendations: v.optional(v.array(v.string())),
    commendations: v.optional(v.array(v.string())),
    shortSummary: v.optional(v.string()),
    summary: v.optional(v.string()),
  }),
});
