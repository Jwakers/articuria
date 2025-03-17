"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container mx-auto flex flex-col items-center gap-y-4 px-4 py-10">
      <h2 className="text-2xl font-bold md:text-4xl">Something went wrong!</h2>
      <div className="flex gap-2">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Button asChild variant="secondary">
          <Link href={ROUTES.landing}>Home</Link>
        </Button>
      </div>
    </section>
  );
}
