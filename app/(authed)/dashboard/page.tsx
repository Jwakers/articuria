import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "View your Table Topics practice statistics and performance metrics",
};

export default async function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<StatCardSkeleton />}>
          <TotalVideosCard />
        </Suspense>
        <Suspense>
          <AverageVideoDurationCard />
        </Suspense>
        <Suspense>
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
    </div>
  );
}
