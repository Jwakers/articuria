"use client";

import { syncStripeDataToClerk } from "@/app/server/stripe/sync-stripe";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Download,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SubscriptionSuccessPage() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    syncStripeDataToClerk().then((res) => {
      console.log(res);
    });
  }, []);

  useEffect(() => {
    const launchConfetti = () => {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#FF4D8F", "#A855F7", "#8B5CF6"];
      (async function frame() {
        const confetti = (await import("canvas-confetti")).default;

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });

        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    };

    // Small delay to ensure the component is mounted
    const timer = setTimeout(() => {
      launchConfetti();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-purple-50">
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>

            <h1 className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Subscription Successful!
            </h1>

            <p className="mt-4 text-lg text-gray-600">
              Thank you for subscribing to our Pro plan, {userName}! Your
              account has been upgraded.
            </p>
          </div>

          <div className="mb-8 rounded-xl border bg-white p-6 shadow-md">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-semibold">Pro Plan</h2>
                <p className="text-sm text-muted-foreground">
                  Started on {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">$9.99/month</div>
                <p className="text-xs text-muted-foreground">
                  Next billing date:{" "}
                  {new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="py-4">
              <h3 className="mb-3 text-sm font-medium">
                Your subscription includes:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="flex-shrink-0 rounded-full bg-purple-100 p-1">
                    <CheckCircle className="h-3 w-3 text-purple-600" />
                  </div>
                  <span>Unlimited access to all premium features</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="flex-shrink-0 rounded-full bg-purple-100 p-1">
                    <CheckCircle className="h-3 w-3 text-purple-600" />
                  </div>
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="flex-shrink-0 rounded-full bg-purple-100 p-1">
                    <CheckCircle className="h-3 w-3 text-purple-600" />
                  </div>
                  <span>Early access to new features</span>
                </li>
              </ul>
            </div>
          </div>

          <h2 className="mb-4 text-xl font-semibold">Next Steps</h2>

          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <Card className="p-4 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 rounded-full bg-pink-100 p-2">
                  <Sparkles className="h-4 w-4 text-pink-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-medium">Explore Premium Features</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Discover all the new features available with your Pro
                    subscription.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1 text-sm font-medium text-pink-600 hover:text-pink-700"
                  >
                    Go to Dashboard <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-4 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 rounded-full bg-purple-100 p-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-medium">Read Documentation</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Learn how to make the most of your new Pro subscription.
                  </p>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    View Documentation <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/subscription/invoice">
                <Download className="mr-2 h-4 w-4" /> Download Invoice
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            Need help with your subscription?{" "}
            <Link
              href="/help"
              className="font-medium underline underline-offset-4"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
