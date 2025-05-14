import { MuxProcessingStatus } from "@prisma/client";

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
): MuxProcessingStatus {
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
