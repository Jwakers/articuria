"use server";

import { api } from "@/convex/_generated/api";
import { DIFFICULTY_OPTIONS, THEME_OPTIONS } from "@/convex/schema";
import { fetchMutation } from "convex/nextjs";
import { getAuthToken, getUserServer } from "./auth";
import { generateTableTopic } from "./openai/openai-actions";

type Difficulty = (typeof DIFFICULTY_OPTIONS)[number];
type Theme = (typeof THEME_OPTIONS)[number];

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
    const { user, accountLimits } = await getUserServer();

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

    // const videos = await db.muxVideo.findMany({
    //   select: { tableTopicId: true, tableTopic: { select: { topic: true } } },
    // });

    // const existingTopics = videos.map((item) => item.tableTopic.topic);
    // const existingTopicIds = videos.map((item) => item.tableTopicId);

    // const [topic] = await db.tableTopic.findMany({
    //   take: 10,
    //   where: {
    //     difficulty,
    //     themes: {
    //       has: theme,
    //     },
    //     id: {
    //       notIn: existingTopicIds,
    //     },
    //   },
    // });

    // if (topic) return topic;

    const aiTopic = await generateTableTopic({
      difficulty,
      theme,
      topicBlackList:
        /*existingTopics,*/
        [],
    });

    const topicId = await fetchMutation(
      api.tableTopics.create,
      {
        difficulty,
        theme,
        topic: aiTopic,
      },
      {
        token: await getAuthToken(),
      },
    );

    // const dbTopic = await createAiTableTopic({
    //   difficulty,
    //   theme,
    //   topic: aiTopic,
    // });

    return topicId;
  } catch (error) {
    console.error("Error in getTableTopic:", error);
    // TODO delete the topic from the database
    throw new Error("Failed to get table topic");
  }
}
