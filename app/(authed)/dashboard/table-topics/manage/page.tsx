import { getUserVideos } from "@/app/server/db/queries";
import { Metadata } from "next";
import { Suspense } from "react";
import VideoLimitAlert from "../../_components/video-limit-alert";
import { VideoList, VideoListSkeleton } from "./_components/video-list";

export const metadata: Metadata = {
  title: "Manage",
  description: "Manage your table topic recordings",
};

export default async function ManageRecordingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: number }>;
}) {
  const { page } = await searchParams;
  const videoListPromise = getUserVideos(page);

  return (
    <div className="space-y-2">
      <VideoLimitAlert />
      <Suspense fallback={<VideoListSkeleton />}>
        <VideoList videoListPromise={videoListPromise} />
      </Suspense>
    </div>
  );
}
