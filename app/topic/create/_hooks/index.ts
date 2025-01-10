import { useEffect, useRef, useState } from "react";

export const useMediaRecorder = () => {
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
