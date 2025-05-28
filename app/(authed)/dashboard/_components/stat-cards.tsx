"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { formatDuration, isSameMonth, subMonths } from "date-fns";
import { Activity, AudioLines, Mic } from "lucide-react";
import { JSX } from "react";

export function TotalVideosCard() {
  const videos = useQuery(api.videos.list);

  const count = videos?.length ?? 0;
  const countThisMonth =
    videos?.filter(({ video }) => isSameMonth(video._creationTime, new Date()))
      .length ?? 0;

  if (!videos) return <StatCardSkeleton />;

  return (
    <StatCard
      title="Saved recordings"
      stat={count}
      relativeStat={`${countThisMonth} this month`}
      icon={<Mic />}
    />
  );
}

export function AverageVideoDurationCard() {
  const videos = useQuery(api.videos.list);

  if (!videos)
    return (
      <StatCard
        title="Average duration"
        stat="--"
        relativeStat="Failed to load"
        icon={<Activity />}
      />
    );

  const getAverage = (data: typeof videos) => {
    const average = data.reduce(
      (acc, { video }) => (acc += video?.duration ?? 0),
      0,
    );

    return Math.round(average / data.length);
  };

  const lastMonthsVideos = videos.filter(({ video }) =>
    isSameMonth(subMonths(new Date(), 1), video._creationTime),
  );
  const averageDuration = getAverage(videos);
  const lastMonthAverageDuration = getAverage(lastMonthsVideos);

  const difference = averageDuration - lastMonthAverageDuration;
  const differenceString =
    difference > 0
      ? `+${difference}s from last month`
      : `${difference}s from last month`;

  return (
    <StatCard
      title="Average duration"
      stat={formatDuration({ seconds: parseFloat(averageDuration.toFixed(2)) })}
      relativeStat={lastMonthAverageDuration ? differenceString : undefined}
      icon={<Activity />}
    />
  );
}

export function TotalVideoDurationCard() {
  const videos = useQuery(api.videos.list);

  if (!videos)
    return (
      <StatCard
        title="Average duration"
        stat="--"
        relativeStat="Failed to load"
        icon={<Activity />}
      />
    );

  const thisMonthsVideos = videos.filter(({ video }) =>
    isSameMonth(new Date(), video._creationTime),
  );

  const totalDuration = videos.reduce(
    (acc, { video }) => (acc += video.duration!),
    0,
  );
  const thisMonthsTotalDuration = thisMonthsVideos.reduce(
    (acc, { video }) => (acc += video?.duration ?? 0),
    0,
  );
  return (
    <StatCard
      title="Total recording time"
      stat={formatDuration({ seconds: parseFloat(totalDuration.toFixed(2)) })}
      relativeStat={
        thisMonthsTotalDuration
          ? `${formatDuration({ seconds: parseFloat(thisMonthsTotalDuration.toFixed(2)) })} recorded this month`
          : "No recordings this month"
      }
      icon={<AudioLines />}
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
        <div className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{stat}</div>
        {relativeStat ? (
          <p className="text-muted-foreground text-xs">{relativeStat}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return <Skeleton className="h-36 w-full" />;
}
