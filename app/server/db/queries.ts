import { db } from "@/app/server/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma, Video } from "@prisma/client";
import { isSameMonth, subMonths } from "date-fns";
import "server-only";
import { deleteVideoById, getVideoUploadUrl } from "../cloudflare-actions";
import topics from "./topics.json";

export async function getRandomTableTopic() {
  await isAuth();

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
  const user = await isAuth();

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

export async function getUserVideos(
  page: string | number = 1,
  pageSize: number = 10
) {
  const user = await isAuth();

  const skip = (Number(page) - 1) * pageSize;

  const videosPromise = db.video.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      tableTopic: true,
    },
    take: pageSize,
    skip,
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalItemsPromise = db.video.count({
    where: {
      userId: user.userId,
    },
  });

  const [videos, totalItems] = await Promise.all([
    videosPromise,
    totalItemsPromise,
  ]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return { videos, totalPages, currentPage: Number(page) };
}

export async function getUserVideoCount() {
  const user = await isAuth();

  const videos = await db.video.findMany({
    select: {
      createdAt: true,
    },
    where: {
      userId: user.userId,
    },
  });

  const { length: countThisMonth } = videos.filter((video) =>
    isSameMonth(video.createdAt, new Date())
  );

  return {
    videoCount: videos.length,
    countThisMonth,
  };
}

export async function getUserVideoDurationData() {
  const user = await isAuth();

  const videos = await db.video.findMany({
    where: {
      duration: {
        not: null,
      },
    },
    select: {
      duration: true,
      createdAt: true,
    },
  });

  const getAverage = (data: typeof videos) => {
    const average = data.reduce((acc, cur) => (acc += cur.duration!), 0);

    return Math.round(average / data.length);
  };

  const lastMonthsVideos = videos.filter((video) =>
    isSameMonth(subMonths(new Date(), 1), video.createdAt)
  );
  const thisMonthsVideos = videos.filter((video) =>
    isSameMonth(new Date(), video.createdAt)
  );
  const averageDuration = getAverage(videos);
  const lastMonthAverageDuration = getAverage(lastMonthsVideos);
  const totalDuration = videos.reduce((acc, cur) => (acc += cur.duration!), 0);
  const thisMonthsTotalDuration = thisMonthsVideos.reduce(
    (acc, cur) => (acc += cur.duration!),
    0
  );

  return {
    totalDuration,
    thisMonthsTotalDuration,
    averageDuration,
    lastMonthAverageDuration,
  };
}

export async function getUserVideoById(id: Video["id"]) {
  const user = await isAuth();

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
  const user = await isAuth();

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

async function isAuth() {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  return user;
}
