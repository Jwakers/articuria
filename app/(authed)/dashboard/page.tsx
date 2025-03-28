import { getUserVideoCount } from "@/app/server/db/queries";
import FeedbackSection from "@/components/feedback-cta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  AverageVideoDurationCard,
  StatCardSkeleton,
  TotalVideoDurationCard,
  TotalVideosCard,
} from "./_components/stat-cards";
import VideoLimitAlert from "./_components/video-limit-alert";
import NoVideos from "./table-topics/_components/no-videos";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "View your Table topics practice statistics and performance metrics",
};

export default async function DashboardPage() {
  const { videoCount } = await getUserVideoCount();

  if (!videoCount) return <NoVideos />;

  return (
    <div className="space-y-4">
      <VideoLimitAlert />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<StatCardSkeleton />}>
          <TotalVideosCard />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <AverageVideoDurationCard />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <TotalVideoDurationCard />
        </Suspense>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Review your table topic recordings</CardTitle>
          <p className="text-muted-foreground">
            Re-watching your public speaking practice videos helps you identify
            areas for improvement, build confidence, and refine your
            communication skills.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href={ROUTES.dashboard.tableTopics.manage}>
                Review recordings
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href={ROUTES.dashboard.tableTopics.record}>
                Record table topics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Separator />
      <FeedbackSection />
    </div>
  );
}
