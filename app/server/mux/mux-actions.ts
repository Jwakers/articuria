"use server";

import { getAuthToken, getUser } from "@/app/server/auth";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { getSiteUrl } from "@/lib/utils";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import jwt from "jsonwebtoken";
import mux from "./client";
import { parseStatus } from "./utils";

const SITE_URL = getSiteUrl();

export async function createVideoUpload({
  title,
  tableTopicId,
}: {
  title: string;
  tableTopicId: Id<"tableTopics">;
}) {
  const { user, accountLimits } = await getUser();
  if (!user) throw new Error("Not signed in");

  const videos = await fetchQuery(
    api.videos.list,
    {},
    {
      token: await getAuthToken(),
    },
  );

  if (videos.length >= accountLimits.tableTopicLimit)
    throw new Error("Video upload limit reached for this account");

  // Create a new video
  const videoId = await fetchMutation(
    api.videos.create,
    {
      tableTopicId,
    },
    {
      token: await getAuthToken(),
    },
  );

  const upload = await mux.video.uploads.create({
    cors_origin: SITE_URL,
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
        title: title.trim(),
        creator_id: user._id,
        external_id: videoId,
      },
    },
  });

  // update the video with the upload id
  await fetchMutation(
    api.videos.update,
    {
      videoId,
      updateData: {
        uploadId: upload.id,
        status: parseStatus(upload.status),
        assetId: upload.asset_id,
      },
    },
    {
      token: await getAuthToken(),
    },
  );

  return { upload, videoId };
}

export async function getVideoData(assetId: string) {
  try {
    const asset = await mux.video.assets.retrieve(assetId);

    return { asset, error: null };
  } catch (error) {
    console.error(error);
    return { asset: null, error: "Error fetching asset data" };
  }
}

export async function getUploadData(uploadId: string) {
  try {
    const upload = await mux.video.uploads.retrieve(uploadId);

    return { upload, error: null };
  } catch (error) {
    console.error(error);
    return { upload: null, error: "Error fetching upload data" };
  }
}

export async function deleteAsset(video: Doc<"videos">) {
  try {
    const { user } = await getUser();
    if (!user?._id) throw new Error("User is not signed in");

    if (!video?.assetId) throw new Error("Asset ID is not set");

    // TODO: temporary, will be easier to check when this is a convex actions
    if (video.user.split("|")[1] !== user.clerkId) {
      throw new Error("Cannot delete another user's video");
    }

    await mux.video.assets.delete(video.assetId);
    await fetchMutation(
      api.videos.deleteById,
      {
        videoId: video._id,
      },
      {
        token: await getAuthToken(),
      },
    );
  } catch (error) {
    console.error(error);
    throw new Error("Unable to delete video");
  }
}

export async function getAudioRendition(assetId: string) {
  const asset = await mux.video.assets.retrieve(assetId);
  const playbackId = await mux.video.assets.createPlaybackId(assetId ?? "", {
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

export async function getVideoToken() {
  const signingKeyId = process.env.MUX_SIGNING_KEY_ID;
  const signingSecret = process.env.MUX_SIGNING_KEY_SECRET;

  if (!signingKeyId || !signingSecret)
    throw new Error("[MUX] Missing signing env var");

  const decodedSecret = Buffer.from(signingSecret, "base64").toString("ascii");

  // Only generate the token if the user has permission
  const token = jwt.sign(
    {
      sub: "playback id",
      aud: "v",
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
      kid: signingKeyId,
    },
    decodedSecret,
    { algorithm: "RS256" },
  );

  // value used with mux player
  // <MuxPlayer tokens={{ playback: token }} playbackId="" />

  return token;
}
