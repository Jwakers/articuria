"use server";

import { disfluencyData, userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { db } from "../db";
import { getUserVideoById } from "../db/queries";
import { getAudioRendition } from "../mux/mux-actions";
import { assemblyAi } from "./client";

export async function getTranscriptionData(
  video: NonNullable<Awaited<ReturnType<typeof getUserVideoById>>>,
) {
  if (video?.transcript)
    return { data: null, error: "Transcript data already exists" };
  if (video?.audioRenditionStatus !== "READY")
    return { data: null, error: "Video data not finished processing" };
  if (!video.assetId) return { data: null, error: "Video missing asset ID" };

  const { user, accountLimits } = userWithMetadata(await currentUser());

  if (!user) return { data: null, error: "Unauthenticated" };

  if (!accountLimits?.tableTopicTranscription)
    return {
      data: null,
      error: "You do not have permission to generate a transcript",
    };

  const { audioRendition, playbackId, error } = await getAudioRendition(
    video.assetId,
  );

  if (error) return { data: null, error };
  if (!audioRendition)
    return { data: null, error: "Unable to fetch audio rendition" };

  const audioRenditionUrl = `https://stream.mux.com/${playbackId.id}/${audioRendition?.name}`;

  try {
    console.log("[ASSEMBLY] starting transcription");
    console.time("[ASSEMBLY]");
    const transcript = await assemblyAi.transcripts.transcribe({
      audio_url: audioRenditionUrl,
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
    console.timeEnd("[ASSEMBLY]");

    const { words } = transcript;
    const firstWord = words?.[0];
    const lastWord = words?.at(-1);
    const speakingDuration = (lastWord?.end ?? 0) - (firstWord?.start ?? 0); // ms
    const wordsPerMinute =
      words?.length && speakingDuration > 0
        ? Math.round((words.length / speakingDuration) * 60000) // Convert ms to minutes
        : 0;

    const data = disfluencyData(transcript.text ?? "");
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
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        // P2002 is the error code for unique constraint violations
        return {
          data: null,
          error: "A transcript for this video already exists",
        };
      }

      throw err;
    }
  } catch (err) {
    console.error("[ASSEMBLY] Error generating transcript:", err);
    return {
      data: null,
      error: "Failed to generate transcript. Please try again later.",
    };
  }
}
