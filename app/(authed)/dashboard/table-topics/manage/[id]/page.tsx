import { getUserVideoById } from "@/app/server/db/queries";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import VideoPlayer, { VideoPlayerSkeleton } from "./_components/video-player";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [user, { id }] = await Promise.all([currentUser(), params]);

  if (!user) throw new Error("You must be signed in to view this page");

  const videoPromise = getUserVideoById(id);

  return (
    <div className="px-4 py-8">
      <Suspense fallback={<VideoPlayerSkeleton />}>
        <VideoPlayer videoPromise={videoPromise} />
      </Suspense>
    </div>
  );
}
