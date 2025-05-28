import { Metadata } from "next";
import { Suspense } from "react";
import VideoLimitAlert from "../../_components/video-limit-alert";
import { VideoList } from "./_components/video-list";

export const metadata: Metadata = {
  title: "Table Topics Management",
  description:
    "Effortlessly manage and organize your table topic recordings for enhanced engagement and learning.",
};

export default async function ManageRecordingsPage() {
  // TODO: add back pagination using convex
  return (
    <div className="space-y-2">
      <Suspense fallback={null}>
        <VideoLimitAlert />
      </Suspense>
      <VideoList />
    </div>
  );
}
