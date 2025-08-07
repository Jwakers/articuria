import { QueryCtx } from "../_generated/server";

import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

export async function updateUserTopics(
  ctx: MutationCtx,
  topics: Id<"tableTopics">[],
) {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("User not found");

  const topicSet = new Set([...(user.tableTopics ?? []), ...topics]);

  await ctx.db.patch(user._id, {
    tableTopics: [...topicSet],
  });
}

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }

  return await userByClerkId(ctx, identity.subject);
}

export async function userByClerkId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", externalId))
    .unique();
}
