import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { validateFile } from "@/lib/utils";
import { useAction } from "convex/react";
import ky from "ky";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUser } from "./use-user";

export const useMediaRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedVideoId, setSavedVideoId] = useState<Id<"videos"> | null>(null);
  const uploadAction = useAction(api.actions.mux.upload);

  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const hasInitUserMedia = useRef(false);
  const { user, accountLimits } = useUser();

  const setVideoToStream = async () => {
    if (streamRef.current || hasInitUserMedia.current) return;

    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 24, max: 30 },
      },
      audio: true,
    };
    hasInitUserMedia.current = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (!videoElementRef.current)
        throw new Error("Unable to set stream to video");

      videoElementRef.current.srcObject = streamRef.current;
      hasInitUserMedia.current = false;
    } catch (error) {
      console.error(error);
      toast.error("Error accessing media devices.", {
        description:
          "Failed to access camera/microphone. Please ensure they are not in use by another application. And are authorized for use in your browser.",
      });
      hasInitUserMedia.current = false;
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) await setVideoToStream();
    if (!streamRef.current) throw new Error("Unable to set media stream");

    // Check for supported MIME types and set fallback
    const mimeType = MediaRecorder.isTypeSupported("video/webm; codecs=vp8")
      ? "video/webm; codecs=vp8"
      : MediaRecorder.isTypeSupported(
            "video/mp4; codecs=avc1.42E01E, mp4a.40.2",
          )
        ? "video/mp4; codecs=avc1.42E01E, mp4a.40.2"
        : null;

    if (!mimeType) throw new Error("No supported MIME type found");

    const options = {
      mimeType,
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

  const resetRecording = async () => {
    setIsRecording(false);
    setRecordedBlob(null);
    setRecordedVideoURL(null);
    setSavedVideoId(null);
    if (recordedVideoURL) URL.revokeObjectURL(recordedVideoURL);
    if (!streamRef.current) return;
    const tracks = streamRef.current.getTracks();
    tracks.forEach((track) => track.stop());
    streamRef.current = null;
    await setVideoToStream();
  };

  const uploadVideo = async ({
    title,
    tableTopicId,
  }: {
    title: string;
    tableTopicId: Id<"tableTopics">;
  }) => {
    if (!title?.trim()) throw new Error("Title is required");
    if (!tableTopicId) throw new Error("Table topic ID is required");
    if (!user) throw new Error("Unauthorized");
    if (!recordedBlob) throw new Error("No recorded video found");

    const file = new File([recordedBlob], `${title.trim()}.webm`, {
      type: recordedBlob.type,
    });

    try {
      validateFile({ file, accountLimits });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload video. Please try again later.",
      );
      return;
    }

    setIsSaving(true);

    const promise = async () => {
      const { upload, videoId } = await uploadAction({
        title,
        tableTopicId,
      });

      await ky.put(upload.url, {
        body: recordedBlob,
      });

      return videoId;
    };

    toast.promise(promise(), {
      loading: "Saving...",
      success: (videoId) => {
        setSavedVideoId(videoId);
        return "Recording saved";
      },
      error: (error) => {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        return `Recording failed to save: ${message}`;
      },
      finally: () => {
        setIsSaving(false);
      },
    });
  };

  const stopMediaStream = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (recordedVideoURL) URL.revokeObjectURL(recordedVideoURL);

    mediaRecorderRef.current = null;
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
      stopMediaStream();
    };
  }, []);

  return {
    isRecording,
    recordedBlob,
    recordedVideoURL,
    timeElapsed,
    videoElementRef,
    isSaving,
    savedVideoId,
    startRecording,
    stopRecording,
    resetRecording,
    uploadVideo,
  };
};
