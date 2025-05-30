import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { internal } from "../_generated/api";
import { httpAction } from "../_generated/server";

export const clerkWebhookHandler = httpAction(async (ctx, request) => {
  const event = await validateClerkWebhook(request);
  if (!event) {
    return new Response("Error occurred", { status: 400 });
  }
  switch (event.type) {
    case "user.created": // intentional fallthrough
    case "user.updated":
      await ctx.runMutation(internal.users.upsertFromClerk, {
        data: event.data,
      });
      break;

    case "user.deleted": {
      const clerkUserId = event.data.id!;
      await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
      break;
    }
    default:
      console.log("Ignored Clerk webhook event", event.type);
  }

  return new Response(null, { status: 200 });
});

async function validateClerkWebhook(
  req: Request,
): Promise<WebhookEvent | null> {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error(
      "Missing CLERK_WEBHOOK_SECRET env var – cannot validate webhook",
    );
    return null;
  }
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(secret);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}
