import { Doc } from "@/convex/_generated/dataModel";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ACCOUNT_LIMITS, DISFLUENCIES } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateFile({
  file,
  isServer = false,
  accountLimits,
}: {
  file: File;
  isServer?: boolean;
  accountLimits: NonNullable<ReturnType<typeof getAccountLimits>>;
}) {
  if (!file) return;
  if (file.size > accountLimits.videoSizeLimit) {
    throw new Error(
      "File size exceeds the maximum file size on your account. Upgrade your account to increase this limit.",
    );
  }

  // Validate file type
  if (!isServer && file && !file.type.startsWith("video/")) {
    throw new Error("Invalid file type. Only video files are allowed");
  }
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

export function getAccountLimits(user: Doc<"users">) {
  if (user.subscription === "PRO") return ACCOUNT_LIMITS.pro;
  return ACCOUNT_LIMITS.free;
}

export function price(value: number) {
  const GBPound = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });
  return GBPound.format(value);
}

export function disfluencyData(text: string) {
  const words = text.split(" ");
  const data = words.reduce(
    (acc, word) => {
      const cleanedWord = word
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const key = DISFLUENCIES.find((disfluency) => {
        return disfluency === cleanedWord;
      });
      if (!key) return acc;

      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return data;
}
