import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONTACT_FORM_REASONS, ROUTES } from "@/lib/constants";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ContactUsCard() {
  return (
    <Card className="mx-auto max-w-2xl border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg dark:border-blue-800/50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader className="pb-4 text-center">
        <div className="mb-3 flex justify-center">
          <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
            <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
          Need more help?
        </CardTitle>
        <p className="text-sm font-normal text-blue-700 dark:text-blue-300">
          We&apos;re here to support your public speaking journey
        </p>
      </CardHeader>
      <CardContent className="pb-6 text-center">
        <p className="leading-relaxed text-blue-800 dark:text-blue-200">
          If you need additional support or have any questions about table
          topics, our recording system, or anything else, please don&apos;t
          hesitate to reach out. Our team is ready to help you succeed.
        </p>
      </CardContent>
      <CardFooter className="justify-center pt-0">
        <Button asChild size="lg">
          <Link
            href={`${ROUTES.dashboard.contact}?reason=${CONTACT_FORM_REASONS.support.key}`}
            className="flex items-center gap-2"
          >
            Contact Support
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
