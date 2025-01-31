import { JSX } from "react";

import {
  getUserVideoCount,
  getUserVideoDurationData,
} from "@/app/server/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/utils";
import { Activity, Mic } from "lucide-react";

export async function TotalVideosCard() {
  const { videoCount, countThisMonth } = await getUserVideoCount();

  return (
    <StatCard
      title="Saved recordings"
      stat={videoCount}
      relativeStat={`${countThisMonth} this month`}
      icon={<Mic />}
    />
  );
}

export async function AverageVideoDurationCard() {
  const { averageDuration, lastMonthAverageDuration } =
    await getUserVideoDurationData();

  const difference = averageDuration - lastMonthAverageDuration;
  const differenceString =
    difference > 0
      ? `+${formatDuration(difference)} from last month`
      : `${formatDuration(difference)} from last month`;

  return (
    <StatCard
      title="Average duration"
      stat={formatDuration(averageDuration)}
      relativeStat={lastMonthAverageDuration ? differenceString : undefined}
      icon={<Activity />}
    />
  );
}

export async function TotalVideoDurationCard() {
  const { totalDuration, thisMonthsTotalDuration } =
    await getUserVideoDurationData();

  return (
    <StatCard
      title="Total recording time"
      stat={formatDuration(totalDuration)}
      relativeStat={`${formatDuration(
        thisMonthsTotalDuration
      )} recorded this month`}
      icon={<Activity />}
    />
  );
}

function StatCard({
  title,
  stat,
  relativeStat,
  icon,
}: {
  title: string;
  stat: string | number;
  relativeStat?: string;
  icon: JSX.Element;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between gap-2 items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{stat}</div>
        {relativeStat ? (
          <p className="text-xs text-muted-foreground">{relativeStat}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return <Skeleton className="w-full h-36" />;
}
