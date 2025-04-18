"use client";

import { getUserVideoById } from "@/app/server/db/queries";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function VideoNotProcessed({
  videoPromise,
}: {
  videoPromise: ReturnType<typeof getUserVideoById>;
}) {
  const video = use(videoPromise);
  const router = useRouter();

  if (video?.readyToStream) return null;

  return (
    <Dialog defaultOpen>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Video still processing</DialogTitle>
          <DialogDescription>
            Some videos can take a short time to process. Please check back
            again soon.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button onClick={() => router.refresh()}>Refresh page</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
