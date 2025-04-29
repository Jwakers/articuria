import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { AlertCircle } from "lucide-react";

export async function SubscriptionAlert() {
  const { publicMetadata } = userWithMetadata(await currentUser());

  if (publicMetadata?.subscriptionData?.status !== "canceled") return null;
  const endDateUnix = publicMetadata.subscriptionData.currentPeriodEnd;

  if (endDateUnix === undefined) return null;

  return (
    <Alert variant="default">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Subscription cancelled!</AlertTitle>
      <AlertDescription>
        Your subscription has been cancelled. After{" "}
        {new Date(endDateUnix * 1000).toLocaleDateString()} you will lose access
        to premium features.
      </AlertDescription>
    </Alert>
  );
}
