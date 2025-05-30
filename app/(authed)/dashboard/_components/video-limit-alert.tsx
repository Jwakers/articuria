"use server";

import { getAuthToken, getUser } from "@/app/server/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { AlertCircle } from "lucide-react";

export default async function VideoLimitAlert() {
  const [videos, { user, accountLimits }] = await Promise.all([
    fetchQuery(api.videos.list, undefined, {
      token: await getAuthToken(),
    }),
    getUser(),
  ]);

  const showWarning = user && videos.length >= accountLimits.tableTopicLimit;

  if (!showWarning) return null;

  return (
    <Alert variant="warning">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You have reached your account limit for table topics. Upgrade your
        account or delete some videos to save more.
      </AlertDescription>
    </Alert>
  );
}
