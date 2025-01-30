import { db } from "@/app/server/db";

export async function POST(request: Request) {
  try {
    const data: ResponseData = await request.json();

    if (
      !data ||
      typeof data !== "object" ||
      !("uid" in data) ||
      !("duration" in data)
    ) {
      throw new Error("Missing required data: uid or duration");
    }

    const video = await db.video.update({
      where: {
        cloudflareId: data.uid,
      },
      data: {
        duration: data.duration,
      },
    });

    return Response.json({ video });
  } catch (error) {
    console.error(error);

    return new Response("Webhook failed", {
      status: 500,
    });
  }
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
