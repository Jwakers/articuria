"use server";

import { disfluencyData } from "@/lib/utils";
import { getDownloadDataById } from "../cloudflare-actions";
import { db } from "../db";
import { getUserVideoById } from "../db/queries";
import { assemblyAi } from "./asembly-ai-client";

export async function getTranscriptionData(
  video: NonNullable<Awaited<ReturnType<typeof getUserVideoById>>>,
) {
  if (video?.transcript)
    return { data: null, error: "Transcript data already exists" };

  const cloudflareVideo = await getDownloadDataById(video.cloudflareId);

  if (!cloudflareVideo?.default?.url)
    return { data: null, error: "Unable to get video download URL" };

  const res = await fetch(cloudflareVideo.default.url, {
    redirect: "manual", // Don't follow redirects automatically
  });

  const signedUrl = res.headers.get("location");
  if (!signedUrl)
    return { data: null, error: "Unable to resolve signed redirect URL" };

  // Submit audio for transcription with AssemblyAI SDK
  try {
    console.log("[ASSEMBLY] starting transcription");
    console.time();
    const transcript = await assemblyAi.transcripts.transcribe({
      audio_url: signedUrl,
      speakers_expected: 1,
      speaker_labels: true,
      summarization: true,
      disfluencies: true,
      language_code: "en_uk",
      sentiment_analysis: true,
      entity_detection: true,
      auto_highlights: true,
    });
    console.log("[ASSEMBLY] transcription complete");
    console.timeEnd();

    const { words } = transcript;
    const firstWord = words?.[0];
    const lastWord = words?.at(-1);
    const speakingDuration = (lastWord?.end ?? 0) - (firstWord?.start ?? 0); // ms
    const wordsPerMinute =
      words?.length && speakingDuration > 0
        ? Math.round((words.length / speakingDuration) * 60000) // Convert ms to minutes
        : 0;

    const data = disfluencyData(words?.map((item) => item.text) ?? []);
    const fillerWords = Object.entries(data).map(([word, count]) => ({
      word,
      count,
    }));
    const fillerWordCount = fillerWords.reduce((a, c) => a + c.count, 0);

    try {
      const data = await db.transcript.create({
        data: {
          data: transcript,
          videoId: video.id,
          speakingDuration,
          wordsPerMinute,
          fillerWordCount,
        },
      });

      return { data, error: null };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: "There was an issue adding the transcript to the database",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: "Unable to generate transcript. Please contact support",
    };
  }
}
