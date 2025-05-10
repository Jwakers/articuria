import { deleteAsset } from "@/app/server/mux/mux-actions";
import { MuxVideo } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

export default function useManageVideo({ video }: { video: MuxVideo | null }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  const deleteVideo = async ({
    successCallback,
  }: {
    successCallback: () => void;
  }) => {
    if (!video) return toast.error("No video is set");
    setIsDeleting(true);

    try {
      toast.promise(deleteAsset(video), {
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
    downloadDialogOpen,
    setDownloadDialogOpen,
  };
}
