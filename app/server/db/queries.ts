import { db } from "@/app/server/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma, Video } from "@prisma/client";
import "server-only";
import { deleteVideoById, getVideoUploadUrl } from "../cloudflare-actions";
import topics from "./topics.json";

export async function getRandomTableTopic() {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const topic = await db.tableTopic.upsert({
    where: {
      topic: randomTopic,
    },
    update: {},
    create: {
      topic: randomTopic,
    },
  });

  return topic;
}

export async function createUserVideo({
  tableTopicId,
  title,
  formData,
}: {
  tableTopicId: Video["tableTopicId"];
  title: string;
  formData: FormData;
}) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const video = await db.$transaction(async (prisma) => {
    const { uploadURL, uid } = await getVideoUploadUrl({ title });

    if (!uploadURL) throw new Error("Unable to get upload URL");
    if (!uid) throw new Error("Could not get video ID");

    const res = await fetch(uploadURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!res.ok) throw new Error(`Video upload failed: ${res.status}`);

    const videoData = await prisma.video.create({
      data: {
        cloudflareId: uid,
        tableTopicId,
        userId: user.userId,
      },
    });

    return videoData;
  });

  return video;
}

export async function getUserVideos({ cursor }: { cursor?: number } = {}) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const videos = await db.video.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      tableTopic: true,
    },
    take: 10,
    skip: cursor ? 1 : 0, // Skip the cursor
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  const nextCursor = videos.length > 0 ? videos[videos.length - 1].id : null;

  return { videos, nextCursor };
}

export async function getUserVideoById(id: Video["id"]) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const video = await db.video.findFirst({
    where: {
      id,
      userId: user.userId,
    },
    include: {
      tableTopic: true,
    },
  });

  return video;
}

export async function deleteUserVideoById(id: Video["id"]) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const deletedVideo = await db.$transaction(async (prisma) => {
    const deletedVideo = await prisma.video.delete({
      where: {
        id,
        userId: user.userId,
      },
    });

    await deleteVideoById(deletedVideo.cloudflareId);

    return deletedVideo;
  });

  return deletedVideo;
}

export type VideoWithTopic = Prisma.VideoGetPayload<{
  include: { tableTopic: true };
}>;
