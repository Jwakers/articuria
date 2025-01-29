import { deleteVideo as deleteVideoAction } from "@/app/server/actions";
import { getDownloadDataById } from "@/app/server/cloudflare-actions";
import { Video } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

export default function useManageVideo({ video }: { video: Video | null }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadVideo = async () => {
    setIsDownloading(true);
    if (!video) return toast.error("No video is set");

    try {
      toast.promise(getDownloadDataById(video.cloudflareId), {
        loading: "Downloading video...",
        success: (data) => {
          const link = document.createElement("a");
          if (!(data as any)?.default?.url)
            throw new Error("Download link not found");

          link.href = (data as any).default.url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setIsDownloading(false);

          return "Video downloaded";
        },
        error: (err) => {
          console.log(err);
          setIsDownloading(false);
          return "There was an error downloading this video";
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteVideo = async ({
    successCallback,
  }: {
    successCallback: () => void;
  }) => {
    if (!video) return toast.error("No video is set");
    setIsDeleting(true);

    try {
      toast.promise(deleteVideoAction(video.id), {
        loading: "Deleting video...",
        success: () => {
          successCallback?.();
          return "Video deleted";
        },
        error: (err) => {
          console.log(err);
          return "There was an error deleting this video";
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, deleteVideo, isDownloading, downloadVideo };
}
