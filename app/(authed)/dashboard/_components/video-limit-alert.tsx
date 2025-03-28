"use server";

import { getUserVideoCount } from "@/app/server/db/queries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ACCOUNT_LIMITS } from "@/lib/constants";
import { AlertCircle } from "lucide-react";

export default async function VideoLimitAlert() {
  const { videoCount } = await getUserVideoCount();
  const showWarning = videoCount >= ACCOUNT_LIMITS.free.tableTopicLimit;

  if (!showWarning) return null;

  return (
    <Alert variant="default">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You have reached your account limit for table topics. Upgrade your
        account or delete some videos to save more.
      </AlertDescription>
    </Alert>
  );
}
