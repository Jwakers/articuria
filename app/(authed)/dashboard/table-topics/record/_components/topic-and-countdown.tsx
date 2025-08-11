import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Mic } from "lucide-react";
import { motion } from "motion/react";

type CurrentTopicProps = {
  topic: string | null;
  countdown: number | null;
};

export default function TopicAndCountdown({
  topic,
  countdown,
}: CurrentTopicProps) {
  // TODO: the card should disappear when the recording starts and a new component should be show.
  // This component will sit at the bottom of the video with a tab style that prompts the user to interacts to see topic again whilst recording.

  return (
    <div className="absolute inset-0 flex size-full flex-col justify-center bg-black/50 backdrop-blur-sm">
      <div
        data-animate-topic
        className="absolute flex w-full flex-col justify-center gap-6 px-6"
      >
        {/* Topic Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Card className="bg-background/90 mx-auto max-w-2xl border-0 shadow-2xl">
            <CardContent className="px-8 py-8 text-center md:py-8">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Mic className="text-primary h-6 w-6" />
                  </div>
                </div>
                <h2 className="text-2xl leading-tight font-bold md:text-3xl">
                  {topic}
                </h2>
                <p className="text-muted-foreground text-sm">
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
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3 text-center"
        >
          <div className="text-background flex items-center justify-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-medium">Recording starts in</span>
          </div>

          <div
            key={countdown}
            className="inline-flex animate-pulse items-center justify-center"
          >
            <Badge
              variant="secondary"
              className="text-background border-0 bg-white/20 px-8 py-4 text-4xl font-bold md:text-5xl"
            >
              {countdown ?? 0}
            </Badge>
          </div>

          <p className="text-background/80 text-sm">
            Get comfortable and take a deep breath
          </p>
        </motion.div>
      </div>
    </div>
  );
}
