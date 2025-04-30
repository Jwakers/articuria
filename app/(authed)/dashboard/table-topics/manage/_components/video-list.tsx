import { getUserVideos } from "@/app/server/db/queries";
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
import { DIFFICULTY_MAP, ROUTES, THEME_MAP } from "@/lib/constants";
import { cn, formatDuration } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import { memo, use } from "react";
import NoVideos from "../../_components/no-videos";

type VideoListProps = {
  videoListPromise: ReturnType<typeof getUserVideos>;
};

const MemoizedNoVideos = memo(NoVideos);

export function VideoList({ videoListPromise }: VideoListProps) {
  const { videos, totalPages, currentPage } = use(videoListPromise);

  if (!videos.length) return <MemoizedNoVideos />;

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl md:text-3xl">Manage recordings</h1>
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
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="space-y-1 font-medium">
                  <span>{video.tableTopic.topic}</span>
                  <div className="flex justify-between text-xs text-muted-foreground md:hidden">
                    <div className="flex items-center gap-2">
                      {video.tableTopic.difficulty ? (
                        <Badge>
                          {DIFFICULTY_MAP[video.tableTopic.difficulty]}
                        </Badge>
                      ) : null}
                      <div>
                        {new Date(video.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>{formatDuration(video.duration)}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {video.tableTopic.difficulty ? (
                    <Badge>{DIFFICULTY_MAP[video.tableTopic.difficulty]}</Badge>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {video.tableTopic.themes.length
                    ? video.tableTopic.themes
                        .map((t) => THEME_MAP[t])
                        .join(", ")
                    : "N/A"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(video.createdAt).toLocaleDateString()}
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
                    {formatDuration(video.duration)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`${ROUTES.dashboard.tableTopics.manage}/${video.id}`}
                    >
                      <Play />
                      <span>View</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
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
      <span className="text-sm text-muted-foreground" aria-label={text}>
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
        <h1 className="text-2xl md:text-3xl">Manage recordings</h1>
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
