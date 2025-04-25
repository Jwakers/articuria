import { SubscriptionTrigger } from "@/components/subscription-trigger";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { Camera, ChartArea, Check, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            Master public speaking with confidence
          </h1>
          <p className="mb-8 text-xl">
            Practice impromptu speaking skills with AI-generated topics and
            video recording
          </p>
          <Button size="lg" variant="secondary" asChild>
            <SignUpButton>Get Started for Free</SignUpButton>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-2">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg p-6 text-center">
              <div className="mb-4 inline-block rounded-full p-4">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-semibold">Generate Topics</h3>
              <p className="">
                Get AI-powered table topics tailored to your interests and skill
                level
              </p>
            </div>
            <div className="rounded-lg p-6 text-center">
              <div className="mb-4 inline-block rounded-full p-4">
                <Camera size={32} />
              </div>
              <h3 className="text-xl font-semibold">Record Your Speech</h3>
              <p className="">
                Practice your impromptu speaking skills and record your
                performance
              </p>
            </div>
            <div className="rounded-lg p-6 text-center">
              <div className="mb-4 inline-block rounded-full p-4">
                <ChartArea size={32} />
              </div>
              <h3 className="text-xl font-semibold">Track Progress</h3>
              <p className="">
                Review your recordings, get feedback, and see your improvement
                over time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Ready to Improve Your Public Speaking?
          </h2>
          <p className="mb-8 text-xl">
            sign up today and take your communication skills to the next level
          </p>
          <SignUpButton>
            <Button size="lg">Sign Up Now</Button>
          </SignUpButton>
        </div>
      </section>

      <section className="to-highlight/10 bg-gradient-to-b from-background py-12 md:py-24 lg:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="from-highlight to-highlight-secondary bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-4xl md:text-5xl">
              Premium Features
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Unlock all premium features with our subscription plan and take
              your experience to the next level.
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
                <div className="from-highlight/10 to-highlight-secondary/10 mb-4 rounded-lg bg-gradient-to-r p-4">
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
                    <div className="bg-highlight/10 flex-shrink-0 rounded-full p-1">
                      <Check className="text-highlight-secondary h-3 w-3" />
                    </div>
                    <span>All premium features included</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="bg-highlight/10 flex-shrink-0 rounded-full p-1">
                      <Check className="text-highlight-secondary h-3 w-3" />
                    </div>
                    <span>No ads or interruptions</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="bg-highlight/10 flex-shrink-0 rounded-full p-1">
                      <Check className="text-highlight-secondary h-3 w-3" />
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
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md">
      <div className="from-highlight to-highlight-secondary h-2 bg-gradient-to-r"></div>
      <div className="p-6">
        <div className="bg-highlight/10 mb-4 flex h-10 w-10 items-center justify-center rounded-full p-2">
          <Check className="text-highlight-secondary h-5 w-5" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
