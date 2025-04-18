import Cloudflare from "cloudflare";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// pnpm dlx tsx scripts/create-cloudflare-webhook.ts

const cloudflareClient = new Cloudflare({
  apiKey: process.env.CLOUDFLARE_API_TOKEN,
});

const notificationUrl =
  process.env.NODE_ENV === "production"
    ? "https://www.articuria.com/api/webhooks/cloudflare"
    : "https://a497-92-238-170-122.ngrok-free.app/api/webhooks/cloudflare";

async function createWebhook() {
  try {
    const webhook = await cloudflareClient.stream.webhooks.update({
      account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
      notificationUrl,
    });

    return console.log(webhook);
  } catch (error) {
    console.error("Failed to get webhook:", error);
  }
}
createWebhook();
