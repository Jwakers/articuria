import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="grid max-w-xl gap-4 md:grid-cols-2"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading contact form"
    >
      {/* Name field skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Email field skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Reason dropdown skeleton */}
      <div className="space-y-2 md:col-span-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Message textarea skeleton */}
      <div className="space-y-2 md:col-span-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-[150px] w-full" />
      </div>

      {/* Submit button skeleton */}
      <div className="md:col-span-2">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
