import SubscriptionLanding from "@/components/subscription/subscription-landing";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { Camera, ChartArea, Zap } from "lucide-react";
import { Suspense } from "react";

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
      <Suspense fallback={null}>
        <SubscriptionLanding />
      </Suspense>
    </div>
  );
}
