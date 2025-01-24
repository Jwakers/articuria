import { getVideoUploadUrl, setVideo } from "@/app/server/actions";
import { useUser } from "@clerk/nextjs";
import { Video } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useMediaRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  const user = useUser();

  const setVideoToStream = async () => {
    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 24, max: 30 },
      },
      audio: true,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (!videoElementRef.current)
        throw new Error("Unable to set stream to video");

      videoElementRef.current.srcObject = streamRef.current;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to access camera/microphone";

      console.error("Error accessing media devices:", message);
      toast.error("Error accessing media devices.", {
        description:
          "Failed to access camera/microphone. Please ensure they are not in use by another application. And are authorized for use in your browser.",
      });
    }
  };

  const startRecording = async () => {
    resetRecording();

    if (!streamRef.current) await setVideoToStream();
    if (!streamRef.current) throw new Error("Unable to set media stream");

    const options = {
      mimeType: "video/webm; codecs=vp8",
      videoBitsPerSecond: 500000,
      audioBitsPerSecond: 64000,
    };
    mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
    mediaRecorderRef.current.ondataavailable = async (event) => {
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
    setIsSaved(false);
    if (recordedVideoURL) URL.revokeObjectURL(recordedVideoURL);
    if (!streamRef.current) return;
    const tracks = streamRef.current.getTracks();
    tracks.forEach((track) => track.stop());
    streamRef.current = null;
  };

  const uploadVideo = async ({
    title,
    tableTopicId,
  }: {
    title: string;
    tableTopicId: Video["tableTopicId"];
  }) => {
    // Check if the recordedBlob size exceeds 10MB
    if (recordedBlob && recordedBlob.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds the maximum limit of 10MB");
    }

    setIsUploading(true);

    const { uploadURL, uid } = await getVideoUploadUrl({ title });

    if (!user) throw new Error("Unauthorized");
    if (!uploadURL) throw new Error("Unable to get upload URL");
    if (!recordedBlob) throw new Error("No recorded video found");

    const formData = new FormData();
    formData.append("file", recordedBlob, title);

    try {
      const res = await fetch(uploadURL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Video upload failed: ${res.status}`);

      if (!uid) throw new Error("Could not get video ID");

      // Upload to DB
      setIsSaving(true);
      await setVideo({
        cloudflareId: uid,
        tableTopicId,
      });
      setIsSaving(false);
      setIsSaved(true);
      toast.success("Recording saved");
    } catch (error) {
      console.error(error);
      setIsSaved(false);
      toast.error("Recording failed to save");
    } finally {
      setIsUploading(false);
    }
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

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

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
    isUploading,
    isSaving,
    isSaved,
    startRecording,
    stopRecording,
    resetRecording,
    uploadVideo,
  };
};
