import { getUserVideos } from "@/app/server/db/queries";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Settings } from "lucide-react";
import { use } from "react";

type VideoListProps = {
  videoListPromise: ReturnType<typeof getUserVideos>;
};

export function VideoList({ videoListPromise }: VideoListProps) {
  const videos = use(videoListPromise);

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
            <TableCell>{new Date(video.createdAt).toLocaleString()}</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell className="text-right">
              {/* Update to a drop down that allows users to view or delete (delete
              should be a modal) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings />
                    <span>Manage</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
