/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions_mux from "../actions/mux.js";
import type * as actions_openai from "../actions/openai.js";
import type * as constants from "../constants.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as httpActions_clerk from "../httpActions/clerk.js";
import type * as httpActions_mux from "../httpActions/mux.js";
import type * as httpActions_types from "../httpActions/types.js";
import type * as models_report from "../models/report.js";
import type * as models_tableTopic from "../models/tableTopic.js";
import type * as models_transcript from "../models/transcript.js";
import type * as models_user from "../models/user.js";
import type * as models_video from "../models/video.js";
import type * as reports from "../reports.js";
import type * as tableTopics from "../tableTopics.js";
import type * as transcripts from "../transcripts.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";
import type * as videos from "../videos.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/mux": typeof actions_mux;
  "actions/openai": typeof actions_openai;
  constants: typeof constants;
  crons: typeof crons;
  http: typeof http;
  "httpActions/clerk": typeof httpActions_clerk;
  "httpActions/mux": typeof httpActions_mux;
  "httpActions/types": typeof httpActions_types;
  "models/report": typeof models_report;
  "models/tableTopic": typeof models_tableTopic;
  "models/transcript": typeof models_transcript;
  "models/user": typeof models_user;
  "models/video": typeof models_video;
  reports: typeof reports;
  tableTopics: typeof tableTopics;
  transcripts: typeof transcripts;
  users: typeof users;
  utils: typeof utils;
  videos: typeof videos;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
