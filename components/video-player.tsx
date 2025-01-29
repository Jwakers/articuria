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
import { Card, CardContent } from "@/components/ui/card";
import useManageVideo from "@/hooks/use-manage-video";
import { ROUTES } from "@/lib/constants";
import { Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Skeleton } from "./ui/skeleton";

type VideoPlayerProps = {
  videoPromise: ReturnType<typeof getUserVideoById>;
};

export default function VideoPlayer({ videoPromise }: VideoPlayerProps) {
  const video = use(videoPromise);
  const router = useRouter();
  const { isDeleting, deleteVideo } = useManageVideo({ id: video?.id });

  const handleDelete = async () => {
    await deleteVideo({
      successCallback: () => router.push(ROUTES.dashboard.tableTopics.manage),
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">{video?.tableTopic.topic}</h1>
        <iframe
          title={`Video for topic: ${video?.tableTopic.topic}`}
          src={`https://iframe.videodelivery.net/${video?.cloudflareId}`}
          className="aspect-video w-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        ></iframe>
        <div className="mt-4 flex justify-between items-center">
          <Button variant="secondary">
            {/* TODO: Download functionality. Abstract from recorder into a hook */}
            <Download />
            <span>Download</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="w-full aspect-video" />
        <div className="mt-4 flex justify-between items-center">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
