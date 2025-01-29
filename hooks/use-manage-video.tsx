import { deleteVideo as deleteVideoAction } from "@/app/server/actions";
import { Video } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

export default function useManageVideo({
  id,
}: {
  id: Video["id"] | undefined;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteVideo = async ({
    successCallback,
  }: {
    successCallback: () => void;
  }) => {
    if (!id) return toast.error("Video ID is not set");
    setIsDeleting(true);

    try {
      await toast.promise(deleteVideoAction(id), {
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

  return { isDeleting, deleteVideo };
}
