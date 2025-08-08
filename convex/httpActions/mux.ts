import { Id } from "../_generated/dataModel";

import { UnwrapWebhookEvent } from "@mux/mux-node/resources/webhooks.mjs";
import { internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";
import { httpAction } from "../_generated/server";
import { parseStatus } from "../utils";
import { StaticRenditionWebhookPayload } from "./types";

// Note must send a 2** status code or Mux will retry for 24hrs
export const muxWebhookHandler = httpAction(async (ctx, request) => {
  try {
    const isValid = await verifyWebhook(request);

    if (!isValid) throw new Error("Invalid webhook signature");

    const { data, type } = (await request.json()) as UnwrapWebhookEvent;
    console.log(`[MUX WEBHOOK] ${type} webhook event received`);

    let video: Doc<"videos"> | null = null;
    if ("passthrough" in data && data.passthrough) {
      video = await ctx.runQuery(internal.videos.getById, {
        videoId: data.passthrough as Id<"videos">,
      });
    }

    switch (type) {
      case "video.asset.created":
        // Only update if the asset is not ready yet.
        if (video?.status === "READY")
          return new Response(null, { status: 200 });

        if (!data.passthrough) {
          console.error(`[MUX WEBHOOK] Missing passthrough for event ${type}`);
          return new Response(null, { status: 200 });
        }

        await ctx.runMutation(internal.videos.updateById, {
          videoId: data.passthrough as Id<"videos">,
          updateData: {
            assetId: data.id,
            status: parseStatus(data.status),
            duration: data.duration,
            publicPlaybackId: data.playback_ids?.find(
              (item) => item.policy === "public",
            )?.id,
          },
        });
        break;
      case "video.asset.ready":
        if (video?.status === "READY" || data.status !== "ready")
          return new Response(null, { status: 200 });

        if (!data.passthrough) {
          console.error(`[MUX WEBHOOK] Missing passthrough for event ${type}`);
          return new Response(null, { status: 200 });
        }

        await ctx.runMutation(internal.videos.updateById, {
          videoId: data.passthrough as Id<"videos">,
          updateData: {
            status: parseStatus(data.status),
            duration: data.duration,
            publicPlaybackId: data.playback_ids?.find(
              (item) => item.policy === "public",
            )?.id,
          },
        });
        break;
      case "video.asset.deleted":
        // Needed if the video is deleted directly from MUX
        if (!data.passthrough) {
          console.error(`[MUX WEBHOOK] Missing passthrough for event ${type}`);
          return new Response(null, { status: 200 });
        }
        try {
          await ctx.runMutation(internal.videos.deleteById, {
            videoId: data.passthrough as Id<"videos">,
          });
        } catch (error) {
          console.log(error);
          return new Response("[MUX WEBHOOK] Video already deleted", {
            status: 200,
          });
        }
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

          const asset = await ctx.runAction(internal.actions.mux.getAssetData, {
            assetId: renditionData.asset_id,
          });

          if (renditionData.resolution !== "audio-only" || !asset?.passthrough)
            return new Response(null, { status: 200 });

          await ctx.runMutation(internal.videos.updateById, {
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
    console.error("[MUX WEBHOOK] Error", error);
    return new Response("Unauthorized", { status: 200 });
  }
});

async function verifyWebhook(request: Request) {
  const rawBody = await request.clone().text();
  const header = request.headers.get("mux-signature");
  const secret = process.env.MUX_WEBHOOK_SIGNING_SECRET;

  if (!header || !secret) return false;

  // Step 1: Extract timestamp and signature correctly
  const parts = header.split(",");
  let timestamp = "";
  let v1Signature = "";

  for (const part of parts) {
    if (part.startsWith("t=")) {
      timestamp = part.substring(2); // Remove "t=" prefix
    } else if (part.startsWith("v1=")) {
      v1Signature = part.substring(3); // Remove "v1=" prefix
    }
  }

  if (!timestamp || !v1Signature) return false;

  // Step 2: Prepare the signed payload
  const signedPayload = timestamp + "." + rawBody;

  try {
    // Step 3: Generate expected signature
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["sign"],
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(signedPayload),
    );

    // Convert signature to hex
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Step 4: Compare signatures (timing-safe)
    if (!timingSafeEqual(expectedSignature, v1Signature)) {
      return false;
    }

    // Check timestamp tolerance (convert timestamp to milliseconds)
    const webhookTime = parseInt(timestamp) * 1000; // Convert seconds to milliseconds
    const now = Date.now();
    const tolerance = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (Math.abs(now - webhookTime) > tolerance) {
      console.warn("Webhook timestamp outside tolerance window");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Webhook verification error:", error);
    return false;
  }
}

// Timing-safe string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
