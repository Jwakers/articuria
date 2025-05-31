"use node";

import Mux from "@mux/mux-node";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";

const tokenId = process.env.MUX_TOKEN_ID;
const tokenSecret = process.env.MUX_TOKEN_SECRET;

if (!tokenId || !tokenSecret) {
  throw new Error(
    "Missing required Mux API credentials. Please check your environment variables.",
  );
}

const mux = new Mux({
  tokenId,
  tokenSecret,
});

export const updateVideoStatus = internalAction({
  args: {},
  async handler(ctx) {
    const videos = await ctx.runQuery(internal.videos.getIncompleteVideos);

    for (const video of videos) {
      if (!video.uploadId) {
        console.log("No upload ID found for video", video._id);
        continue;
      }

      if (!video.assetId) {
        const upload = await mux.video.uploads.retrieve(video.uploadId);
        if (upload.asset_id) {
          await ctx.runMutation(internal.videos.updateById, {
            videoId: video._id,
            updateData: {
              assetId: upload.asset_id,
            },
          });
        }
        continue;
      }

      const asset = await mux.video.assets.retrieve(video.assetId);

      let status = video.status;
      if (status !== "READY" && asset.status === "errored") {
        status = "ERRORED";
      }
      if (status !== "READY" && asset.status === "ready") {
        status = "READY";
      }

      await ctx.runMutation(internal.videos.updateById, {
        videoId: video._id,
        updateData: {
          assetId: video.assetId ?? asset.id,
          status,
          duration: video.duration ?? asset.duration,
          publicPlaybackId:
            video.publicPlaybackId ??
            asset.playback_ids?.find((item) => item.policy === "public")?.id,
        },
      });

      if (video.audioRenditionStatus === "READY") continue;

      const audioRendition = await getAudioRendition(video.assetId);
      if (!audioRendition) continue;

      let audioStatus: Doc<"videos">["audioRenditionStatus"] = "READY";
      if (audioRendition.status === "errored") audioStatus = "ERRORED";
      if (audioRendition.status !== "ready") audioStatus = "WAITING";

      await ctx.runMutation(internal.videos.updateById, {
        videoId: video._id,
        updateData: {
          audioRenditionStatus: audioStatus,
        },
      });
    }
  },
});

export const getAssetData = internalAction({
  args: { assetId: v.string() },
  async handler(_, args) {
    const asset = await mux.video.assets.retrieve(args.assetId);

    return asset;
  },
});

async function getAudioRendition(assetId: string) {
  const asset = await mux.video.assets.retrieve(assetId);
  const audioRendition = asset?.static_renditions?.files?.find(
    (file) => file.resolution === "audio-only",
  );

  return audioRendition;
}
