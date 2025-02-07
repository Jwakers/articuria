import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { Camera, ChartArea, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container px-4 mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master public speaking with confidence
          </h1>
          <p className="text-xl mb-8">
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
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg">
              <div className="rounded-full p-4 inline-block mb-4">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-semibold">Generate Topics</h3>
              <p className="">
                Get AI-powered table topics tailored to your interests and skill
                level
              </p>
            </div>
            <div className="text-center p-6 rounded-lg">
              <div className="rounded-full p-4 inline-block mb-4">
                <Camera size={32} />
              </div>
              <h3 className="text-xl font-semibold">Record Your Speech</h3>
              <p className="">
                Practice your impromptu speaking skills and record your
                performance
              </p>
            </div>
            <div className="text-center p-6 rounded-lg">
              <div className="rounded-full p-4 inline-block mb-4">
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
      <section className="relative py-20 overflow-hidden">
        <div className="container px-4 mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Improve Your Public Speaking?
          </h2>
          <p className="text-xl mb-8">
            sign up today and take your communication skills to the next level
          </p>
          <SignUpButton>
            <Button size="lg">Sign Up Now</Button>
          </SignUpButton>
        </div>
      </section>
    </div>
  );
}
