import { deleteVideoById } from "@/app/server/cloudflare-actions";
import { db } from "@/app/server/db";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Error: missing SIGNING_SECRET from Clerk Dashboard");
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);

  try {
    switch (evt.type) {
      case "user.deleted":
        await userDeleted(evt.data.id);
        break;
      default:
        console.log(`No function specified for event type: ${evt.type}`);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Webhook failed", { status: 500 });
  }
}

async function userDeleted(userId: string | undefined) {
  if (!userId) throw new Error("User ID is undefined");

  await db.$transaction(async (prisma) => {
    const videos = await prisma.video.findMany({
      where: {
        userId,
      },
    });

    // Delete videos from DB
    console.log("deleting from DB...");
    await prisma.video.deleteMany({
      where: {
        userId,
      },
    });

    // Delete videos from cloudflare
    console.log("deleting from cloudflare...");
    await Promise.all(
      videos.map((video) => deleteVideoById(video.cloudflareId, userId)),
    );
  });
}
