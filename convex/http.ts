import { httpRouter } from "convex/server";
import { clerkWebhookHandler } from "./httpActions/clerk";
import { muxWebhookHandler } from "./httpActions/mux";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: clerkWebhookHandler,
});

http.route({
  path: "/mux-webhook",
  method: "POST",
  handler: muxWebhookHandler,
});

export default http;
