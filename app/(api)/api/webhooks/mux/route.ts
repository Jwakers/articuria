import { db } from "@/app/server/db";
import mux from "@/app/server/mux/mux-client";
import { StaticRenditionWebhookPayload } from "@/app/server/mux/types";
import { parseStatus } from "@/app/server/mux/utils";
import { UnwrapWebhookEvent } from "@mux/mux-node/resources/webhooks.mjs";

const webhookSecret = process.env.MUX_WEBHOOK_SIGNING_SECRET!;

if (!webhookSecret) {
  console.error("[MUX WEBHOOK] Missing signing secret");
  throw new Error("MUX webhook signing secret not configured");
}

// Note must send a 2** status code or Mux will retry for 24hrs
export async function POST(request: Request) {
  const rawBody = await request.clone().text();

  try {
    mux.webhooks.verifySignature(rawBody, request.headers, webhookSecret);
  } catch (error) {
    console.error(error);
    console.error("[MUX WEBHOOK] Invalid signature");

    return new Response("Invalid signature", {
      status: 200,
    });
  }

  const { data, type } = (await request.json()) as UnwrapWebhookEvent;

  console.log(`[MUX WEBHOOK] ${type} webhook event received`);

  if (!data) {
    return new Response("Payload was empty", { status: 200 });
  }

  if (type === "video.asset.created") {
    console.log(data.meta?.external_id);
    // Only update if the asset is not ready yet.
    // Safeguards against webhook events arriving out of order
    await db.muxVideo.updateMany({
      where: {
        id: data.passthrough,
        status: {
          not: "READY",
        },
      },
      data: {
        assetId: data.id,
        status: parseStatus(data.status),
        duration: data.duration,
        publicPlaybackId: data.playback_ids?.find(
          (item) => item.policy === "public",
        )?.id,
      },
    });
  }

  if (type === "video.asset.ready") {
    await db.muxVideo.update({
      where: {
        id: data.passthrough,
      },
      data: {
        assetId: data.id,
        status: parseStatus(data.status),
        duration: data.duration,
        publicPlaybackId: data.playback_ids?.find(
          (item) => item.policy === "public",
        )?.id,
      },
    });
  }

  if (type === "video.asset.static_rendition.created") {
    try {
      // Static renditions use a different payload
      const renditionData = data as unknown as StaticRenditionWebhookPayload;
      if (!renditionData.asset_id) {
        console.error(
          `[MUX WEBHOOK] Missing asset_id for event ${type}.`,
          renditionData,
        );
        return new Response("Webhook received");
      }
      const asset = await mux.video.assets.retrieve(renditionData.asset_id);

      if (renditionData.resolution !== "audio-only" || !asset?.passthrough)
        return new Response("Webhook received");

      // updateMany to avoid prisma throwing an error if it cant find given the where condition
      await db.muxVideo.updateMany({
        where: {
          id: asset?.passthrough,
          audioRenditionStatus: {
            not: "READY",
          },
        },
        data: {
          audioRenditionStatus: parseStatus(renditionData.status),
        },
      });
    } catch (error) {
      console.error(error);
      return new Response("Webhook error", { status: 200 });
    }
  }

  if (type === "video.asset.static_rendition.ready") {
    try {
      const renditionData = data as unknown as StaticRenditionWebhookPayload;
      if (!renditionData.asset_id) {
        console.error(
          `[MUX WEBHOOK] Missing asset_id for event ${type}.`,
          renditionData,
        );
        return new Response("Webhook received");
      }
      const asset = await mux.video.assets.retrieve(renditionData.asset_id);

      if (renditionData.resolution !== "audio-only" || !asset?.passthrough)
        return new Response("Webhook received");

      // updateMany to avoid prisma throwing an error if it cant find given the where condition
      await db.muxVideo.update({
        where: {
          id: asset?.passthrough,
        },
        data: {
          audioRenditionStatus: parseStatus(renditionData.status),
        },
      });
    } catch (error) {
      console.error(error);
      return new Response("Webhook error", { status: 200 });
    }
  }

  return new Response("Webhook received");
}
