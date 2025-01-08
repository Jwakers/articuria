"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [recordingName, setRecordingName] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      if (recordedVideoURL) {
        URL.revokeObjectURL(recordedVideoURL);
      }
    };
  }, [recordedVideoURL]);

  const handleGenerateTopic = () => {
    setCurrentTopic(generateTopic());
    setIsRecording(false);
    setRecordedBlob(null);
    setRecordedVideoURL(null);
    setTimeElapsed(0);
    setRecordingName("");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    handleStartRecording();
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) videoRef.current.srcObject = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedVideoURL(url);
        chunksRef.current = [];
        if (videoRef.current) videoRef.current.srcObject = null;
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  };

  const handleSaveRecording = () => {
    if (recordedBlob && recordingName) {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = recordedVideoURL!;
      a.download = `${recordingName}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleDiscardRecording = () => {
    setCurrentTopic(null);
    setRecordedBlob(null);
    if (recordedVideoURL) {
      URL.revokeObjectURL(recordedVideoURL);
    }
    setRecordedVideoURL(null);
    setTimeElapsed(0);
    setRecordingName("");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const getTimingColor = useMemo(() => {
    if (timeElapsed < 60) return "bg-green-500";
    if (timeElapsed < 90) return "bg-amber-500";
    return "bg-red-500";
  }, [timeElapsed]);

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
              ref={videoRef}
              className="w-full h-full"
              autoPlay
              muted={isRecording}
              controls={!isRecording}
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
            {!isRecording && !recordedVideoURL ? (
              <div className="absolute bg-black inset-0 flex items-center justify-center text-white">
                No video recorded
              </div>
            ) : null}
          </div>
          <div className="flex justify-between">
            {isRecording && (
              <Button onClick={handleStopRecording} variant="destructive">
                Stop Recording
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-4">
            <h3 className="font-semibold">Recording Options:</h3>
            {recordedVideoURL && (
              <>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="recording-name">Recording Name:</Label>
                  <Input
                    id="recording-name"
                    value={recordingName}
                    onChange={(e) => setRecordingName(e.target.value)}
                    placeholder="Enter a name for your recording"
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    onClick={handleSaveRecording}
                    disabled={!recordingName}
                  >
                    Save Recording
                  </Button>
                  <Button onClick={handleDiscardRecording} variant="outline">
                    Discard Recording
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
