import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";
import { muxProcessingStatus } from "./schema";

// Helper functions
export async function enrichedVideo(ctx: QueryCtx, video: Doc<"videos">) {
  let tableTopic, transcript, report;

  if (video.tableTopic) {
    tableTopic = await ctx.db.get(video.tableTopic);
  }
  if (video.transcript) {
    transcript = await ctx.db.get(video.transcript);
  }
  if (video.report) {
    report = await ctx.db.get(video.report);
  }

  return { video, tableTopic, transcript, report };
}

export async function getVideoCollection(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  return await ctx.db
    .query("videos")
    .withIndex("by_user", (q) => q.eq("user", identity.tokenIdentifier))
    .collect();
}
// End of helper functions

// Queries and mutations
export const getEnriched = query({
  args: {
    videoId: v.optional(v.id("videos")),
  },
  async handler(ctx, args) {
    if (!args.videoId) return null;

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const video = await ctx.db.get(args.videoId);
    if (!video) throw new Error("Video not found");

    return await enrichedVideo(ctx, video);
  },
});

export const list = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const videos = await getVideoCollection(ctx);

    const promises = videos.map((video) => {
      return enrichedVideo(ctx, video);
    });

    const enrichedVideos = await Promise.all(promises);

    return enrichedVideos;
  },
});

export const create = mutation({
  args: {
    tableTopicId: v.id("tableTopics"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const videoId = await ctx.db.insert("videos", {
      tableTopic: args.tableTopicId,
      user: identity.tokenIdentifier,
      status: "WAITING",
      audioRenditionStatus: "WAITING",
    });

    return videoId;
  },
});

export const update = mutation({
  args: {
    videoId: v.id("videos"),
    status: v.optional(muxProcessingStatus),
    audioRenditionStatus: v.optional(muxProcessingStatus),
    publicPlaybackId: v.optional(v.string()),
    uploadId: v.optional(v.string()),
    assetId: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const { videoId, ...updateData } = args;

    // Filter out undefined values
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined),
    ) as typeof updateData;

    await ctx.db.patch(videoId, filteredUpdateData);
  },
});

export const getById = query({
  args: {
    videoId: v.id("videos"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const video = await ctx.db.get(args.videoId);
    if (!video || video.user !== identity.tokenIdentifier)
      throw new Error("Unauthorized");

    return video;
  },
});

export const updateById = mutation({
  args: {
    videoId: v.id("videos"),
    updateData: v.object({
      status: v.optional(muxProcessingStatus),
      audioRenditionStatus: v.optional(muxProcessingStatus),
      publicPlaybackId: v.optional(v.string()),
      uploadId: v.optional(v.string()),
      assetId: v.optional(v.string()),
      duration: v.optional(v.number()),
    }),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const video = await ctx.db.get(args.videoId);
    if (!video || video.user !== identity.tokenIdentifier)
      throw new Error("Unauthorized");

    await ctx.db.patch(args.videoId, args.updateData);
  },
});

export const deleteById = mutation({
  args: {
    videoId: v.id("videos"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const video = await ctx.db.get(args.videoId);
    if (!video) throw new Error("Video not found");

    if (video.user !== identity.tokenIdentifier)
      throw new Error("Unauthorized");

    if (video.transcript) {
      await ctx.db.delete(video.transcript);
    }

    if (video.report) {
      await ctx.db.delete(video.report);
    }

    await ctx.db.delete(args.videoId);
  },
});
