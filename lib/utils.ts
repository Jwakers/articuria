import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateFile(file: File, isServer: boolean = false) {
  // Check if the file size exceeds 10MB
  if (file && file.size > 10 * 1024 * 1024) {
    throw new Error("File size exceeds the maximum limit of 10MB");
  }

  // Validate file type
  if (!isServer && file && !file.type.startsWith("video/")) {
    throw new Error("Invalid file type. Only video files are allowed");
  }
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
