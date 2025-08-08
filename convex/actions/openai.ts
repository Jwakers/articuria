"use node";

import { v } from "convex/values";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";
import { THEME_MAP } from "../constants";
import {
  DIFFICULTY_OPTIONS,
  difficultyUnion,
  THEME_OPTIONS,
  themeUnion,
} from "../schema";

const apiKey = process.env.OPEN_AI_SECRET_KEY;

const getOpenAIClient = () => {
  if (!apiKey) throw new Error("Missing OpenAI api key");
  return new OpenAI({ apiKey });
};

const scoreSchema = z.object({
  feedback: z.string(),
  score: z.number(),
});

const reportSchema = z.object({
  summary: z.string(),
  shortSummary: z.string(),
  recommendations: z.array(z.string()),
  commendations: z.array(z.string()),
  clarity: scoreSchema,
  creativity: scoreSchema,
  engagement: scoreSchema,
  language: scoreSchema,
  pacing: scoreSchema,
  tone: scoreSchema,
});

type ReportSchema = z.infer<typeof reportSchema>;
type Difficulty = (typeof DIFFICULTY_OPTIONS)[number];
type Theme = (typeof THEME_OPTIONS)[number];
type GenerateTopicOptions = {
  difficulty: Difficulty | undefined;
  theme: Theme | undefined;
};
type GenerateTableTopicArgs = GenerateTopicOptions & {
  topicBlackList?: Doc<"tableTopics">["topic"][];
};

export const createTableTopic = internalAction({
  args: {
    topicId: v.id("tableTopics"),
    difficulty: v.union(difficultyUnion),
    theme: v.union(themeUnion),
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const userTopics = await ctx.runQuery(internal.tableTopics.getUserTopics, {
      userId: args.userId,
    });
    const generatedTopic = await generateTableTopic({
      difficulty: args.difficulty,
      theme: args.theme,
      topicBlackList: userTopics.map((topic) => topic.topic),
    });

    await ctx.runMutation(internal.tableTopics.updateTopic, {
      topicId: args.topicId,
      topic: generatedTopic,
    });
  },
});

export const createTableTopicReport = internalAction({
  args: {
    videoId: v.id("videos"),
    user: v.string(),
  },
  async handler(ctx, args) {
    const { tableTopic, transcript } = await ctx.runQuery(
      internal.videos.getForReport,
      {
        videoId: args.videoId,
      },
    );

    if (!tableTopic || !transcript)
      throw new Error("Missing table topic or transcript");

    const generatedReport = await generateTableTopicReport({
      tableTopic,
      transcript,
    });

    await ctx.runMutation(internal.reports.create, {
      videoId: args.videoId,
      user: args.user,
      ...generatedReport,
    });
  },
});

async function generateTableTopic({
  difficulty,
  theme,
  topicBlackList,
}: GenerateTableTopicArgs) {
  try {
    const client = getOpenAIClient();
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

    const response = await client.responses.create({
      model: "o4-mini",
      input: [
        {
          role: "system",
          content: systemInstruction,
        },
        {
          role: "user",
          content: "Please generate a table topic",
        },
      ],
    });

    if (!response.output_text) throw new Error("Invalid response");

    return response.output_text;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function generateTableTopicReport({
  tableTopic,
  transcript,
}: {
  tableTopic: Doc<"tableTopics">;
  transcript: Doc<"transcripts">;
}) {
  const transcriptData = transcript.data;
  if (!transcriptData) throw new Error("Missing transcript data");
  if (!tableTopic?.topic) throw new Error("Missing table topic data");

  try {
    const client = getOpenAIClient();
    const rules = [
      `You are the toastmaster, tasked with reviewing the provided table topic transcript.`,
      `Your analysis should focus on creativity, clarity, engagement, tone, pacing, and language.`,
      `For each of these aspects, please provide a score from 1 to 10, along with specific feedback.`,
      `The audio duration was ${transcriptData.audio_duration} seconds, the speaking duration was ${transcript.speakingDuration ? (transcript.speakingDuration / 1000).toFixed(2) : "unknown"} seconds, and the words per minute were ${transcript.wordsPerMinute}.`,
      `The topic was "${tableTopic.topic.trim()}" with a difficulty of "${tableTopic.difficulty}" and themes of ${tableTopic.theme}.`,
      `Please aim for specific examples from the transcript to illustrate your points in both the feedback and commendations.`,
      `Please refer to the user in 2nd person for example "You did this well".`,
      `Please offer both constructive feedback for improvement and commendations for what was done well, all while using British English (en-GB).`,
    ];

    const systemInstruction = rules.join(" ");

    // Save audio rendition locally - could come in handy later

    // if (!video.assetId) return { error: "Missing asset ID" };
    // const { audioRendition, playbackId, error } = await getAudioRendition(
    //   video.assetId,
    // );

    // if (error) return { error };
    // if (!audioRendition || !playbackId)
    //   return { error: "Missing audio data" };

    // const res = await ky(
    //   `https://stream.mux.com/${playbackId.id}/${audioRendition.name}`,
    // );

    // const tempDir = os.tmpdir();
    // const buffer = await res.arrayBuffer();
    // const fileName = `${playbackId.id}-${audioRendition.name}`;
    // const filePath = path.join(tempDir, fileName);
    // await fs.promises.writeFile(filePath, Buffer.from(buffer));

    const promptText = `
    Please generate a comprehensive feedback report for the following table topic transcript, taking into account all the instructions provided: ${transcriptData.text}.`;

    const response = await client.responses.parse({
      model: "o4-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: systemInstruction,
            },
          ],
        },
        {
          role: "user",
          content: promptText,
        },
      ],
      text: {
        format: zodTextFormat(reportSchema, "report-schema"),
      },
    });

    try {
      const data = reportSchema.parse(JSON.parse(response.output_text));
      const scoreCategories: (keyof ReportSchema)[] = [
        "clarity",
        "creativity",
        "engagement",
        "language",
        "pacing",
        "tone",
      ];

      const scores = scoreCategories.map(
        (category) => (data[category] as ReportSchema["clarity"]).score,
      );
      const total = scores.reduce((sum, score) => sum + score, 0);
      const average = total / scores.length;
      const averageScore = parseFloat(average.toFixed(1));

      return {
        averageScore,
        clarity: data.clarity?.feedback,
        clarityScore: data.clarity?.score,
        commendations: data.commendations,
        creativity: data.creativity?.feedback,
        creativityScore: data.creativity?.score,
        engagement: data.engagement?.feedback,
        engagementScore: data.engagement?.score,
        language: data.language?.feedback,
        languageScore: data.language?.score,
        pacing: data.pacing?.feedback,
        pacingScore: data.pacing?.score,
        recommendations: data.recommendations,
        shortSummary: data.shortSummary,
        summary: data.summary,
        tone: data.tone?.feedback,
        toneScore: data.tone?.score,
      };
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.error("Problematic Response Text:", response.text);
      throw parseError;
    }
  } catch (error) {
    console.error("Error generating feedback:", error);
    throw error;
  }
}
