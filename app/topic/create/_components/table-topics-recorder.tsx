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
import { cn } from "@/lib/utils";
import { Download, Save, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useMediaRecorder } from "../_hooks";

export default function TableTopicsRecorder() {
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    isRecording,
    recordedVideoURL,
    videoElementRef,
    timeElapsed,
    startRecording,
    stopRecording,
    resetRecording,
  } = useMediaRecorder();

  const handleGenerateTopic = () => {
    startTransition(async () => {
      const { topic } = await getTableTopic();
      setCurrentTopic(topic);
      startRecording();
    });
  };

  const handleSaveRecording = () => {
    console.log("Save recording");
    // Placeholder
  };

  const handleDownloadRecording = () => {
    // TODO: Convert to toast notification
    if (!recordedVideoURL)
      return alert("Error: no recording was found. Please try again");

    const downloadLink = document.createElement("a");
    downloadLink.style.display = "none";
    downloadLink.href = recordedVideoURL;
    downloadLink.download = "table-topic.webm";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDiscardRecording = () => {
    const userResponse = confirm(
      "Are you sure you want to permanently delete this recording?"
    );

    if (!userResponse) return;
    resetRecording();
    setCurrentTopic(null);
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
            Generate Topic
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
                  getTimingColor
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
                <Button onClick={handleSaveRecording}>
                  <Save />
                  Save Recording
                </Button>
                <Button onClick={handleDownloadRecording} variant="secondary">
                  <Download />
                  Download Recording
                </Button>
              </div>
              <Button onClick={handleDiscardRecording} variant="destructive">
                <Trash2 />
                Delete Recording
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
