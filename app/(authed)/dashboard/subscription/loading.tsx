import { Skeleton } from "@/components/ui/skeleton";
import { BillingTabsSkeleton } from "./_components/billing-tabs";

export default function Loading() {
  return (
    <main
      className="max-w-6xl space-y-4"
      aria-busy="true"
      aria-label="Loading subscription information"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-6 w-80" />
      </div>
      <BillingTabsSkeleton />
      <Skeleton className="h-[178px]" />
    </main>
  );
}
