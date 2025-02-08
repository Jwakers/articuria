import { cloudflareClient } from "@/app/server/cloudflare-client";
import { db } from "@/app/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    await verifySignature(request);
    const data: ResponseData | undefined = await request.json();

    if (!data) throw new Error("No data received");

    validateRequestData(data);

    let video;

    if (!data.duration) {
      video = await updateVideoWithRetry(data);
    } else {
      video = await updateVideoDuration(data);
    }

    if (!video) {
      throw new Error("Video not found");
    }

    return new Response(
      `Updated video ${video.cloudflareId} with duration ${data.duration}`,
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

async function verifySignature(request: Request) {
  // Step 1: Parse the Webhook-Signature header
  const signatureHeader = request.headers.get("Webhook-Signature");
  if (!signatureHeader) {
    throw new Error("Missing Webhook-Signature header");
  }

  const [timeStr, sig1] = signatureHeader
    .split(",")
    .map((part) => part.split("=")[1]);
  const requestTime = parseInt(timeStr, 10);

  // Discard requests with timestamps that are too old
  const currentTime = Math.floor(Date.now() / 1000);
  const fiveMinutesAgo = currentTime - 300;
  if (requestTime < fiveMinutesAgo) {
    throw new Error("Request timestamp is too old");
  }

  const body = await request.clone().text(); // Get the request body as text

  // Step 2: Create the signature source string
  const signatureSource = `${requestTime}.${body}`;

  if (!process.env.CLOUDFLARE_WEBHOOK_SECRET)
    throw new Error("Webhook secret not set");

  // Step 3: Create the expected signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.CLOUDFLARE_WEBHOOK_SECRET)
    .update(signatureSource)
    .digest("hex");

  // Step 4: Compare expected and actual signatures
  if (
    !crypto.timingSafeEqual(Buffer.from(sig1), Buffer.from(expectedSignature))
  )
    throw new Error("Invalid signature");
}

async function updateVideoWithRetry(data: ResponseData, attempt = 1) {
  const maxAttempts = 5;
  const delay = 5000; // 5 seconds

  const duration = await fetchVideoDuration(data.uid);

  if (duration && duration > 0) {
    console.log(`Fetched duration: ${duration} for video ${data.uid}`);
    const video = await updateVideoDuration(data);
    return video;
  }

  if (attempt < maxAttempts) {
    console.log(
      `Retrying (${attempt}/${maxAttempts}) for video ${data.uid}...`
    );
    setTimeout(() => updateVideoWithRetry(data, attempt + 1), delay);
  } else {
    console.warn(
      `Max retries reached. Could not fetch duration for video ${data.uid}.`
    );
  }
}

async function fetchVideoDuration(uid: string) {
  const video = await cloudflareClient.stream.get(uid, {
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
  });

  return video.duration;
}

async function updateVideoDuration(data: ResponseData) {
  try {
    return await db.video.update({
      where: {
        cloudflareId: data.uid,
      },
      data: {
        duration: data.duration,
      },
    });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error(`No video found with cloudflareId: ${data.uid}`);
    }
    throw error; // Re-throw other database errors
  }
}

function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  const status =
    error instanceof Error && error.message.includes("not found") ? 404 : 500;
  return new Response(
    JSON.stringify({
      error: "Webhook failed",
      message,
    }),
    {
      status,
    }
  );
}

function validateRequestData(data: ResponseData) {
  if (
    !data ||
    typeof data !== "object" ||
    !("uid" in data) ||
    !("duration" in data) ||
    typeof data.duration !== "number" ||
    data.duration < 0
  ) {
    throw new Error(
      "Invalid request data: uid must be a string and duration must be a non-negative number"
    );
  }
}

type ResponseData = {
  uid: string;
  creator: null;
  thumbnail: string;
  thumbnailTimestampPct: number;
  readyToStream: boolean;
  readyToStreamAt: string;
  status: {
    state: string;
    step: string;
    pctComplete: string;
    errorReasonCode: string;
    errorReasonText: string;
  };
  meta: {
    created: string;
    name: string;
    title: string;
    userId: string;
  };
  created: string;
  modified: string;
  scheduledDeletion: null;
  size: number;
  preview: string;
  allowedOrigins: string[];
  requireSignedURLs: boolean;
  uploaded: string;
  uploadExpiry: string;
  maxSizeBytes: null;
  maxDurationSeconds: number;
  duration: number;
  input: {
    width: number;
    height: number;
  };
  playback: {
    hls: string;
    dash: string;
  };
  watermark: null;
  clippedFrom: null;
  publicDetails: null;
};
