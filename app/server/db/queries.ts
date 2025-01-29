import { db } from "@/app/server/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma, Video } from "@prisma/client";
import "server-only";
import { deleteVideoById } from "../cloudflare-actions";
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

export async function setUserVideo({
  cloudflareId,
  tableTopicId,
}: {
  cloudflareId: Video["cloudflareId"];
  tableTopicId: Video["tableTopicId"];
}) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const video = await db.video.create({
    data: {
      cloudflareId,
      tableTopicId,
      userId: user.userId,
    },
  });

  return video;
}

export async function getUserVideos() {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const videos = await db.video.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      tableTopic: true,
    },
  });

  return videos;
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
