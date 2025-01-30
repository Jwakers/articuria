import { getUserVideos } from "@/app/server/db/queries";
import { Suspense } from "react";
import { VideoList, VideoListSkeleton } from "../_components/video-list";

export default function ManageRecordingsPage() {
  const videoListPromise = getUserVideos();

  return (
    <div>
      <div className="space-y-4">
        <Suspense fallback={<VideoListSkeleton />}>
          <VideoList videoListPromise={videoListPromise} />
        </Suspense>
      </div>
    </div>
  );
}
