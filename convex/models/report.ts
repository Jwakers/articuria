import { WithoutSystemFields } from "convex/server";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

export async function getReport(ctx: QueryCtx, reportId: Id<"reports">) {
  return await ctx.db.get(reportId);
}

export async function createReport(
  ctx: MutationCtx,
  report: WithoutSystemFields<Doc<"reports">>,
) {
  return await ctx.db.insert("reports", report);
}
