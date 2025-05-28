import mux from "@/app/server/mux/client";
import { StaticRenditionWebhookPayload } from "@/app/server/mux/types";
import { parseStatus } from "@/app/server/mux/utils";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { UnwrapWebhookEvent } from "@mux/mux-node/resources/webhooks.mjs";
import { fetchMutation, fetchQuery } from "convex/nextjs";

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

    const { data, type } = (await request.json()) as UnwrapWebhookEvent;
    console.log(`[MUX WEBHOOK] ${type} webhook event received`);

    let video: Doc<"videos"> | null = null;
    if ("passthrough" in data && data.passthrough) {
      video = await fetchQuery(api.videos.getById, {
        videoId: data.passthrough as Id<"videos">,
      });
    }

    switch (type) {
      case "video.asset.created":
        // Only update if the asset is not ready yet.
        if (video?.status === "READY" || data.status === "ready")
          return new Response(null, { status: 200 });

        await fetchMutation(api.videos.updateById, {
          videoId: data.passthrough as Id<"videos">,
          updateData: {
            assetId: data.id,
            status: parseStatus(data.status),
            duration: data.duration,
            publicPlaybackId: data.playback_ids?.find(
              (item: any) => item.policy === "public",
            )?.id,
          },
        });
        break;
      case "video.asset.ready":
        if (video?.status === "READY" || data.status !== "ready")
          return new Response(null, { status: 200 });

        await fetchMutation(api.videos.updateById, {
          videoId: data.passthrough as Id<"videos">,
          updateData: {
            status: parseStatus(data.status),
            duration: data.duration,
            publicPlaybackId: data.playback_ids?.find(
              (item: any) => item.policy === "public",
            )?.id,
          },
        });
        break;
      case "video.asset.static_rendition.created":
      case "video.asset.static_rendition.ready":
        try {
          // Static renditions use a different payload
          if (video?.audioRenditionStatus === "READY" && video?.assetId)
            return new Response(null, { status: 200 });

          const renditionData =
            data as unknown as StaticRenditionWebhookPayload;
          if (!renditionData.asset_id) {
            console.error(
              `[MUX WEBHOOK] Missing asset_id for event ${type}.`,
              renditionData,
            );
            return new Response(null, { status: 200 });
          }
          console.log({ data });

          const asset = await mux.video.assets.retrieve(renditionData.asset_id);

          if (renditionData.resolution !== "audio-only" || !asset?.passthrough)
            return new Response(null, { status: 200 });

          await fetchMutation(api.videos.updateById, {
            videoId: asset?.passthrough as Id<"videos">,
            updateData: {
              audioRenditionStatus: parseStatus(renditionData.status),
            },
          });
        } catch (error) {
          console.error(error);
          return new Response("Webhook error", { status: 200 });
        }
        break;
      default:
        console.log("Ignored Mux webhook event", type);
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error validating Mux webhook", error);
    return new Response("Unauthorized", { status: 200 });
  }
}
