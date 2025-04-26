import { userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Check } from "lucide-react";
import { SubscriptionTrigger } from "./subscription-trigger";

export default async function SubscriptionLanding() {
  const user = userWithMetadata(await currentUser());
  if (!user || user.publicMetadata.subscription === "pro") return null;

  return (
    <section className="bg-gradient-to-b from-background to-highlight/10 py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="bg-gradient-to-r from-highlight to-highlight-secondary bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-4xl md:text-5xl">
            Premium Features
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Unlock all premium features with our subscription plan and take your
            experience to the next level.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Unlimited Access"
            body="Get unlimited access to all premium content and features
          without restrictions."
          />
          <FeatureCard
            title="Priority Support"
            body="Get priority customer support with guaranteed response within
          24 hours."
          />
          <FeatureCard
            title="Early Access"
            body="Be the first to try new features before they're released to
          the public."
          />
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-xl border bg-background p-8 shadow-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="mb-4 rounded-lg bg-gradient-to-r from-highlight/10 to-highlight-secondary/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium">Pro Plan</div>
                  <div className="text-xl font-bold">
                    [PRICE]
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Cancel anytime. No hidden fees.
                </div>
              </div>

              <ul className="mb-4 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="flex-shrink-0 rounded-full bg-highlight/10 p-1">
                    <Check className="text-highlight-secondary-secondary h-3 w-3" />
                  </div>
                  <span>All premium features included</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="flex-shrink-0 rounded-full bg-highlight/10 p-1">
                    <Check className="text-highlight-secondary-secondary h-3 w-3" />
                  </div>
                  <span>No ads or interruptions</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="flex-shrink-0 rounded-full bg-highlight/10 p-1">
                    <Check className="text-highlight-secondary-secondary h-3 w-3" />
                  </div>
                  <span>Cloud sync across all devices</span>
                </li>
              </ul>
            </div>

            <div className="flex-shrink-0">
              <SubscriptionTrigger className="w-full md:w-auto">
                Upgrade Now
              </SubscriptionTrigger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md">
      <div className="h-2 bg-gradient-to-r from-highlight to-highlight-secondary"></div>
      <div className="p-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-highlight/10 p-2">
          <Check className="text-highlight-secondary-secondary h-5 w-5" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
