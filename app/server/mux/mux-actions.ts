"use server";

import { userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { MuxVideo, TableTopic } from "@prisma/client";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { getUserVideoById, getUserVideoCount } from "../db/queries";
import mux from "./client";
import { parseStatus } from "./utils";

const origin = `${process.env.NODE_ENV === "production" ? "https" : "http"}://${process.env.NEXT_PUBLIC_APP_URL}`;

export async function getUploadUrl({
  title,
  tableTopicId,
}: {
  title: string;
  tableTopicId: TableTopic["id"];
}) {
  const { user, accountLimits } = userWithMetadata(await currentUser());
  if (!user) throw new Error("Not signed in");
  if (!origin) throw new Error("Origin is not defined");

  const videoCount = await getUserVideoCount();

  if (videoCount >= accountLimits.tableTopicLimit)
    throw new Error("Video upload limit reached for this account");

  const id = randomUUID();

  const data = await db.$transaction(
    async (prisma) => {
      const upload = await mux.video.uploads.create({
        cors_origin: origin,
        new_asset_settings: {
          playback_policy: ["public"],
          video_quality: "basic",
          passthrough: id,
          static_renditions: [
            {
              resolution: "audio-only",
            },
          ],
          meta: {
            title: title.trim(),
            creator_id: user.id,
            external_id: id,
          },
        },
      });

      const video = await prisma.muxVideo.create({
        data: {
          id,
          userId: user.id,
          assetId: upload.asset_id,
          uploadId: upload.id,
          status: parseStatus(upload.status),
          tableTopicId,
        },
      });

      return { upload, video };
    },
    {
      timeout: 10000,
    },
  );

  return data;
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

type UserVideo = Awaited<ReturnType<typeof getUserVideoById>>;

export async function getUpdatedVideo(muxVideo: UserVideo): Promise<UserVideo> {
  const user = await currentUser();

  if (!user?.id) throw new Error("User is not signed in");
  if (!muxVideo) return muxVideo;
  if (!muxVideo.uploadId) {
    console.error("Video does not have an upload ID");
    return muxVideo;
  }

  if (!muxVideo.assetId) {
    const upload = await mux.video.uploads.retrieve(muxVideo.uploadId);

    if (!upload.asset_id) return muxVideo;

    const asset = await mux.video.assets.retrieve(upload.asset_id);

    const video = await db.muxVideo.update({
      where: {
        id: muxVideo.id,
        userId: user.id,
      },
      data: {
        status: parseStatus(asset.status),
        assetId: asset.id,
        publicPlaybackId: asset?.playback_ids?.find(
          (item) => item.policy === "public",
        )?.id,
        audioRenditionStatus: parseStatus(
          asset?.static_renditions?.files?.find(
            (file) => file.resolution === "audio-only",
          )?.status,
        ),
      },
      include: {
        transcript: true,
        report: true,
        tableTopic: true,
      },
    });

    return video;
  }

  const { asset, error } = await getVideoData(muxVideo.assetId);
  if (error) throw new Error(error);

  const video = await db.muxVideo.update({
    where: {
      id: muxVideo.id,
    },
    data: {
      assetId: asset?.id,
      status: parseStatus(asset?.status),
      duration: asset?.duration,
      publicPlaybackId: asset?.playback_ids?.find(
        (item) => item.policy === "public",
      )?.id,
      audioRenditionStatus: parseStatus(
        asset?.static_renditions?.files?.find(
          (file) => file.resolution === "audio-only",
        )?.status,
      ),
    },
    include: {
      transcript: true,
      report: true,
      tableTopic: true,
    },
  });

  return video;
}

export async function deleteAsset(video: MuxVideo) {
  try {
    const user = await currentUser();
    if (!user?.id) throw new Error("User is not signed in");

    await db.$transaction(async (prisma) => {
      if (!video?.assetId) throw new Error("Asset ID is not set");

      await prisma.muxVideo.delete({
        where: {
          userId: user.id,
          id: video.id,
        },
      });
      await mux.video.assets.delete(video.assetId);
    });
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
