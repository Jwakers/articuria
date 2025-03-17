import {
  getUserVideoCount,
  getUserVideoDurationData,
} from "@/app/server/db/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/utils";
import { Activity, AudioLines, Mic } from "lucide-react";
import { JSX } from "react";

export async function TotalVideosCard() {
  try {
    const { videoCount, countThisMonth } = await getUserVideoCount();

    return (
      <StatCard
        title="Saved recordings"
        stat={videoCount}
        relativeStat={`${countThisMonth} this month`}
        icon={<Mic />}
      />
    );
  } catch (error) {
    console.error("Failed to fetch video count:", error);
    return (
      <StatCard
        title="Saved recordings"
        stat="--"
        relativeStat="Failed to load"
        icon={<Mic />}
      />
    );
  }
}

export async function AverageVideoDurationCard() {
  try {
    const { averageDuration, lastMonthAverageDuration } =
      await getUserVideoDurationData();

    const difference = averageDuration - lastMonthAverageDuration;
    const differenceString =
      difference > 0
        ? `+${difference}s from last month`
        : `${difference}s from last month`;

    return (
      <StatCard
        title="Average duration"
        stat={formatDuration(averageDuration)}
        relativeStat={lastMonthAverageDuration ? differenceString : undefined}
        icon={<Activity />}
      />
    );
  } catch (error) {
    console.error("Failed to fetch duration data:", error);
    return (
      <StatCard
        title="Average duration"
        stat="--"
        relativeStat="Failed to load"
        icon={<Activity />}
      />
    );
  }
}

export async function TotalVideoDurationCard() {
  try {
    const { totalDuration, thisMonthsTotalDuration } =
      await getUserVideoDurationData();

    return (
      <StatCard
        title="Total recording time"
        stat={formatDuration(totalDuration)}
        relativeStat={
          thisMonthsTotalDuration
            ? `${formatDuration(thisMonthsTotalDuration)} recorded this month`
            : "No recordings this month"
        }
        icon={<AudioLines />}
      />
    );
  } catch (error) {
    console.error("Failed to fetch total duration:", error);
    return (
      <StatCard
        title="Total recording time"
        stat="--"
        relativeStat="Failed to load"
        icon={<AudioLines />}
      />
    );
  }
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
        <div className="flex flex-row items-center justify-between gap-2">
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
  return <Skeleton className="h-36 w-full" />;
}
