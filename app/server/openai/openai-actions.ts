"use server";

import { THEME_MAP } from "@/lib/constants";
import { userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { TableTopic } from "@prisma/client";
import { Transcript } from "assemblyai";
import ky from "ky";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { GenerateTopicOptions } from "../actions";
import { db } from "../db";
import { getUserVideoById } from "../db/queries";
import { getAudioRendition } from "../mux/mux-actions";
import client from "./client";

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

export async function generateTableTopicReport(videoId: string) {
  const { accountLimits } = userWithMetadata(await currentUser());

  if (!accountLimits?.tableTopicReport)
    return {
      data: null,
      error: "You do not have permission to generate a report",
    };

  const video = await getUserVideoById(videoId);

  if (!video?.transcript?.data)
    return { data: null, error: "No video/transcript data provided" };
  const transcriptData = video.transcript.data as Transcript;

  try {
    const rules = [
      `You are the toastmaster, tasked with reviewing the provided table topic transcript.`,
      `Your analysis should focus on creativity, clarity, engagement, tone, pacing, and language.`,
      `For each of these aspects, please provide a score from 1 to 10, along with specific feedback.`,
      `The audio duration was ${transcriptData.audio_duration} seconds, the speaking duration was ${(video.transcript.speakingDuration / 1000).toFixed(2)} seconds, and the words per minute were ${video.transcript.wordsPerMinute}.`,
      `The topic was "${video.tableTopic.topic.trim()}" with a difficulty of "${video.tableTopic.difficulty}" and themes of ${video.tableTopic.themes.join(", ")}.`,
      `Please aim for specific examples from the transcript to illustrate your points in both the feedback and commendations.`,
      `Please refer to the user in 2nd person for example "You did this well".`,
      `Please offer both constructive feedback for improvement and commendations for what was done well, all while using British English (en-GB).`,
    ];

    const systemInstruction = rules.join(" ");

    if (!video.assetId) return { data: null, error: "Missing asset ID" };
    const { audioRendition, playbackId, error } = await getAudioRendition(
      video.assetId,
    );

    if (error) return { data: null, error };
    if (!audioRendition || !playbackId)
      return { data: null, error: "Missing audio data" };

    const res = await ky(
      `https://stream.mux.com/${playbackId.id}/${audioRendition.name}`,
    );

    // Save audio rendition locally - could come in handy later
    // const tempDir = os.tmpdir();
    // const buffer = await res.arrayBuffer();
    // const fileName = `${playbackId.id}-${audioRendition.name}`;
    // const filePath = path.join(tempDir, fileName);
    // await fs.promises.writeFile(filePath, Buffer.from(buffer));

    const promptText = `
    Please generate a comprehensive feedback report for the following table topic transcript, taking into account all the instructions provided: ${JSON.stringify(transcriptData.text)}.`;

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

      const report = await db.report.create({
        data: {
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
          videoId: video.id,
        },
      });

      return {
        data: report,
        error: null,
      };
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.error("Problematic Response Text:", response.text);
      return { data: null, error: "Error parsing the feedback response" };
    }
  } catch (error) {
    console.error("Error generating feedback:", error);
    return { data: null, error: "Error generating feedback" };
  }
}
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
