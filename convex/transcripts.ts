import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    transcriptId: v.optional(v.id("transcripts")),
  },
  async handler(ctx, args) {
    if (!args.transcriptId) return null;
    return await ctx.db.get(args.transcriptId);
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

    const video = await ctx.db.get(args.videoId);
    if (!video) throw new Error("Video not found");
    if (video.user !== identity.tokenIdentifier) throw new Error("Forbidden");

    const transcriptId = await ctx.db.insert("transcripts", {
      data: args.data,
      user: identity.tokenIdentifier,
      videoId: video._id,
      speakingDuration: args.speakingDuration,
      wordsPerMinute: args.wordsPerMinute,
      fillerWordCount: args.fillerWordCount,
    });

    await ctx.db.patch(video._id, {
      transcript: transcriptId,
    });

    return transcriptId;
  },
});
