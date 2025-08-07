import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import * as Video from "./models/video";
import { muxProcessingStatus } from "./schema";

// Helper functions

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
    if (video.user !== identity.tokenIdentifier)
      throw new Error("Unauthorized");

    return await Video.enrichedVideo(ctx, video);
  },
});

export const list = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const videos = await Video.getVideoCollection(ctx);

    const promises = videos.map((video) => {
      return Video.enrichedVideo(ctx, video);
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

    const videoId = await Video.createVideo(ctx, {
      tableTopicId: args.tableTopicId,
      userId: identity.tokenIdentifier,
    });

    return videoId;
  },
});

export const update = mutation({
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

    await Video.updateVideo(ctx, {
      videoId: args.videoId,
      updateData: args.updateData,
    });
  },
});

export const get = query({
  args: {
    videoId: v.id("videos"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const video = await Video.getVideo(ctx, args.videoId);
    if (!video || video.user !== identity.tokenIdentifier)
      throw new Error("Unauthorized");

    return video;
  },
});

export const getById = internalQuery({
  args: {
    videoId: v.id("videos"),
  },
  async handler(ctx, args) {
    const video = await Video.getVideo(ctx, args.videoId);
    return video;
  },
});

export const updateById = internalMutation({
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
    await Video.updateVideo(ctx, {
      videoId: args.videoId,
      updateData: args.updateData,
    });
  },
});

export const deleteVideo = mutation({
  args: {
    videoId: v.id("videos"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const video = await ctx.db.get(args.videoId);
    if (!video) throw new Error("Video not found");

    if (video.user !== identity.tokenIdentifier)
      throw new Error("Not authorized to delete this video");

    await Video.deleteVideo(ctx, video);
  },
});

export const deleteById = internalMutation({
  args: {
    videoId: v.id("videos"),
  },
  async handler(ctx, args) {
    const video = await ctx.db.get(args.videoId);
    if (!video) throw new Error("Video not found");

    await Video.deleteVideo(ctx, video);
  },
});

export const getIncompleteVideos = internalQuery({
  args: {},
  async handler(ctx) {
    const videos = await ctx.db
      .query("videos")
      .filter((q) =>
        q.or(
          q.neq(q.field("status"), "READY"),
          q.neq(q.field("audioRenditionStatus"), "READY"),
        ),
      )
      .collect();
    return videos;
  },
});

export const getForReport = internalQuery({
  args: {
    videoId: v.id("videos"),
  },
  async handler(ctx, args) {
    const video = await ctx.db.get(args.videoId);
    if (!video) throw new Error("Video not found");
    if (!video.transcript)
      throw new Error("Video does not have a table topic or transcript");

    const [tableTopic, transcript] = await Promise.all([
      ctx.db.get(video.tableTopic),
      ctx.db.get(video.transcript),
    ]);

    return { video, tableTopic, transcript };
  },
});
