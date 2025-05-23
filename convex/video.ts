import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { muxProcessingStatus } from "./schema";

export const get = query({
  args: {
    id: v.id("video"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const video = await ctx.db.get(args.id);

    return video;
  },
});

export const getCollection = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const videos = await ctx.db
      .query("video")
      .withIndex("by_user", (q) => q.eq("user", identity.tokenIdentifier))
      .collect();

    return videos;
  },
});

// export const getCount = internalQuery({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const videoCount = await ctx.db
//       .query("video")
//       .withIndex("by_user", (q) => q.eq("user", identity.tokenIdentifier))
//       .collect();
//     return videoCount.length;
//   },
// });

export const create = mutation({
  args: {
    tableTopicId: v.id("tableTopic"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    // Create the video here, then call the action
    const videoId = await ctx.db.insert("video", {
      user: identity.tokenIdentifier,
      tableTopic: args.tableTopicId,
      status: "WAITING",
      audioRenditionStatus: "WAITING",
    });

    return videoId;
  },
});

export const update = mutation({
  args: {
    id: v.id("video"),
    uploadId: v.optional(v.string()),
    assetId: v.optional(v.string()),
    publicPlaybackId: v.optional(v.string()),
    audioRenditionStatus: v.optional(muxProcessingStatus),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      uploadId: args.uploadId,
      assetId: args.assetId,
      publicPlaybackId: args.publicPlaybackId,
      audioRenditionStatus: args.audioRenditionStatus,
    });
  },
});

export const deleteVideo = mutation({
  args: {
    id: v.id("video"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const video = await ctx.db.get(args.id);

    if (video?.user !== identity.tokenIdentifier)
      throw new Error("Unauthorized to delete this video");

    await ctx.db.delete(video._id);
  },
});
