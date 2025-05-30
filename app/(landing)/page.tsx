import { Noise } from "@/components/noise-filter";
import SubscriptionLanding from "@/components/subscription/subscription-landing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignedOut, SignUpButton } from "@clerk/nextjs";
import { Camera, ChartBar, Zap } from "lucide-react";
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
      <FeaturesSection />
      <Suspense fallback={null}>
        <SubscriptionLanding />
      </Suspense>
      <CtaSection />
    </>
  );
}

function Hero() {
  return (
    <section className="from-highlight/10 to-highlight-secondary/20 relative overflow-hidden bg-linear-to-br from-50% py-32 md:py-40">
      {/* Background Elements */}
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0 bg-size-[30px_30px] opacity-10"
      />
      <div
        aria-hidden="true"
        className="bg-highlight/20 pointer-events-none absolute top-20 right-10 h-64 w-64 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-highlight-secondary/10 pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full blur-3xl"
      />

      {/* Animated floating shapes */}
      <div
        aria-hidden="true"
        className="motion-safe:animate-float bg-highlight/10 pointer-events-none absolute top-1/4 left-1/4 size-20 rounded-full motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="motion-safe:animate-pulse-slow border-highlight/40 pointer-events-none absolute top-1/3 right-1/4 h-16 w-16 rounded-full border-2 motion-reduce:animate-none"
      />

      {/* Noise texture overlay */}
      <Noise />

      <div className="relative z-10 container mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-in from-highlight to-highlight-secondary text-background mb-2 inline-block rounded-full bg-linear-to-r px-4 py-1 text-sm font-medium">
            AI-Powered Speaking Practice
          </div>
          <h1 className="animate-fade-in gradient-text mb-6 text-5xl font-bold drop-shadow-xs md:text-6xl">
            Master public speaking with confidence
          </h1>
          <p className="animate-fade-in text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Practice impromptu speaking skills with AI-generated topics and
            video recording. Build confidence, track progress, and become a
            better speaker.
          </p>
          <div className="animate-fade-in flex flex-wrap justify-center gap-4">
            <SignedOut>
              <Button
                size="lg"
                variant="subscribe"
                className="animate-bounce-subtle"
                asChild
              >
                <SignUpButton mode="modal">Get Started for Free</SignUpButton>
              </Button>
            </SignedOut>
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
      <div className="absolute right-0 -bottom-1 left-0 h-14">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 h-full w-full drop-shadow-[0_0px_10px_hsl(var(--highlight-secondary)/0.4)]"
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

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="shadow-highlight/20 shadow-md">
      <CardHeader>
        <span aria-hidden="true">{icon}</span>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{description}</CardContent>
    </Card>
  );
}

function FeaturesSection() {
  return (
    <section id="how-it-works" className="bg-background text-foreground pt-24">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="gradient-text mb-4 inline-block text-4xl font-bold md:text-5xl">
            How It Works
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Our platform makes it easy to practice and improve your public
            speaking skills
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Zap className="text-highlight" />}
            title="Smart Topic Generator"
            description="Get personalized, AI-powered table topics based on your interests and speaking goals."
          />
          <FeatureCard
            icon={<Camera className="text-highlight" />}
            title="Practice & Record"
            description="Hone your impromptu speaking by recording real-time responses to random prompts."
          />
          <FeatureCard
            icon={<ChartBar className="text-highlight" />}
            title="Measure Your Growth"
            description="Track your progress, review past performances, and gain insights to improve over time."
          />
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="from-highlight/10 to-highlight-secondary/10 bg-linear-to-b py-24">
      <div className="container mx-auto text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-5xl">
          Ready to Improve Your Public Speaking?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl opacity-90">
          Sign up today and take your communication skills to the next level
        </p>
        <SignedOut>
          <Button size="lg" asChild variant="subscribe">
            <SignUpButton mode="modal">Sign Up Now</SignUpButton>
          </Button>
        </SignedOut>
      </div>
    </section>
  );
}
