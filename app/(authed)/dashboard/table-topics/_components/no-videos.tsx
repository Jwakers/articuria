import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { Brain, LucideProps, Mic, Users, Video, Zap } from "lucide-react";
import Link from "next/link";

export default function NoVideos() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Embark on Your Speaking Adventure</CardTitle>
        <CardDescription>
          Unleash your impromptu speaking skills with Articuria!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            Table topics are your gateway to mastering the art of thinking on
            your feet. In just 1-2 minutes, transform a surprise subject into a
            captivating mini-speech. It&apos;s not just practice—it&apos;s your
            personal growth adventure!
          </p>
          <h3 className="text-lg font-semibold">Unlock These Superpowers:</h3>
          <div className="grid gap-2 md:grid-cols-2">
            <BenefitCard
              icon={Brain}
              title="Quick Thinking"
              description="Organize thoughts at lightning speed"
            />
            <BenefitCard
              icon={Mic}
              title="Confidence Boost"
              description="Shine in spontaneous speaking situations"
            />
            <BenefitCard
              icon={Users}
              title="Public Speaking Pro"
              description="Become comfortable addressing any audience"
            />
            <BenefitCard
              icon={Zap}
              title="Concise Communication"
              description="Master the art of impactful brief speeches"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3">
        <h3 className="text-lg font-semibold">Ready to Get Started?</h3>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild>
            <Link href={ROUTES.dashboard.tableTopics.record}>
              <Video className="mr-2 h-4 w-4" /> Record Your First Topic
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center p-4">
        <Icon className="mr-4 h-8 w-8" />
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
