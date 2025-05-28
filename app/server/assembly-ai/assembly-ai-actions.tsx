"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { disfluencyData } from "@/lib/utils";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { getAuthToken, getUserServer } from "../auth";
import { getAudioRendition } from "../mux/mux-actions";
import { assemblyAi } from "./client";

export async function getTranscriptionData(videoId: Id<"videos">) {
  const data = await fetchQuery(
    api.videos.getEnriched,
    {
      videoId,
    },
    {
      token: await getAuthToken(),
    },
  );

  if (!data) return { error: "Video not found" };

  const { video, transcript } = data;

  if (transcript) return { error: "Transcript data already exists" };
  if (video?.audioRenditionStatus !== "READY")
    return { error: "Video data not finished processing" };
  if (!video.assetId) return { error: "Video missing asset ID" };

  const { user, accountLimits } = await getUserServer();

  if (!user) return { error: "Unauthenticated" };

  if (!accountLimits?.tableTopicTranscription)
    return {
      error: "You do not have permission to generate a transcript",
    };

  const { audioRendition, playbackId, error } = await getAudioRendition(
    video.assetId,
  );

  if (error) return { error };
  if (!audioRendition) return { error: "Unable to fetch audio rendition" };

  // Validate playbackId and audioRendition name
  if (!playbackId?.id || !audioRendition?.name) {
    return { error: "Invalid playback ID or audio rendition name" };
  }

  // Use URL constructor for safer URL building
  const audioRenditionUrl = new URL(
    `${playbackId.id}/${encodeURIComponent(audioRendition.name)}`,
    "https://stream.mux.com/",
  ).toString();

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

    await fetchMutation(
      api.transcripts.create,
      {
        videoId,
        data: transcript,
        speakingDuration,
        wordsPerMinute,
        fillerWordCount,
      },
      {
        token: await getAuthToken(),
      },
    );
    return { error: null };
  } catch (err) {
    console.error("[ASSEMBLY] Error generating transcript:", err);
    return {
      error: "Failed to generate transcript. Please try again later.",
    };
  }
}
