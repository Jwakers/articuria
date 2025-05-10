import { getUserVideoById } from "@/app/server/db/queries";
import { getUpdatedVideo } from "@/app/server/mux/mux-actions";
import { StaticRenditionStatus } from "@/app/server/mux/types";
import Spinner from "@/components/ui/spinner";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
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

  let muxVideo = await getUserVideoById(id);
  if (!muxVideo) return notFound();

  const audioReady =
    muxVideo.audioRenditionStatus === ("ready" satisfies StaticRenditionStatus);

  if (
    !muxVideo.publicPlaybackId ||
    !muxVideo.audioRenditionStatus ||
    !audioReady
  ) {
    muxVideo = await getUpdatedVideo(muxVideo);
  }

  // TODO: Return audio still processing message
  // TODO: If video is still processing do not render the video player
  // TODO: go to video should watch for data base changes and only link when the video is ready
  // TODO: Format feedback more effectively and place above the transcript
  // TODO: Add playhead feature to the transcript

  return (
    <Suspense fallback={<VideoPlayerSkeleton />}>
      <div className="space-y-2">
        {!muxVideo?.publicPlaybackId ? <VideoNotProcessed /> : null}
        <VideoPlayer video={muxVideo} />
        {muxVideo?.transcript || audioReady ? (
          <Transcript video={muxVideo} />
        ) : (
          <div className="flex items-center gap-2">
            <p>Processing audio...</p>
            <Spinner />
          </div>
        )}
      </div>
    </Suspense>
  );
}
