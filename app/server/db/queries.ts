import { db } from "@/app/server/db";
import { userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { MuxVideo, TableTopic } from "@prisma/client";
import { isSameMonth, subMonths } from "date-fns";
import "server-only";
import { GenerateTopicOptions } from "../actions";

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

export async function getUserVideos(
  page: string | number = 1,
  pageSize: number = 10,
) {
  const { user } = await isAuth();

  const skip = (Number(page) - 1) * pageSize;

  const videosPromise = db.muxVideo.findMany({
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

  const totalItemsPromise = db.muxVideo.count({
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

  const videos = await db.muxVideo.findMany({
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

  const count = await db.muxVideo.count({
    where: {
      userId: user.id,
    },
  });

  return count;
}

export async function getUserVideoDurationData() {
  await isAuth();

  const videos = await db.muxVideo.findMany({
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

export async function getUserVideoById(id: MuxVideo["id"]) {
  const { user } = await isAuth();

  const muxVideo = await db.muxVideo.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      transcript: true,
      report: true,
    },
  });

  return muxVideo;
}

async function isAuth() {
  const current = await currentUser();
  if (!current?.id) throw new Error("Unauthorized");

  const { user, accountLimits, publicMetadata } = userWithMetadata(current);

  if (!user || !accountLimits) throw new Error("Missing user data");

  return { user, accountLimits, publicMetadata };
}
