"use client";

import { getUserVideoById } from "@/app/server/db/queries";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useManageVideo from "@/hooks/use-manage-video";
import { ROUTES } from "@/lib/constants";

import MuxPlayer from "@mux/mux-player-react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type VideoPlayerProps = {
  video: Awaited<ReturnType<typeof getUserVideoById>>;
};

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const router = useRouter();
  const { isDeleting, deleteVideo } = useManageVideo({ video });

  const handleDelete = async () => {
    await deleteVideo({
      successCallback: () => router.push(ROUTES.dashboard.tableTopics.manage),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-xl font-bold md:text-2xl">
            {video?.tableTopic.topic}
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {video?.publicPlaybackId ? (
          <MuxPlayer playbackId={video?.publicPlaybackId} />
        ) : (
          <Skeleton className="aspect-video w-full rounded" />
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="h-4 w-4" />
                Delete Video
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your video from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

export function VideoPlayerSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-44" />
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <Skeleton className="aspect-video w-full" />
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-9 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
