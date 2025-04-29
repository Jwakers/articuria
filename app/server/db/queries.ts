import { db } from "@/app/server/db";
import { ERROR_CODES } from "@/lib/constants";
import { userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma, TableTopic, Video } from "@prisma/client";
import { isSameMonth, subMonths } from "date-fns";
import "server-only";
import { GenerateTopicOptions } from "../actions";
import {
  deleteVideoById,
  getVideoById,
  getVideoUploadUrl,
  uploadVideoToCloudflare,
} from "../cloudflare-actions";

const TRANSACTION_TIMEOUT_MS = 10000;

type CreateAiTableTopicOptions = GenerateTopicOptions & {
  topic: TableTopic["topic"];
};

export async function createAiTableTopic({
  difficulty,
  theme,
  topic,
}: CreateAiTableTopicOptions) {
  await isAuth();
  const existingSimilarTopics = await db.tableTopic.findMany({
    where: {
      difficulty,
      themes: {
        has: theme,
      },
      topic,
    },
  });

  if (existingSimilarTopics.length) {
    console.log(
      `Similar topic exists. Existing: ${existingSimilarTopics[0].topic}. Generated: ${topic}`,
    );
    const [first] = existingSimilarTopics;
    return first;
  }

  const newTopic = await db.tableTopic.create({
    data: {
      topic,
      difficulty,
      themes: theme ? [theme] : undefined,
    },
  });
  return newTopic;
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
  const { user, accountLimits } = await isAuth();

  const videoCount = await db.video.count({
    where: { userId: user.id },
  });

  const video = await db.$transaction(
    async (prisma) => {
      if (videoCount >= accountLimits.tableTopicLimit) {
        throw new Error(
          "You have reached your account limit for table topics. Upgrade your account or delete some videos to save more.",
          { cause: ERROR_CODES.reachedVideoLimit },
        );
      }

      const { uploadURL, uid } = await getVideoUploadUrl({ title });

      if (!uploadURL) throw new Error("Unable to get upload URL");
      if (!uid) throw new Error("Could not get video ID");

      await uploadVideoToCloudflare(uploadURL, formData);

      const videoData = await prisma.video.create({
        data: {
          cloudflareId: uid,
          tableTopicId,
          userId: user.id,
        },
      });

      return videoData;
    },
    {
      timeout: TRANSACTION_TIMEOUT_MS,
    },
  );

  return video;
}

export async function getUserVideos(
  page: string | number = 1,
  pageSize: number = 10,
) {
  const { user } = await isAuth();

  const skip = (Number(page) - 1) * pageSize;

  const videosPromise = db.video.findMany({
    where: {
      userId: user.id,
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
      userId: user.id,
    },
  });

  const [videos, totalItems] = await Promise.all([
    videosPromise,
    totalItemsPromise,
  ]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return { videos, totalPages, currentPage: Number(page) };
}

export async function getUserVideoDetails() {
  const { user } = await isAuth();

  const videos = await db.video.findMany({
    select: {
      createdAt: true,
    },
    where: {
      userId: user.id,
    },
  });

  const { length: countThisMonth } = videos.filter((video) =>
    isSameMonth(video.createdAt, new Date()),
  );

  return {
    videoCount: videos.length,
    countThisMonth,
  };
}

export async function getUserVideoCount() {
  const { user } = await isAuth();

  const count = await db.video.count({
    where: {
      userId: user.id,
    },
  });

  return count;
}

export async function getUserVideoDurationData() {
  await isAuth();

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
    isSameMonth(subMonths(new Date(), 1), video.createdAt),
  );
  const thisMonthsVideos = videos.filter((video) =>
    isSameMonth(new Date(), video.createdAt),
  );
  const averageDuration = getAverage(videos);
  const lastMonthAverageDuration = getAverage(lastMonthsVideos);
  const totalDuration = videos.reduce((acc, cur) => (acc += cur.duration!), 0);
  const thisMonthsTotalDuration = thisMonthsVideos.reduce(
    (acc, cur) => (acc += cur.duration!),
    0,
  );

  return {
    totalDuration,
    thisMonthsTotalDuration,
    averageDuration,
    lastMonthAverageDuration,
  };
}

export async function getUserVideoById(id: Video["id"]) {
  const { user } = await isAuth();

  let video = await db.video.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      tableTopic: true,
    },
  });

  if (
    video &&
    (!video?.readyToStream ||
      video?.duration === null ||
      video?.duration === undefined)
  ) {
    const cloudflareVideo = await getVideoById(video.cloudflareId);

    if (!cloudflareVideo.readyToStream) return video;
    video = await _updateUserVideoReadyState(
      video.id,
      cloudflareVideo.readyToStream,
      cloudflareVideo.duration,
    );
  }

  return video;
}

async function _updateUserVideoReadyState(
  id: Video["id"],
  readyToStream: boolean | undefined,
  duration: number | undefined,
) {
  const video = await db.video.update({
    where: {
      id,
    },
    data: {
      readyToStream,
      duration,
    },
    include: {
      tableTopic: true,
    },
  });
  return video;
}

export async function deleteUserVideoById(id: Video["id"]) {
  const { user } = await isAuth();

  const deletedVideo = await db.$transaction(async (prisma) => {
    const deletedVideo = await prisma.video.delete({
      where: {
        id,
        userId: user.id,
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
  const current = await currentUser();
  if (!current?.id) throw new Error("Unauthorized");

  const { user, accountLimits, publicMetadata } = userWithMetadata(current);

  if (!user || !accountLimits) throw new Error("Missing user data");

  return { user, accountLimits, publicMetadata };
}
