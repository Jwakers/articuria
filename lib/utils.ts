import { ClerkUserPublicMetadata } from "@/app/server/stripe/sync-stripe";
import type { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ACCOUNT_LIMITS, ERROR_CODES } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateFile(file: File, isServer: boolean = false) {
  // Check if the file size exceeds 10MB
  if (file && file.size > ACCOUNT_LIMITS.free.videoSizeLimit) {
    throw new Error(
      "File size exceeds the maximum file size on the free account. Upgrade your account to increase this limit.",
      {
        cause: ERROR_CODES.videoSizeLimitExceeded,
      },
    );
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

export function convertMegabytesToBytes(megabytes: number): number {
  return megabytes * 1024 * 1024;
}

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

type UserResource = ReturnType<typeof useUser>["user"];

export function userWithMetadata(user: User | UserResource | null | undefined) {
  if (!user) return null;
  const metadata: ClerkUserPublicMetadata = user.publicMetadata;

  return { ...user, publicMetadata: metadata };
}

export function price(value: number) {
  const GBPound = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });
  return GBPound.format(value);
}
