"use client";

import { getTableTopic } from "@/app/server/actions";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { useMediaRecorder } from "@/hooks/use-media-recorder";
import { cn } from "@/lib/utils";
import { Video } from "@prisma/client";
import { Download, Save, Trash2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export default function TableTopicsRecorder() {
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const topicId = useRef<Video["tableTopicId"] | null>(null);

  const {
    isRecording,
    isSaving,
    isSaved,
    recordedVideoURL,
    videoElementRef,
    timeElapsed,
    startRecording,
    stopRecording,
    resetRecording,
    uploadVideo,
  } = useMediaRecorder();

  const handleGenerateTopic = () => {
    startTransition(async () => {
      try {
        const { topic, id } = await getTableTopic();
        setCurrentTopic(topic);
        await startRecording();
        topicId.current = id;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to generate topic";
        toast.error(message);
      }
    });
  };

  const handleSaveRecording = async () => {
    if (!topicId.current)
      return toast.error("Topic ID not set. Please generate a new topic.");

    await uploadVideo({
      title: currentTopic ?? "Table topic",
      tableTopicId: topicId.current,
    });
  };

  const handleDownloadRecording = () => {
    if (!recordedVideoURL)
      return toast.error("No recording was found. Please try again.");

    const downloadLink = document.createElement("a");
    downloadLink.style.display = "none";
    downloadLink.href = recordedVideoURL;
    downloadLink.download = "table-topic.webm";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDiscardRecording = () => {
    resetRecording();
    setCurrentTopic(null);
    topicId.current = null;
  };

  const getTimingColor = () => {
    if (timeElapsed < 90) return "bg-green-500";
    if (timeElapsed < 120) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl md:text-3xl">Table topics recorder</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerateTopic} disabled={isRecording}>
            {isPending ? <Spinner /> : null}
            {!recordedVideoURL ? "Generate topic" : "Generate new topic"}
          </Button>
          {currentTopic && (
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Topic:</h3>
              <p>{currentTopic}</p>
            </div>
          )}
          <div className="aspect-video bg-black rounded-md overflow-hidden relative">
            <video
              ref={videoElementRef}
              className="w-full h-full"
              autoPlay={!recordedVideoURL} // Autoplay is required to see the stream without manually calling .play()
              muted={!recordedVideoURL}
              controls={!!recordedVideoURL}
              src={recordedVideoURL || undefined}
            />
            {isRecording ? (
              <div
                className={cn(
                  "size-4 absolute top-4 right-4 rounded-full",
                  getTimingColor()
                )}
              />
            ) : null}
          </div>
          <div className="flex justify-between">
            {isRecording && (
              <Button onClick={stopRecording} variant="destructive">
                Stop Recording
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {recordedVideoURL && (
            <div className="flex justify-between w-full flex-wrap gap-4">
              <div className="flex gap-2">
                {!isSaved ? (
                  <Button
                    onClick={handleSaveRecording}
                    disabled={isSaving || isSaved}
                  >
                    {isSaving ? <Spinner /> : <Save />}
                    {isSaving ? "Saving..." : "Save recording"}
                  </Button>
                ) : null}
                <Button onClick={handleDownloadRecording} variant="secondary">
                  <Download />
                  Download Recording
                </Button>
              </div>
              {!isSaved ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Video
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your video from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDiscardRecording}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
