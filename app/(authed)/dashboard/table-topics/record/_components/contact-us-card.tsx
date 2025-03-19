import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONTACT_FORM_REASONS, ROUTES } from "@/lib/constants";
import Link from "next/link";

export default function ContactUsCard() {
  return (
    <Card className="max-w-[760px] bg-accent text-accent-foreground dark:border-white">
      <CardHeader>
        <CardTitle>Need more help?</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          If you need additional support or have any questions about this page,
          please don&apos;t hesitate to reach out using our contact form.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link
            href={`${ROUTES.dashboard.contact}?reason=${CONTACT_FORM_REASONS.support.key}`}
          >
            Contact us
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
