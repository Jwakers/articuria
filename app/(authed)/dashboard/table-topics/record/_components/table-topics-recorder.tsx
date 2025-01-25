"use client";

import { getTableTopic } from "@/app/server/actions";
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
    isUploading,
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

    const promise = uploadVideo({
      title: currentTopic ?? "Table topic",
      tableTopicId: topicId.current,
    });

    toast.promise(promise, {
      loading: "Saving...",
      success: "Recoding saved",
      error: "There was an error saving this recording",
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
    const deleteRecording = () => {
      resetRecording();
      setCurrentTopic(null);
      topicId.current = null;
    };

    toast("Are you sure you want to permanently delete this recording?", {
      action: {
        label: "Delete",
        onClick: deleteRecording,
      },
    });
  };

  const getTimingColor = () => {
    if (timeElapsed < 90) return "bg-green-500";
    if (timeElapsed < 120) return "bg-amber-500";
    return "bg-red-500";
  };

  const getSaveButtonText = () => {
    let saveButtonText = "Save Recording";
    if (isUploading) saveButtonText = "Uploading...";
    if (isSaving) saveButtonText = "Saving...";

    return saveButtonText;
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
                    disabled={isUploading || isSaving || isSaved}
                  >
                    {isUploading || isSaving ? <Spinner /> : <Save />}
                    {getSaveButtonText()}
                  </Button>
                ) : null}
                <Button onClick={handleDownloadRecording} variant="secondary">
                  <Download />
                  Download Recording
                </Button>
              </div>
              {!isSaved ? (
                <Button
                  onClick={handleDiscardRecording}
                  variant="destructive"
                  disabled={isUploading || isSaving}
                >
                  <Trash2 />
                  Delete Recording
                </Button>
              ) : null}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
