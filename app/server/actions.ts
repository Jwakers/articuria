"use server";

import { currentUser } from "@clerk/nextjs/server";
import { Video } from "@prisma/client";
import Cloudflare from "cloudflare";
import { getRandomTableTopic, setUserVideo as setVideoDb } from "./db/queries";

const client = new Cloudflare({
  apiKey: process.env.CLOUDFLARE_API_TOKEN, // This is the default and can be omitted
});

export async function getTableTopic() {
  const topic = await getRandomTableTopic();

  return topic;
}

export async function setVideo({
  cloudflareId,
  tableTopicId,
}: {
  cloudflareId: Video["cloudflareId"];
  tableTopicId: Video["tableTopicId"];
}) {
  const video = await setVideoDb({
    cloudflareId,
    tableTopicId,
  });

  return video;
}

export async function getVideoUploadUrl({ title }: { title: string }) {
  const user = await currentUser();

  if (!process.env.CLOUDFLARE_API_TOKEN)
    throw new Error("Missing Cloudflare API token");
  if (!process.env.CLOUDFLARE_ACCOUNT_ID)
    throw new Error("Missing Cloudflare account ID");
  if (!user?.id) throw new Error("Unauthorized");

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  try {
    const directUpload = await client.stream.directUpload.create({
      account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
      maxDurationSeconds: 120,
      allowedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
      meta: {
        userId: user?.id,
        title: title.trim(),
        created: new Date().toLocaleDateString(),
      },
    });
    return directUpload;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create upload URL");
  }
}
