"use server";

import { currentUser } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import { cloudflareClient } from "./cloudflare-client";

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
    const directUpload = await cloudflareClient.stream.directUpload.create({
      account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
      maxDurationSeconds: 180,
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

export async function uploadVideoToCloudflare(
  uploadURL: string,
  formData: FormData,
) {
  const res = await fetch(uploadURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  if (!res.ok) throw new Error(`Video upload failed: ${res.status}`);
}

const _getCachedVideo = unstable_cache(
  async (id) => {
    return cloudflareClient.stream.get(id, {
      account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
    });
  },
  undefined,
  {
    revalidate: 20,
  },
);

export async function getVideoById(id: string) {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthorized");

  const video = await _getCachedVideo(id);

  return video;
}

export async function deleteVideoById(id: string, userId?: string) {
  const user = await currentUser();
  if (!user?.id && !userId) throw new Error("Unauthorized");

  try {
    await cloudflareClient.stream.delete(id, {
      account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
    });
  } catch (error) {
    console.error("Failed to delete video:", error);
    throw new Error("Failed to delete video from Cloudflare");
  }
}

type DownloadData =
  | {
      default: {
        url: string;
      };
    }
  | undefined;

export async function getDownloadDataById(id: string): Promise<DownloadData> {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthorized");

  try {
    const download = await cloudflareClient.stream.downloads.create(id, {
      account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
      body: {},
    });

    if (!download || typeof download !== "object" || !("default" in download)) {
      throw new Error("Invalid download data format");
    }

    return download as DownloadData;
  } catch (error) {
    console.error("Failed to get download data:", error);
    throw new Error("Failed to get video download data");
  }
}
