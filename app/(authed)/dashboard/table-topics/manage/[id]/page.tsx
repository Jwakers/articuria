import { getUserVideoById } from "@/app/server/db/queries";
import { getUpdatedVideo } from "@/app/server/mux/mux-actions";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Transcript from "./_components/transcript";
import VideoNotProcessed from "./_components/video-not-processed";
import VideoPlayer, { VideoPlayerSkeleton } from "./_components/video-player";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const [user, { id }] = await Promise.all([currentUser(), params]);
  if (!user) throw new Error("You must be signed in to view this page");
  const muxVideo = await getUserVideoById(id);

  return {
    title: muxVideo?.tableTopic.topic ?? "My Table Topic",
    description:
      "Rewatch, transcribe and generate feedback for your table topic",
  };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [user, { id }] = await Promise.all([currentUser(), params]);

  if (!user) throw new Error("You must be signed in to view this page");

  let muxVideo = await getUserVideoById(id);
  if (!muxVideo) return notFound();

  const audioReady = muxVideo.audioRenditionStatus === "READY";

  if (
    !muxVideo.publicPlaybackId ||
    !muxVideo.audioRenditionStatus ||
    !audioReady
  ) {
    muxVideo = await getUpdatedVideo(muxVideo);
  }

  return (
    <Suspense fallback={<VideoPlayerSkeleton />}>
      <div className="space-y-2">
        {!muxVideo?.publicPlaybackId ? <VideoNotProcessed /> : null}
        <VideoPlayer video={muxVideo} />
        <Transcript video={muxVideo} />
      </div>
    </Suspense>
  );
}
