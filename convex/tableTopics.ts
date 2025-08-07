import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import * as TableTopic from "./models/tableTopic";
import * as Users from "./models/user";
import { difficultyUnion, themeUnion } from "./schema";
import { getAccountLimits } from "./utils";

export const get = query({
  args: {
    topicId: v.id("tableTopics"),
  },
  async handler(ctx, args) {
    return await TableTopic.getTopic(ctx, args.topicId);
  },
});

export const updateTopic = internalMutation({
  args: {
    topicId: v.id("tableTopics"),
    topic: v.string(),
  },
  async handler(ctx, args) {
    await TableTopic.updateTopic(ctx, args.topicId, args.topic);
  },
});

export const getNewTopic = mutation({
  args: {
    difficulty: v.optional(difficultyUnion),
    theme: v.optional(themeUnion),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check user permissions
    const user = await Users.getCurrentUserOrThrow(ctx);
    const accountLimits = getAccountLimits(user);

    // Determine effective difficulty and theme based on account limits
    const effectiveDifficulty: Doc<"tableTopics">["difficulty"] =
      accountLimits.tableTopicOptions.difficulty && args.difficulty
        ? args.difficulty
        : "BEGINNER";

    const effectiveTheme: Doc<"tableTopics">["theme"] =
      accountLimits.tableTopicOptions.theme && args.theme
        ? args.theme
        : "GENERAL";

    // Query for available topics not already assigned to user
    const availableTopic = await ctx.db
      .query("tableTopics")
      .withIndex("by_theme_difficulty", (q) =>
        q.eq("theme", effectiveTheme).eq("difficulty", effectiveDifficulty),
      )
      .filter((q) =>
        q.and(
          ...(user.tableTopics?.map((id) => q.neq(q.field("_id"), id)) ?? []),
        ),
      )
      .first();

    let topicId: Id<"tableTopics">;

    if (availableTopic) {
      // Use existing topic
      topicId = availableTopic._id;
    } else {
      // Create new topic
      topicId = await TableTopic.createTopic(ctx, {
        theme: effectiveTheme,
        difficulty: effectiveDifficulty,
      });
    }

    // Update user's topic list
    await Users.updateUserTopics(ctx, [topicId]);

    return topicId;
  },
});

export const getUserTopics = internalQuery({
  args: {},
  async handler(ctx) {
    const user = await Users.getCurrentUserOrThrow(ctx);
    const topicIds = user.tableTopics;

    return await ctx.db
      .query("tableTopics")
      .filter((q) =>
        q.or(...(topicIds?.map((id) => q.eq(q.field("_id"), id)) ?? [])),
      )
      .take(100);
  },
});
