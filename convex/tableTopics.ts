import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { difficultyUnion, themeUnion } from "./schema";

export const create = mutation({
  args: {
    topic: v.string(),
    theme: v.optional(themeUnion),
    difficulty: v.optional(difficultyUnion),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    console.log("identity", identity);
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

export const getOrCreateTopic = mutation({
  args: {
    difficulty: difficultyUnion,
    theme: themeUnion,
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Find an existing topic the user has not already done
    const videos = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("user"), identity.tokenIdentifier))
      .collect();
    const existingTopics = videos.map((video) => video.tableTopic);

    const topics = ctx.db
      .query("tableTopics")
      .filter((q) =>
        q.and(
          q.eq(q.field("difficulty"), args.difficulty),
          q.eq(q.field("theme"), args.theme),
        ),
      );

    for await (const topic of topics) {
      if (!existingTopics.includes(topic._id)) {
        return topic;
      }
    }

    // If we need a new topic create one
    const topicId = await ctx.db.insert("tableTopics", {
      topic: undefined, // This will be updated by the scheduled action
      theme: args.theme,
      difficulty: args.difficulty,
    });

    // Schedule an action to update it
    await ctx.scheduler.runAfter(0, internal.tableTopics.updateTopicWithAi, {
      topicId,
      difficulty: args.difficulty,
      theme: args.theme,
      topicBlackList: [], // TODO: when videos are setup
    });

    return topicId;
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

// TODO: store clerk data in a users table

const BASE_URL = process.env.APP_URL;

export const updateTopicWithAi = internalAction({
  args: {
    topicId: v.id("tableTopics"),
    difficulty: difficultyUnion,
    theme: themeUnion,
    topicBlackList: v.array(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    console.log(BASE_URL);
    const res = await fetch(`${BASE_URL}/api/openai/create-topic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        difficulty: args.difficulty,
        theme: args.theme,
        topicBlackList: args.topicBlackList,
      }),
    });

    const data = await res.json();

    await ctx.runMutation(internal.tableTopics.updateTopic, {
      topicId: args.topicId,
      topic: data.topic,
    });
  },
});
