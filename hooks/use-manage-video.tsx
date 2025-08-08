import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

export default function useManageVideo({
  video,
}: {
  video: Doc<"videos"> | undefined;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const deleteMutation = useMutation(api.videos.deleteVideo);

  const deleteVideo = async () => {
    if (!video) return toast.error("No video is set");
    setIsDeleting(true);

    try {
      toast.promise(
        deleteMutation({
          videoId: video._id,
        }),
        {
          loading: "Deleting video...",
          success: "Video deleted",
          error: (err) => {
            console.log(err);
            return "There was an error deleting this video";
          },
        },
      );
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
