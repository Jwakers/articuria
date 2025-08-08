import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import * as Report from "./models/report";
import * as Users from "./models/user";
import * as Video from "./models/video";
import { getAccountLimits } from "./utils";

export const get = query({
  args: {
    reportId: v.optional(v.id("reports")),
  },
  async handler(ctx, args) {
    if (!args.reportId) return null;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const report = await Report.getReport(ctx, args.reportId);
    if (report?.user !== identity.tokenIdentifier) return null;

    return report;
  },
});

export const generate = mutation({
  args: {
    videoId: v.id("videos"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const video = await Video.getVideo(ctx, args.videoId);
    if (!video) throw new Error("Video not found");
    if (video.report) throw new Error("Report already exists");
    if (!video.transcript)
      throw new Error("No transcript found to generate report from");

    // Check user permissions
    const user = await Users.getCurrentUserOrThrow(ctx);
    const accountLimits = getAccountLimits(user);

    // Can the user create a report?
    if (!accountLimits.tableTopicReport)
      throw new Error("You do not have permission to create a report");

    await ctx.scheduler.runAfter(
      0,
      internal.actions.openai.createTableTopicReport,
      {
        videoId: video._id,
        user: identity.tokenIdentifier,
      },
    );
  },
});

export const create = internalMutation({
  args: {
    videoId: v.id("videos"),
    user: v.string(),
    averageScore: v.number(),
    clarity: v.string(),
    clarityScore: v.number(),
    commendations: v.array(v.string()),
    creativity: v.string(),
    creativityScore: v.number(),
    engagement: v.string(),
    engagementScore: v.number(),
    language: v.string(),
    languageScore: v.number(),
    pacing: v.string(),
    pacingScore: v.number(),
    recommendations: v.array(v.string()),
    shortSummary: v.string(),
    summary: v.string(),
    tone: v.string(),
    toneScore: v.number(),
  },
  async handler(ctx, args) {
    const video = await Video.getVideo(ctx, args.videoId);
    if (!video) throw new Error("Video not found");
    if (video.user !== args.user) throw new Error("Unauthorized");

    const reportId = await Report.createReport(ctx, {
      videoId: video._id,
      user: args.user,
      averageScore: args.averageScore,
      clarity: args.clarity,
      clarityScore: args.clarityScore,
      commendations: args.commendations,
      creativity: args.creativity,
      creativityScore: args.creativityScore,
      engagement: args.engagement,
      engagementScore: args.engagementScore,
      language: args.language,
      languageScore: args.languageScore,
      pacing: args.pacing,
      pacingScore: args.pacingScore,
      recommendations: args.recommendations,
      shortSummary: args.shortSummary,
      summary: args.summary,
      tone: args.tone,
      toneScore: args.toneScore,
    });

    await Video.updateVideo(ctx, {
      videoId: video._id,
      updateData: {
        report: reportId,
      },
    });

    return reportId;
  },
});
