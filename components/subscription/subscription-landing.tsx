import { SUBSCRIPTION_TIERS } from "@/lib/constants";
import { cn, price, userWithMetadata } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Check } from "lucide-react";
import { SubscriptionTrigger } from "./subscription-trigger";

export default async function SubscriptionLanding() {
  const { user, publicMetadata } = userWithMetadata(await currentUser());
  if (!user || publicMetadata.subscriptionData?.status === "active")
    return null;

  return (
    <section className="bg-gradient-to-b from-background to-highlight/10 py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="bg-gradient-to-r from-highlight to-highlight-secondary bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-4xl md:text-5xl">
            Premium Features
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            Unlock all premium features with our subscription plan and take your
            experience to the next level.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SUBSCRIPTION_TIERS.pro.features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              body={feature.description}
              comingSoon={feature.comingSoon ?? false}
            />
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-xl border bg-background p-8 shadow-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="mb-4 rounded-lg bg-gradient-to-r from-highlight/10 to-highlight-secondary/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium">Pro Plan</div>
                  {SUBSCRIPTION_TIERS.pro.price ? (
                    <div className="text-xl font-bold">
                      {price(SUBSCRIPTION_TIERS.pro.price / 100)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="text-text-muted-foreground mt-2 text-sm">
                  Cancel anytime. No hidden fees.
                </div>
              </div>
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

function FeatureCard({
  title,
  body,
  comingSoon = false,
}: {
  title: string;
  body: string;
  comingSoon: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md">
      <div className="h-2 bg-gradient-to-r from-highlight to-highlight-secondary"></div>
      <div className="p-6">
        <div
          className={cn(
            "mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-highlight/10 p-2",
            {
              "w-auto justify-self-start": comingSoon,
            },
          )}
        >
          {comingSoon ? (
            <div className="rounded-sm p-1 px-2 text-xs font-bold text-highlight-secondary">
              Coming soon
            </div>
          ) : (
            <Check className="h-5 w-5 text-highlight-secondary" />
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-balance text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
