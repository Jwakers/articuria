import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="from-background to-highlight/5 flex min-h-screen items-center justify-center bg-linear-to-b">
      <div className="text-center">
        <Loader2 className="text-highlight-secondary mx-auto mb-4 h-10 w-10 animate-spin" />
        <h2 className="text-lg font-semibold md:text-xl">
          Processing your subscription...
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
}
