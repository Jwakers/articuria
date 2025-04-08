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
import Spinner from "@/components/ui/spinner";
import useManageVideo from "@/hooks/use-manage-video";
import { ROUTES } from "@/lib/constants";
import { Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";

type VideoPlayerProps = {
  videoPromise: ReturnType<typeof getUserVideoById>;
};

export default function VideoPlayer({ videoPromise }: VideoPlayerProps) {
  const video = use(videoPromise);
  const router = useRouter();
  const {
    isDeleting,
    deleteVideo,
    isDownloading,
    downloadVideo,
    downloadUrl,
    downloadDialogOpen,
    setDownloadDialogOpen,
  } = useManageVideo({ video });

  const handleDelete = async () => {
    await deleteVideo({
      successCallback: () => router.push(ROUTES.dashboard.tableTopics.manage),
    });
  };

  const handleDownload = async () => {
    if (downloadUrl) return setDownloadDialogOpen(true);
    await downloadVideo();
  };

  const handleDownloadClick = () => {
    if (!downloadUrl) return;

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document);

    if (isIOS) {
      window.open(downloadUrl, "_blank");
    }

    setDownloadDialogOpen(false);
    toast.success("Download started");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-2xl font-bold">{video?.tableTopic.topic}</h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <iframe
          title={`Video for topic: ${video?.tableTopic.topic}`}
          src={`https://iframe.videodelivery.net/${video?.cloudflareId}`}
          className="aspect-video w-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
          loading="lazy"
        ></iframe>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <AlertDialog
            open={downloadDialogOpen}
            onOpenChange={setDownloadDialogOpen}
          >
            <Button
              variant="secondary"
              onClick={handleDownload}
              disabled={isDownloading}
              aria-busy={isDownloading}
              aria-live="polite"
            >
              {isDownloading ? <Spinner /> : <Download />}
              <span>{isDownloading ? "Downloading..." : "Download"}</span>
            </Button>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Click Download to start downloading your video
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDownloadDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDownloadClick}
                  disabled={!downloadUrl}
                >
                  <a
                    href={downloadUrl ?? "/"}
                    download
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Download
                  </a>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
          <Skeleton className="h-9 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}
