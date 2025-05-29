import { getAuthToken } from "@/app/server/auth";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { currentUser } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { Suspense } from "react";
import Transcript from "./_components/transcript";
import VideoPlayer, { VideoPlayerSkeleton } from "./_components/video-player";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: Id<"videos"> }>;
}): Promise<Metadata> {
  const [user, { id }] = await Promise.all([currentUser(), params]);
  if (!user) throw new Error("You must be signed in to view this page");
  const video = await fetchQuery(
    api.videos.getEnriched,
    {
      videoId: id,
    },
    {
      token: await getAuthToken(),
    },
  );

  return {
    title: video?.tableTopic?.topic ?? "My Table Topic",
    description:
      "Rewatch, transcribe and generate feedback for your table topic",
  };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: Id<"videos"> }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<VideoPlayerSkeleton />}>
      <div className="space-y-2">
        <VideoPlayer videoId={id} />
        <Transcript videoId={id} />
      </div>
    </Suspense>
  );
}
