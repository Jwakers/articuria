import { WithoutSystemFields } from "convex/server";
import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

export async function getVideoCollection(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  return await ctx.db
    .query("videos")
    .withIndex("by_user", (q) => q.eq("user", identity.tokenIdentifier))
    .collect();
}

export async function enrichedVideo(ctx: QueryCtx, video: Doc<"videos">) {
  const [tableTopic, transcript, report] = await Promise.all([
    video.tableTopic ? ctx.db.get(video.tableTopic) : undefined,
    video.transcript ? ctx.db.get(video.transcript) : undefined,
    video.report ? ctx.db.get(video.report) : undefined,
  ]);

  return { video, tableTopic, transcript, report };
}

export async function createVideo(
  ctx: MutationCtx,
  args: {
    tableTopicId: Id<"tableTopics">;
    userId: string;
  },
) {
  const videoId = await ctx.db.insert("videos", {
    tableTopic: args.tableTopicId,
    user: args.userId,
    status: "WAITING",
    audioRenditionStatus: "WAITING",
  });

  return videoId;
}

export async function getVideo(ctx: QueryCtx, videoId: Id<"videos">) {
  return await ctx.db.get(videoId);
}

export async function updateVideo(
  ctx: MutationCtx,
  args: {
    videoId: Id<"videos">;
    updateData: Partial<WithoutSystemFields<Doc<"videos">>>;
  },
) {
  // Remove undefined properties
  const patchData = args.updateData;
  Object.keys(patchData).forEach((key) => {
    if (
      patchData[key as keyof WithoutSystemFields<Doc<"videos">>] === undefined
    ) {
      delete patchData[key as keyof WithoutSystemFields<Doc<"videos">>];
    }
  });
  await ctx.db.patch(args.videoId, patchData);
}

export async function deleteVideo(ctx: MutationCtx, video: Doc<"videos">) {
  if (video.transcript) {
    await ctx.db.delete(video.transcript);
  }

  if (video.report) {
    await ctx.db.delete(video.report);
  }

  await ctx.db.delete(video._id);

  if (!video.assetId) {
    console.error("Video has no asset ID");
    return;
  }

  await ctx.scheduler.runAfter(0, internal.actions.mux.deleteAsset, {
    assetId: video.assetId,
  });
}
