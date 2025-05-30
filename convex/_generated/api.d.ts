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
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as httpActions_clerk from "../httpActions/clerk.js";
import type * as httpActions_mux from "../httpActions/mux.js";
import type * as reports from "../reports.js";
import type * as tableTopics from "../tableTopics.js";
import type * as transcripts from "../transcripts.js";
import type * as users from "../users.js";
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
  crons: typeof crons;
  http: typeof http;
  "httpActions/clerk": typeof httpActions_clerk;
  "httpActions/mux": typeof httpActions_mux;
  reports: typeof reports;
  tableTopics: typeof tableTopics;
  transcripts: typeof transcripts;
  users: typeof users;
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
