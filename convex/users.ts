import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, query, QueryCtx } from "./_generated/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes: Omit<Doc<"users">, "_id" | "_creationTime"> = {
      firstName: data.first_name ?? undefined,
      lastName: data.last_name ?? undefined,
      clerkId: data.id,
      email: data.email_addresses[0]?.email_address,
      image: data.image_url,
      subscription:
        data.public_metadata?.subscription === "pro" ? "PRO" : "FREE",
      stripeCustomerId:
        (data.public_metadata?.stripeCustomerId as string) ?? undefined,
      subscriptionData: data.public_metadata?.subscriptionData ?? undefined,
    };

    const user = await userByClerkId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

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

async function userByClerkId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", externalId))
    .unique();
}
