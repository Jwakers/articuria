import type { Asset } from "@mux/mux-node/resources/video/assets.mjs";

export type StaticRenditionStatus = NonNullable<
  Asset["static_renditions"]
>["status"];

export type StaticRenditionWebhookPayload = Partial<{
  type: string;
  status: string;
  resolution: string;
  name: string;
  id: string;
  ext: string;
  asset_id: string;
}>;
