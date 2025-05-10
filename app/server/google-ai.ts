"use server";

import { THEME_MAP } from "@/lib/constants";
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { TableTopic, Video } from "@prisma/client";
import { Transcript } from "assemblyai";
import { GenerateTopicOptions } from "./actions";
import { db } from "./db";
import { getUserVideoById } from "./db/queries";

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

// AI-Generated Review:
// - Send transcript to Google AI (or similar) with:
// - The intended topic
// - The full transcript text
// - Filler word count
// - Words per minute (pacing)
// - Sentiment data

// AI returns a topic-specific review focused on:
// - Clarity
// - Engagement
// - Tone
// - Speaking pace
// - Use of filler words
// - Grammar
// - Score all of these from one to 10 and return an average

const SCORE_PARAMETERS = [
  "creativity",
  "clarity",
  "engagement",
  "tone",
  "pacing",
  "language",
];

const SCORE_SCHEMA = SCORE_PARAMETERS.reduce<Record<string, Schema>>(
  (acc, key) => {
    acc[key] = {
      type: Type.OBJECT,
      properties: {
        feedback: {
          type: Type.STRING,
          description: `Feedback on ${key}`,
          nullable: false,
        },
        score: {
          type: Type.INTEGER,
          description: `Score for ${key} from 1 to 10`,
          nullable: false,
        },
      },
    };
    return acc;
  },
  {},
);

export async function generateTopicReport(videoId: Video["id"]) {
  const video = await getUserVideoById(videoId);
  console.log(video);
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
      `Please refer to the user in 2nd person for example "You did this well"`,
      `Please offer both constructive feedback for improvement and commendations for what was done well, all while using British English (en-GB).`,
    ];

    // TODO logic to check user permissions or if they have used their one free report yet

    const systemInstruction = rules.join(" ");

    console.log(systemInstruction);

    // Run this by an ai model to ask for improvements
    // Save to DB and perform checks
    // Create partial type from JSON schema
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Please generate a comprehensive feedback report for the following table topic transcript, taking into account all the instructions provided: "${transcriptData.text}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "All feedback of the table topic",
              nullable: false,
            },
            shortSummary: {
              type: Type.STRING,
              description: "A shorter summary of the topic feedback",
              nullable: false,
            },
            recommendations: {
              type: Type.ARRAY,
              nullable: false,
              items: {
                type: Type.STRING,
                description:
                  "Actionable recommendations on how the user might improve for their next topics",
                nullable: false,
              },
            },
            commendations: {
              type: Type.ARRAY,
              nullable: false,
              items: {
                type: Type.STRING,
                description: "Commendations on what the user did well",
                nullable: false,
              },
            },
            averageScore: {
              type: Type.INTEGER,
              description: "The average score based on the individual scores",
              nullable: false,
            },
            ...SCORE_SCHEMA,
          },
        },
      },
    });

    if (!response.text)
      return { data: null, error: "Server error. No feedback was generated" };

    const data = JSON.parse(response.text) as TableTopicReportResponseData;

    const report = await db.report.create({
      data: {
        averageScore: data.averageScore,
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
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error generating feedback" };
  }
}

export type TableTopicReportResponseData = Partial<{
  averageScore: number;
  clarity: {
    feedback: string;
    score: number;
  };
  commendations: string[];
  creativity: {
    feedback: string;
    score: number;
  };
  engagement: {
    feedback: string;
    score: number;
  };
  language: {
    feedback: string;
    score: number;
  };
  pacing: {
    feedback: string;
    score: number;
  };
  recommendations: string[];
  shortSummary: string;
  summary: string;
  tone: {
    feedback: string;
    score: 7;
  };
}>;
