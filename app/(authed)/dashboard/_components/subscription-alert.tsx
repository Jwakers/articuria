import { getUserServer } from "@/app/server/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export async function SubscriptionAlert() {
  const { user } = await getUserServer();

  if (user?.subscriptionData?.status !== "canceled") return null;
  const endDateUnix = user.subscriptionData.currentPeriodEnd;

  if (endDateUnix === undefined) return null;

  return (
    <Alert variant="warning">
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
