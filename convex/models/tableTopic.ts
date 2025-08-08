import { WithoutSystemFields } from "convex/server";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import * as Users from "./user";

export async function createTopic(
  ctx: MutationCtx,
  args: Pick<WithoutSystemFields<Doc<"tableTopics">>, "theme" | "difficulty">,
) {
  const user = await Users.getCurrentUserOrThrow(ctx);
  const theme = args.theme ?? "GENERAL";
  const difficulty = args.difficulty ?? "BEGINNER";

  const topicId = await ctx.db.insert("tableTopics", {
    theme,
    difficulty,
  });

  await ctx.scheduler.runAfter(0, internal.actions.openai.createTableTopic, {
    topicId,
    theme,
    difficulty,
    userId: user._id,
  });

  return topicId;
}

export async function getTopic(ctx: QueryCtx, topicId: Id<"tableTopics">) {
  return await ctx.db.get(topicId);
}

export async function updateTopic(
  ctx: MutationCtx,
  topicId: Id<"tableTopics">,
  topic: NonNullable<Doc<"tableTopics">["topic"]>,
) {
  await ctx.db.patch(topicId, { topic });
}
