import { db } from "@/app/server/db";
import Cloudflare from "cloudflare";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// pnpm dlx tsx scripts/backfill-video-durations.ts

const cloudflareClient = new Cloudflare({
  apiKey: process.env.CLOUDFLARE_API_TOKEN,
});

async function backfillDurations() {
  const videos = await db.video.findMany({
    where: {
      duration: null || 0,
    },
  });

  for (const video of videos) {
    try {
      const cloudflareVideo = await cloudflareClient.stream.get(
        video.cloudflareId,
        { account_id: process.env.CLOUDFLARE_ACCOUNT_ID! }
      );

      await db.video.update({
        where: { id: video.id },
        data: { duration: cloudflareVideo.duration },
      });

      console.log(`Updated duration for video ${video.id}`);
    } catch (error) {
      console.error(`Failed to update video ${video.id}:`, error);
    }
  }
}
backfillDurations();
