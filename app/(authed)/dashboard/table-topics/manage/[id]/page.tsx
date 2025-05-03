import { getUserVideoById } from "@/app/server/db/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import Transcript from "./_components/transcript";
import VideoNotProcessed from "./_components/video-not-processed";
import VideoPlayer, { VideoPlayerSkeleton } from "./_components/video-player";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [user, { id }] = await Promise.all([currentUser(), params]);

  if (!user) throw new Error("You must be signed in to view this page");

  const video = await getUserVideoById(id);

  return (
    <Suspense fallback={<VideoPlayerSkeleton />}>
      <div className="space-y-2">
        <VideoNotProcessed video={video} />
        <VideoPlayer video={video} />
        <Transcript video={video} />
      </div>
    </Suspense>
  );
}
