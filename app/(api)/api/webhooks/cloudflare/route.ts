import { db } from "@/app/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    await verifySignature(request);

    const data: ResponseData = await request.json();

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

    try {
      const video = await db.video.update({
        where: {
          cloudflareId: data.uid,
        },
        data: {
          duration: data.duration,
        },
      });
      return new Response(JSON.stringify({ video }), { status: 200 });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return new Response(
          JSON.stringify({
            error: "Video not found",
            message: `No video found with cloudflareId: ${data.uid}`,
          }),
          { status: 404 }
        );
      }
      throw error; // Re-throw other database errors
    }
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: "Webhook failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
      }
    );
  }
}

async function verifySignature(request: Request) {
  // Step 1: Parse the Webhook-Signature header
  const signatureHeader = request.headers.get("Webhook-Signature");
  if (!signatureHeader) {
    throw new Error("Missing Webhook-Signature header");
  }

  const [sig1, timeStr] = signatureHeader
    .split(",")
    .map((part) => part.split("=")[1]);
  const requestTime = parseInt(timeStr, 10);

  // Discard requests with timestamps that are too old
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - requestTime > 300) {
    // 5 minutes threshold
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

type ResponseData =
  | {
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
    }
  | undefined;
