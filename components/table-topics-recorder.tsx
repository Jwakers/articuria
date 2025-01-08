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
import { useEffect, useRef, useState } from "react";

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
  const [countdown, setCountdown] = useState<number | null>(null);
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
    startCountdown();
  };

  const startCountdown = () => {
    setCountdown(5);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev !== null && prev > 1) {
          return prev - 1;
        } else {
          clearInterval(countdownRef.current!);
          handleStartRecording();
          return null;
        }
      });
    }, 1000);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
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
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
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
        setTimeElapsed(0);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    }

    if (videoRef.current) {
      videoRef.current;
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
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
  };

  const getTimingColor = () => {
    if (timeElapsed < 60) return "bg-green-500";
    if (timeElapsed < 90) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Table Topics Recorder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGenerateTopic}
            disabled={isRecording || countdown !== null}
          >
            Generate Topic
          </Button>
          {currentTopic && (
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Current Topic:</h3>
              <p>{currentTopic}</p>
            </div>
          )}
          <div className="aspect-video bg-black rounded-md overflow-hidden relative">
            {isRecording || recordedVideoURL ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  autoPlay
                  muted={isRecording}
                  controls={!isRecording}
                  src={recordedVideoURL || undefined}
                />
                <div
                  className={cn(
                    "size-4 absolute top-4 right-4 rounded-full",
                    getTimingColor()
                  )}
                />
              </>
            ) : countdown !== null ? (
              <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold">
                {countdown}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                No video recorded
              </div>
            )}
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
