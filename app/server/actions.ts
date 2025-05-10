"use server";

import { userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Difficulty, Theme } from "@prisma/client";
import { db } from "./db";
import { createAiTableTopic } from "./db/queries";
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

    if (!accountLimits.tableTopicOptions.difficulty && options.difficulty) {
      throw new Error("Your current plan does not allow setting a difficulty");
    }

    if (!accountLimits.tableTopicOptions.theme && options.theme) {
      throw new Error("Your current plan does not allow setting a theme");
    }
    if (accountLimits.tableTopicOptions.difficulty && options.difficulty)
      difficulty = options.difficulty;
    if (accountLimits.tableTopicOptions.theme && options.theme)
      theme = options.theme;

    const videos = await db.muxVideo.findMany({
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
