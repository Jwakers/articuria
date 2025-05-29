import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { difficultyUnion, themeUnion } from "./schema";

export const create = mutation({
  args: {
    topic: v.string(),
    theme: v.optional(themeUnion),
    difficulty: v.optional(difficultyUnion),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const topicId = await ctx.db.insert("tableTopics", {
      topic: args.topic,
      theme: args.theme ?? "GENERAL",
      difficulty: args.difficulty,
    });

    return topicId;
  },
});

export const get = query({
  args: {
    topicId: v.optional(v.id("tableTopics")),
  },
  async handler(ctx, args) {
    if (!args.topicId) return null;
    const topic = await ctx.db.get(args.topicId);
    return topic;
  },
});

export const updateTopic = internalMutation({
  args: {
    topicId: v.id("tableTopics"),
    topic: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.topicId, {
      topic: args.topic,
    });
  },
});
