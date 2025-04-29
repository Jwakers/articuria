"use server";

import { getUserVideoDetails } from "@/app/server/db/queries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { AlertCircle } from "lucide-react";

export default async function VideoLimitAlert() {
  const [{ videoCount }, current] = await Promise.all([
    getUserVideoDetails(),
    currentUser(),
  ]);
  const { user, accountLimits } = userWithMetadata(current);

  const showWarning = user && videoCount >= accountLimits.tableTopicLimit;

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
