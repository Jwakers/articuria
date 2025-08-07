import { Doc } from "./_generated/dataModel";
import { ACCOUNT_LIMITS } from "./constants";

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

export function getAccountLimits(user: Doc<"users">) {
  if (user.subscription === "PRO") return ACCOUNT_LIMITS.pro;
  return ACCOUNT_LIMITS.free;
}

export function convertMegabytesToBytes(megabytes: number): number {
  return megabytes * 1024 * 1024;
}
