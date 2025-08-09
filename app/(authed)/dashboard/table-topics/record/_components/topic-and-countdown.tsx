import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, Mic } from "lucide-react";
import { motion } from "motion/react";

type CurrentTopicProps = {
  topic: string | null;
  showBackground: boolean;
  countdown: number | null;
};

export default function TopicAndCountdown({
  topic,
  countdown,
}: CurrentTopicProps) {
  // TODO: the card should disappear when the recording starts and a new component should be show.
  // This component will sit at the bottom of the video with a tab style that prompts the user to interacts to see topic again whilst recording.

  return (
    <div className="bg-foreground/10 absolute inset-0 flex size-full flex-col justify-center">
      <div
        data-animate-topic
        className="absolute flex w-full flex-col justify-center gap-6 px-6"
      >
        {/* Topic Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <Card className="mx-auto max-w-2xl border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
            <CardContent className="px-8 py-8 text-center md:py-8">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Mic className="text-primary h-6 w-6" />
                  </div>
                </div>
                <h2 className="text-2xl leading-tight font-bold text-gray-900 md:text-3xl">
                  {topic}
                </h2>
                <p className="text-sm text-gray-600">
                  Prepare your thoughts and get ready to speak
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Countdown Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: countdown !== null ? 1 : 0,
            y: countdown !== null ? 0 : 20,
          }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={cn(
            "space-y-3 text-center",
            countdown !== null ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex items-center justify-center gap-2 text-white">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-medium">Recording starts in</span>
          </div>

          <motion.div
            key={countdown}
            initial={{ scale: 1.1, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center"
          >
            <Badge
              variant="secondary"
              className="border-0 bg-white/20 px-8 py-4 text-4xl font-bold text-white md:text-5xl"
            >
              {countdown ?? 0}
            </Badge>
          </motion.div>

          <p className="text-sm text-white/80">
            Get comfortable and take a deep breath
          </p>
        </motion.div>
      </div>
    </div>
  );
}
