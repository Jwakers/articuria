import { getUserVideos } from "@/app/server/db/queries";
import { Button } from "@/components/ui/button";
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
import { ROUTES } from "@/lib/constants";
import { formatDuration } from "@/lib/utils";
import { Play } from "lucide-react";
import Link from "next/link";
import { use } from "react";

type VideoListProps = {
  videoListPromise: ReturnType<typeof getUserVideos>;
};

export function VideoList({ videoListPromise }: VideoListProps) {
  const { videos } = use(videoListPromise);

  return (
    <Table>
      <TableCaption>
        A list of your recent Table Topics recordings.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">Topic</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {videos.map((video) => (
          <TableRow key={video.id}>
            <TableCell className="font-medium">
              {video.tableTopic.topic}
            </TableCell>
            <TableCell>
              {new Date(video.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
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
  );
}

export function VideoListSkeleton() {
  return (
    <Table>
      <TableCaption>
        Loading your recent Table Topics recordings...
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">Topic</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Add skeleton rows for loading state */}
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-[20px] rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-[20px] rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-[20px] rounded-full" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-[20px] rounded-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
