import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import * as Transcript from "./models/transcript";
import * as Video from "./models/video";

export const get = query({
  args: {
    transcriptId: v.optional(v.id("transcripts")),
  },
  async handler(ctx, args) {
    if (!args.transcriptId) return null;
    const transcript = await Transcript.getTranscript(ctx, args.transcriptId);
    if (!transcript) return null;
    return transcript;
  },
});

export const create = mutation({
  args: {
    videoId: v.id("videos"),
    data: v.any(), // TODO: type this data once using open ai for transcription
    speakingDuration: v.number(),
    wordsPerMinute: v.number(),
    fillerWordCount: v.number(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const video = await Video.getVideo(ctx, args.videoId);
    if (!video) throw new Error("Video not found");
    if (video.user !== identity.tokenIdentifier) throw new Error("Forbidden");

    const transcriptId = await Transcript.createTranscript(ctx, {
      data: args.data,
      user: identity.tokenIdentifier,
      videoId: video._id,
      speakingDuration: args.speakingDuration,
      wordsPerMinute: args.wordsPerMinute,
      fillerWordCount: args.fillerWordCount,
    });

    await Video.updateVideo(ctx, {
      videoId: video._id,
      updateData: {
        transcript: transcriptId,
      },
    });

    return transcriptId;
  },
});
