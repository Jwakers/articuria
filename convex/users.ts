import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, query } from "./_generated/server";
import * as Users from "./models/user";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await Users.getCurrentUser(ctx);
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

    const user = await Users.userByClerkId(ctx, data.id);
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
    const user = await Users.userByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});
