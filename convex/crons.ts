import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// This job will patch up any missing data from the video should the mux webhook fail
crons.interval(
  "update-video-status",
  { minutes: 1 },
  internal.actions.mux.updateVideoStatus,
);

export default crons;
