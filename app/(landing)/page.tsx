import SubscriptionLanding from "@/components/subscription/subscription-landing";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { Camera, ChartArea, Zap } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Unlock your public speaking potential with Articuria's AI-powered practice platform",
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      {/* Features Section */}
      <section className="py-2">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-lg font-semibold md:text-xl">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg p-6 text-center">
              <div className="mb-4 inline-block rounded-full p-4">
                <Zap size={32} />
              </div>
              <h3 className="text-lg font-medium">Generate Topics</h3>
              <p>
                Get AI-powered table topics tailored to your interests and skill
                level
              </p>
            </div>
            <div className="rounded-lg p-6 text-center">
              <div className="mb-4 inline-block rounded-full p-4">
                <Camera size={32} />
              </div>
              <h3 className="text-lg font-medium">Record Your Speech</h3>
              <p>
                Practice your impromptu speaking skills and record your
                performance
              </p>
            </div>
            <div className="rounded-lg p-6 text-center">
              <div className="mb-4 inline-block rounded-full p-4">
                <ChartArea size={32} />
              </div>
              <h3 className="text-lg font-medium">Track Progress</h3>
              <p>
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
          <h2 className="mb-6 text-lg font-semibold md:text-xl">
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
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-highlight/10 from-50% to-highlight-secondary/20 px-6 py-32 md:px-10 md:py-40">
      {/* Background Elements */}
      <div className="bg-dot-pattern absolute inset-0 opacity-20" />
      <div className="absolute right-10 top-20 h-64 w-64 rounded-full bg-highlight/20 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-highlight-secondary/10 blur-3xl" />

      {/* Animated floating shapes */}
      <div className="animate-float absolute left-1/4 top-1/4 size-20 rounded-full bg-highlight/10" />
      <div className="animate-pulse-slow absolute right-1/4 top-1/3 h-16 w-16 rounded-full border-2 border-highlight/20" />

      {/* Texture overlay */}
      <div className="bg-noise absolute inset-0 opacity-5"></div>

      <div className="container relative z-10 mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-in mb-2 inline-block rounded-full bg-gradient-to-r from-highlight to-highlight-secondary px-4 py-1 text-sm font-medium text-background">
            AI-Powered Speaking Practice
          </div>
          <h1 className="animate-fade-in gradient-text mb-6 text-5xl font-bold drop-shadow-sm md:text-6xl">
            Master public speaking with confidence
          </h1>
          <p className="animate-fade-in mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Practice impromptu speaking skills with AI-generated topics and
            video recording. Build confidence, track progress, and become a
            better speaker.
          </p>
          <div className="animate-fade-in flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="subscribe"
              className="animate-bounce-subtle"
              asChild
            >
              <SignUpButton>Get Started for Free</SignUpButton>
            </Button>
            {/* <Button size="lg" variant="outline" asChild>
              TODO: Link to documentation page
              <Link href="#how-it-works">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button> */}
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute -bottom-1 left-0 right-0 h-14">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 h-full w-full drop-shadow-[0_0px_10px_hsl(var(--highlight-secondary)_/_0.4)]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.92,150.07,93.4,221.79,78.45Z"
            className="fill-background"
          ></path>
        </svg>
      </div>
    </section>
  );
}
