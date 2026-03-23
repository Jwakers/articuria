import { cronJobs } from "convex/server";

const crons = cronJobs();

// Cron job that patches up any missing data if the Mux webhook fails.
// Disabled by default to prevent excessive Convex logs.
//
// To re-enable without changing code, set:
//   MUX_UPDATE_VIDEO_STATUS_CRON_MINUTES = "<number of minutes>"
// const intervalMinutes = Number(process.env.MUX_UPDATE_VIDEO_STATUS_CRON_MINUTES);
// if (Number.isFinite(intervalMinutes) && intervalMinutes > 0) {
//   crons.interval(
//     "update-video-status",
//     { minutes: intervalMinutes },
//     internal.actions.mux.updateVideoStatus,
//   );
// }

export default crons;
