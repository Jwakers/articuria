"use server";

import { THEME_MAP } from "@/lib/constants";
import { GoogleGenAI } from "@google/genai";
import { TableTopic } from "@prisma/client";
import { GenerateTopicOptions } from "./actions";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

type GenerateTableTopicArgs = GenerateTopicOptions & {
  topicBlackList?: TableTopic["topic"][];
};

export async function generateTableTopic({
  difficulty,
  theme,
  topicBlackList,
}: GenerateTableTopicArgs) {
  try {
    const rules = [
      "You are the toastmaster",
      "You will generate 1 table topic when asked",
      "These are topics used in toastmasters meetings",
      "The response should not contain formatting or markdown, just plain text.",
      "Return the topic and nothing else",
      "Use British English (en-GB) for all responses",
    ];

    if (difficulty)
      rules.push(
        `The topic should be of ${difficulty.toLowerCase()} difficulty`,
      );
    if (theme && theme !== "GENERAL")
      rules.push(`The theme of the topic should be ${THEME_MAP[theme]}`);

    if (topicBlackList?.length) {
      const blackList = topicBlackList.map((topic) => `"${topic}"`).join(", ");
      rules.push(`Avoid these or any very similar topics: ${blackList}`);
    }

    const systemInstruction = rules.join(". ");
    console.log(systemInstruction);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Please generate a table topic",
      config: {
        systemInstruction,
      },
    });

    if (!response.text) throw new Error("Invalid response");

    return response.text;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
