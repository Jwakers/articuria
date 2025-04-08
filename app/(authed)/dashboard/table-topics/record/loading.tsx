import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-44" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
}
