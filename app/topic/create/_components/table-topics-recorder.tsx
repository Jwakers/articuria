"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Download, Save, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const useMediaRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  const setVideoToStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      if (!videoElementRef.current)
        throw new Error("Unable to set stream to video");

      videoElementRef.current.srcObject = streamRef.current;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to access camera/microphone";
      // TODO: Add toast or alert component to show error to user and re request access to media stream
      console.error("Error accessing media devices:", message);
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) await setVideoToStream();
    if (!streamRef.current) throw new Error("Unable to set media stream");
    mediaRecorderRef.current = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedBlob(event.data);
        setRecordedVideoURL(URL.createObjectURL(event.data));
      }
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    if (videoElementRef.current) videoElementRef.current.srcObject = null;
    setIsRecording(false);
  };

  const resetRecording = () => {
    setIsRecording(false);
    setRecordedBlob(null);
    setRecordedVideoURL(null);
    setVideoToStream();
    if (recordedVideoURL) URL.revokeObjectURL(recordedVideoURL);
    if (!streamRef.current) return;
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRecording) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setTimeElapsed(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    void setVideoToStream();

    return () => {
      if (recordedVideoURL) URL.revokeObjectURL(recordedVideoURL);
    };
  }, []);

  return {
    isRecording,
    recordedBlob,
    recordedVideoURL,
    timeElapsed,
    videoElementRef,
    startRecording,
    stopRecording,
    resetRecording,
  };
};

// Mock function to generate a table topic
const generateTopic = () => {
  const topics = [
    "If you could have dinner with any historical figure, who would it be and why?",
    "Describe a time when you had to think on your feet.",
    "What's the most valuable lesson you've learned in life so far?",
    "If you could instantly become an expert in one subject, what would it be?",
    "Describe your perfect day from start to finish.",
  ];
  return topics[Math.floor(Math.random() * topics.length)];
};

export default function TableTopicsRecorder() {
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
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
    setCurrentTopic(generateTopic());
    startRecording();
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
          <CardTitle>Table Topics Recorder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerateTopic} disabled={isRecording}>
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
