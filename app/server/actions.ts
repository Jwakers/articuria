"use server";

import { api } from "@/convex/_generated/api";
import { DIFFICULTY_OPTIONS, THEME_OPTIONS } from "@/convex/schema";
import { fetchMutation } from "convex/nextjs";
import { getAuthToken, getUser } from "./auth";
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
    const { user, accountLimits } = await getUser();

    if (!user) throw new Error("Not signed in");

    let difficulty: Difficulty = "BEGINNER",
      theme: Theme = "GENERAL";

    if (accountLimits.tableTopicOptions.difficulty && options.difficulty)
      difficulty = options.difficulty;
    if (accountLimits.tableTopicOptions.theme && options.theme)
      theme = options.theme;

    // TODO: Check for existing topics the user has already done
    // Or suitable existing topics in the database

    const aiTopic = await generateTableTopic({
      difficulty,
      theme,
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

    return topicId;
  } catch (error) {
    console.error("Error in getTableTopic:", error);
    throw new Error("Failed to get table topic");
  }
}
