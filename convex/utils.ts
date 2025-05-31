import { Doc } from "./_generated/dataModel";

export function parseStatus(
  currentStatus:
    | string
    | "preparing"
    | "waiting"
    | "ready"
    | "asset_created"
    | "errored"
    | "cancelled"
    | "timed_out"
    | "skipped"
    | undefined,
): Doc<"videos">["status"] {
  if (["preparing", "waiting", undefined].includes(currentStatus))
    return "WAITING";
  if (["ready", "asset_created"].includes(currentStatus ?? "")) return "READY";
  if (
    ["cancelled", "timed_out", "errored", "skipped"].includes(
      currentStatus ?? "",
    )
  )
    return "ERRORED";

  return "WAITING";
}
