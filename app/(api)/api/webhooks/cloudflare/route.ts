import { db } from "@/app/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    await verifySignature(request);
    const data: ResponseData | undefined = await request.json();

    if (!data) throw new Error("No data received");

    validateRequestData(data);
    const video = await updateVideoDuration(data);
    return new Response(JSON.stringify({ video }), { status: 200 });
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

  const [sig1, timeStr] = signatureHeader
    .split(",")
    .map((part) => part.split("=")[1]);
  const requestTime = parseInt(timeStr, 10);

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

  console.log({
    sig1,
    expectedSignature,
    signatureSource,
    requestTime,
    signatureHeader,
  });

  // Step 4: Compare expected and actual signatures
  if (
    !crypto.timingSafeEqual(Buffer.from(sig1), Buffer.from(expectedSignature))
  )
    throw new Error("Invalid signature");
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
