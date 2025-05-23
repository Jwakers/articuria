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
    subscription: v.optional(v.union(v.literal("FREE"), v.literal("PRO"))),
    stripeCustomerId: v.optional(v.string()),
    subscriptionData: v.optional(v.any()),
  }).index("by_clerk_id", ["clerkId"]),
  tableTopic: defineTable({
    topic: v.optional(v.string()),
    difficulty: v.optional(difficultyUnion),
    theme: v.union(themeUnion),
  }),
  video: defineTable({
    user: v.string(),
    uploadId: v.optional(v.string()),
    assetId: v.optional(v.string()),
    status: muxProcessingStatus,
    publicPlaybackId: v.optional(v.string()),
    audioRenditionStatus: muxProcessingStatus,
    duration: v.optional(v.number()),
    tableTopic: v.id("tableTopic"),
  }).index("by_user", ["user"]),
});
