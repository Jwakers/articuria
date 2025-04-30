"use server";

import { userWithMetadata, validateFile } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Difficulty, Theme, Video } from "@prisma/client";
import { db } from "./db";
import {
  createAiTableTopic,
  createUserVideo,
  deleteUserVideoById,
} from "./db/queries";
import { generateTableTopic } from "./google-ai";

export type GenerateTopicOptions = {
  difficulty: Difficulty | undefined;
  theme: Theme | undefined;
};

export async function getTableTopic(
  options: GenerateTopicOptions = {
    difficulty: "BEGINNER",
    theme: "GENERAL",
  },
) {
  try {
    const { user, accountLimits } = userWithMetadata(await currentUser());

    if (!user) throw new Error("Not signed in");

    let difficulty: Difficulty = "BEGINNER",
      theme: Theme = "GENERAL";

    // Should throw an error here to prevent undesirable access to the API
    if (!accountLimits.tableTopicOptions.difficulty && options.difficulty) {
    } // Here
    if (accountLimits.tableTopicOptions.difficulty && options.difficulty)
      difficulty = options.difficulty;
    // Should throw an error here to prevent undesirable access to the API
    if (accountLimits.tableTopicOptions.theme && options.theme)
      theme = options.theme;

    const videos = await db.video.findMany({
      select: { tableTopicId: true, tableTopic: { select: { topic: true } } },
    });
    const existingTopics = videos.map((item) => item.tableTopic.topic);
    const existingTopicIds = videos.map((item) => item.tableTopicId);

    const [topic] = await db.tableTopic.findMany({
      take: 10,
      where: {
        difficulty,
        themes: {
          has: theme,
        },
        id: {
          notIn: existingTopicIds,
        },
      },
    });

    if (topic) return topic;

    const aiTopic = await generateTableTopic({
      difficulty,
      theme,
      topicBlackList: existingTopics,
    });

    const dbTopic = await createAiTableTopic({
      difficulty,
      theme,
      topic: aiTopic,
    });

    return dbTopic;
  } catch (error) {
    console.error("Error in getTableTopic:", error);
    throw new Error("Failed to get table topic");
  }
}

export async function createVideo({
  tableTopicId,
  title,
  formData,
}: {
  tableTopicId: Video["tableTopicId"];
  title: string;
  formData: FormData;
}) {
  const file = formData.get("file") as File | null;
  const { user, accountLimits } = userWithMetadata(await currentUser());

  if (!file) throw new Error("No file found");
  if (!user) throw new Error("Not signed in");

  validateFile({ file, isServer: true, accountLimits });

  const video = await createUserVideo({
    tableTopicId,
    title,
    formData,
  });

  return video;
}

export async function deleteVideo(id: Video["id"]) {
  const video = await deleteUserVideoById(id);

  return video;
}
