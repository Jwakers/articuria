import { WithoutSystemFields } from "convex/server";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

export async function getTranscript(
  ctx: QueryCtx,
  transcriptId: Id<"transcripts">,
) {
  return await ctx.db.get(transcriptId);
}

export async function createTranscript(
  ctx: MutationCtx,
  transcript: WithoutSystemFields<Doc<"transcripts">>,
) {
  return await ctx.db.insert("transcripts", transcript);
}
