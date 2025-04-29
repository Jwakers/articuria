"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-highlight-secondary/5 p-6">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-muted-foreground">
          Something went wrong
        </h1>

        <p className="mb-6 text-muted-foreground">
          We encountered an issue while processing your subscription payment.
          Please try again or contact our support team for assistance with your
          payment.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>

          <Button asChild>
            <Link href={ROUTES.dashboard.contact}>Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
