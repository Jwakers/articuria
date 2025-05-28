import { getUserServer } from "@/app/server/auth";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";
import { cn, price } from "@/lib/utils";
import { Check } from "lucide-react";
import { SubscriptionTrigger } from "./subscription-trigger";

export default async function SubscriptionLanding() {
  const { user } = await getUserServer();

  return (
    <section className="from-background to-highlight/10 bg-linear-to-b py-12 md:py-24 lg:py-32">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="gradient-text text-3xl font-bold md:text-5xl">
            Premium Features
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-balance">
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
        {user?.subscriptionData?.status !== "active" ? (
          <div className="bg-background mx-auto mt-12 max-w-3xl rounded-xl border p-8 shadow-md">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="from-highlight/10 to-highlight-secondary/10 mb-4 rounded-lg bg-linear-to-r p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-medium">Pro Plan</div>
                    {SUBSCRIPTION_TIERS.pro.price ? (
                      <div className="text-xl font-bold">
                        {price(SUBSCRIPTION_TIERS.pro.price / 100)}
                        <span className="text-muted-foreground text-sm font-normal">
                          /month
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="text-muted-foreground mt-2 text-sm">
                    Cancel anytime. No hidden fees.
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <SubscriptionTrigger className="w-full md:w-auto">
                  Upgrade Now
                </SubscriptionTrigger>
              </div>
            </div>
          </div>
        ) : null}
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
    <div className="bg-background relative overflow-hidden rounded-xl border shadow-xs transition-shadow hover:shadow-md">
      <div className="from-highlight to-highlight-secondary h-2 bg-linear-to-r"></div>
      <div className="p-6">
        <div
          className={cn(
            "bg-highlight/10 mb-4 flex h-10 w-10 items-center justify-center rounded-full p-2",
            {
              "w-auto justify-self-start": comingSoon,
            },
          )}
        >
          {comingSoon ? (
            <div className="text-highlight-secondary rounded-sm p-1 px-2 text-xs font-bold">
              Coming soon
            </div>
          ) : (
            <Check className="text-highlight-secondary h-5 w-5" />
          )}
        </div>
        <h3 className="mb-2 text-lg font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm text-balance">{body}</p>
      </div>
    </div>
  );
}
