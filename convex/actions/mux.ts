"use node";

import Mux from "@mux/mux-node";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { action, internalAction } from "../_generated/server";
import { parseStatus } from "../utils";

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

const CORS_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://www.articuria.com"
    : "http://localhost:3000";

export const upload = action({
  args: {
    tableTopicId: v.id("tableTopics"),
    title: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    //   if (videos.length >= accountLimits.tableTopicLimit)
    //     throw new Error("Video upload limit reached for this account");

    const videoId: Id<"videos"> = await ctx.runMutation(api.videos.create, {
      tableTopicId: args.tableTopicId,
    });

    const upload = await createVideoUpload({
      videoId: videoId,
      title: args.title,
      userId: identity.subject,
    });

    await ctx.runMutation(internal.videos.updateById, {
      videoId: videoId,
      updateData: {
        uploadId: upload.id,
        status: parseStatus(upload.status),
        assetId: upload.asset_id,
      },
    });

    return { upload, videoId };
  },
});

export const getAudio = action({
  args: {
    assetId: v.string(),
  },
  async handler(_, args) {
    const audioRendition = await getAudioRendition(args.assetId);

    return audioRendition;
  },
});

export const deleteAsset = internalAction({
  args: { assetId: v.string() },
  async handler(_, args) {
    await mux.video.assets.delete(args.assetId);
  },
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

      const { audioRendition } = await getAudioRendition(video.assetId);
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

// May use this later for private videos on mux
// async function getVideoToken() {
//   const signingKeyId = process.env.MUX_SIGNING_KEY_ID;
//   const signingSecret = process.env.MUX_SIGNING_KEY_SECRET;

//   if (!signingKeyId || !signingSecret)
//     throw new Error("[MUX] Missing signing env var");

//   const decodedSecret = Buffer.from(signingSecret, "base64").toString("ascii");

//   // Only generate the token if the user has permission
//   const token = jwt.sign(
//     {
//       sub: "playback id",
//       aud: "v",
//       exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
//       kid: signingKeyId,
//     },
//     decodedSecret,
//     { algorithm: "RS256" },
//   );

//   // value used with mux player
//   // <MuxPlayer tokens={{ playback: token }} playbackId="" />

//   return token;
// }

// Helper functions
async function getAudioRendition(assetId: string) {
  const asset = await mux.video.assets.retrieve(assetId);
  const exists = asset.playback_ids?.find((item) => item.policy === "public");

  const playbackId = exists
    ? exists
    : await mux.video.assets.createPlaybackId(assetId ?? "", {
        policy: "public",
      });

  if (!playbackId.id)
    return { audioRendition: null, playbackId: null, error: "No playback ID" };

  const audioRendition = asset?.static_renditions?.files?.find(
    (file) => file.resolution === "audio-only",
  );

  if (!audioRendition)
    return {
      audioRendition: null,
      playbackId: null,
      error: "Audio rendition not found",
    };

  return {
    audioRendition,
    playbackId,
    error: null,
  };
}

async function createVideoUpload({
  videoId,
  title,
  userId,
}: {
  videoId: Id<"videos">;
  title: string;
  userId: string;
}) {
  const upload = await mux.video.uploads.create({
    cors_origin: CORS_ORIGIN,
    new_asset_settings: {
      playback_policy: ["public"],
      video_quality: "basic",
      passthrough: videoId,
      static_renditions: [
        {
          resolution: "audio-only",
        },
      ],
      meta: {
        title: title,
        creator_id: userId,
        external_id: videoId,
      },
    },
  });

  return upload;
}
