import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    reportId: v.optional(v.id("reports")),
  },
  async handler(ctx, args) {
    if (!args.reportId) return null;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const report = await ctx.db.get(args.reportId);
    if (report?.user !== identity.tokenIdentifier) return null;

    return report;
  },
});

export const create = mutation({
  args: {
    videoId: v.id("videos"),
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const reportId = await ctx.db.insert("reports", {
      videoId: args.videoId,
      user: identity.tokenIdentifier,
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

    await ctx.db.patch(args.videoId, {
      report: reportId,
    });

    return reportId;
  },
});
