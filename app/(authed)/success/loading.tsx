import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-highlight/5">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-highlight-secondary" />
        <h2 className="text-lg font-semibold md:text-xl">
          Processing your subscription...
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
}
