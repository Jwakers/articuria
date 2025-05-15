import { Metadata } from "next";
import { Suspense } from "react";
import PageContent from "./_components/page-content";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Success",
  description:
    "Congratulations on subscribing to Articuria. Get started on your public speaking journey today!",
};

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PageContent />
    </Suspense>
  );
}
