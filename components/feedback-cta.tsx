"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONTACT_FORM_REASONS, ROUTES } from "@/lib/constants";
import { MessageSquareHeart } from "lucide-react";
import Link from "next/link";

export default function FeedbackSection() {
  return (
    <Card className="bg-accent text-accent-foreground dark:border-white max-w-[760px]">
      <CardHeader>
        <CardTitle className="opacity-90 flex gap-2 items-center">
          <MessageSquareHeart />
          Your Feedback Matters
        </CardTitle>
      </CardHeader>
      <CardContent className="opacity-90 space-y-4">
        <p>
          We're committed to continually improving our service, and your input
          is invaluable in this process.
        </p>
        <p>
          Whether you have praise, constructive criticism, or ideas for new
          features, we want to hear from you. Every piece of feedback helps us
          shape a better experience for all our users.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link
            href={`${ROUTES.dashboard.contact}?reason=${CONTACT_FORM_REASONS.feedback.key}`}
          >
            Share Your Thoughts
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
