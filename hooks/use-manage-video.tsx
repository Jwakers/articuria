import { deleteVideo as deleteVideoAction } from "@/app/server/actions";
import { getDownloadDataById } from "@/app/server/cloudflare-actions";
import { Video } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

export default function useManageVideo({ video }: { video: Video | null }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const downloadVideo = async () => {
    setIsDownloading(true);
    if (!video) return toast.error("No video is set");

    try {
      toast.promise(getDownloadDataById(video.cloudflareId), {
        loading: "Getting download...",
        success: (data) => {
          if (!data) throw new Error("Download link not found");

          setDownloadUrl(data.default.url);
          setIsDownloading(false);

          return "Download available";
        },
        error: (err) => {
          console.log(err);
          setIsDownloading(false);
          return "There was an error getting this download";
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

  return {
    isDeleting,
    deleteVideo,
    isDownloading,
    downloadVideo,
    downloadUrl,
    setDownloadUrl,
  };
}
