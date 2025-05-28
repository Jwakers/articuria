import { deleteAsset } from "@/app/server/mux/mux-actions";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";

export default function useManageVideo({
  video,
}: {
  video: Doc<"videos"> | undefined;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  const deleteVideo = async () => {
    if (!video) return toast.error("No video is set");
    setIsDeleting(true);

    try {
      toast.promise(deleteAsset(video), {
        loading: "Deleting video...",
        success: "Video deleted",
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
