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
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("identity", identity);
    if (!identity) throw new Error("Unauthorized");

    const topicId = await ctx.db.insert("tableTopic", {
      topic: args.topic,
      theme: args.theme ?? "GENERAL",
      difficulty: args.difficulty,
    });

    return topicId;
  },
});

export const get = query({
  args: {
    topicId: v.optional(v.id("tableTopic")),
  },
  handler: async (ctx, args) => {
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
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Find an existing topic the user has not already done
    // TODO: when videos are setup
    // for await (const topic of ctx.db.query("tableTopic")) {
    //   if (!args.excludeIds.includes(topic._id)) {
    //     return topic;
    //   }
    // }

    // If we need a new topic create one
    const topicId = await ctx.db.insert("tableTopic", {
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
    topicId: v.id("tableTopic"),
    topic: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.topicId, {
      topic: args.topic,
    });
  },
});

// TODO: store clerk data in a users table

const BASE_URL = process.env.APP_URL;

export const updateTopicWithAi = internalAction({
  args: {
    topicId: v.id("tableTopic"),
    difficulty: difficultyUnion,
    theme: themeUnion,
    topicBlackList: v.array(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    console.log(BASE_URL);
    const res = await fetch(`${BASE_URL}/api/openai/create-topic`, {
      method: "POST",
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
