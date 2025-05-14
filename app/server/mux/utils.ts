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
  let status: MuxProcessingStatus = "WAITING";
  if (["preparing", "waiting", undefined].includes(status)) status = "WAITING";
  if (currentStatus === "ready" || currentStatus === "asset_created")
    status = "READY";
  if (
    ["cancelled", "timed_out", "errored", "skipped"].includes(
      currentStatus ?? "",
    )
  )
    status = "ERRORED";

  return status;
}
