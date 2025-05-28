"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { DIFFICULTY_MAP, ROUTES, THEME_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { formatDuration } from "date-fns";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import NoVideos from "../../_components/no-videos";

const MemoizedNoVideos = memo(NoVideos);

export function VideoList() {
  const videos = useQuery(api.videos.list);

  if (videos === undefined) return <VideoListSkeleton />;
  if (!videos.length) return <MemoizedNoVideos />;

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-bold md:text-2xl">Manage recordings</h1>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Your recent table topic recordings.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="md:w-[400px]">Topic</TableHead>
              <TableHead className="hidden md:table-cell">Difficulty</TableHead>
              <TableHead className="hidden md:table-cell">Theme</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((data) => {
              const { video, tableTopic } = data;

              return (
                <TableRow key={video._id}>
                  <TableCell className="space-y-1 font-medium">
                    <span>{tableTopic?.topic}</span>{" "}
                    <div className="text-muted-foreground flex justify-between text-xs md:hidden">
                      <div className="flex items-center gap-2">
                        {tableTopic?.difficulty ? (
                          <Badge>{DIFFICULTY_MAP[tableTopic.difficulty]}</Badge>
                        ) : null}
                        <div>
                          {new Date(video._creationTime).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        {video.duration
                          ? formatDuration({
                              seconds: parseFloat(video.duration.toFixed(2)),
                            })
                          : "N/A"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tableTopic?.difficulty ? (
                      <Badge>{DIFFICULTY_MAP[tableTopic.difficulty]}</Badge>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tableTopic?.theme ? THEME_MAP[tableTopic.theme] : "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(video._creationTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span
                      aria-label={`Duration: ${
                        video.duration
                          ? `${Math.floor(video.duration / 60)} minutes and ${
                              video.duration % 60
                            } seconds`
                          : "Not available"
                      }`}
                    >
                      {video.duration
                        ? formatDuration({
                            seconds: parseFloat(video.duration.toFixed(2)),
                          })
                        : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`${ROUTES.dashboard.tableTopics.manage}/${video._id}`}
                      >
                        <Play />
                        <span>View</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        {/* <Pagination currentPage={currentPage} totalPages={totalPages} /> */}
      </CardFooter>
    </Card>
  );
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const text = `Page ${currentPage} of ${totalPages}`;

  return (
    <div className="flex w-full items-end justify-between">
      <span className="text-muted-foreground text-sm" aria-label={text}>
        {text}
      </span>

      <div className="flex gap-2">
        <Link
          href={`${ROUTES.dashboard.tableTopics.manage}?page=${
            currentPage - 1
          }`}
          aria-label="Previous page"
          className={cn(!hasPrev && "pointer-events-none")}
        >
          <Button variant="outline" size="sm" disabled={!hasPrev}>
            <ChevronLeft />
          </Button>
        </Link>
        <Link
          href={`${ROUTES.dashboard.tableTopics.manage}?page=${
            currentPage + 1
          }`}
          aria-label="Next page"
          className={cn(!hasNext && "pointer-events-none")}
        >
          <Button variant="outline" size="sm" disabled={!hasNext}>
            <ChevronRight />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function VideoListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-bold md:text-2xl">Manage recordings</h1>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            Loading your recent Table topic recordings...
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="md:w-[400px]">Topic</TableHead>
              <TableHead className="hidden md:table-cell">Difficulty</TableHead>
              <TableHead className="hidden md:table-cell">Theme</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-[20px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px]" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-[20px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-end justify-between">
          <Skeleton className="h-5 w-32" />

          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
