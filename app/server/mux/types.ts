export type StaticRenditionWebhookPayload = Partial<{
  type: string;
  status: string;
  resolution: string;
  name: string;
  id: string;
  ext: string;
  asset_id: string;
}>;
