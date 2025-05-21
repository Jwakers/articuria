import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

type CurrentTopicProps = {
  topic: string | null;
  showBackground: boolean;
  countdown: number | null;
};

export default function TopicAndCountdown({
  topic,
  showBackground,
  countdown,
}: CurrentTopicProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  return (
    <div
      className={cn(
        "transition-color absolute inset-0 size-full duration-1000",
        showBackground && "bg-overlay",
      )}
    >
      <motion.div
        data-animate-topic
        className={cn(
          "absolute flex w-full flex-col justify-center gap-4",
          "hover:opacity-100!",
        )}
        initial={{
          y: "-50%",
          top: "50%",
        }}
        exit={{
          y: "-100%",
          x: "-50%",
          top: "100%",
          scale: 0.8,
          transition: {
            duration: 0.6,
          },
        }}
        animate={
          !showBackground
            ? {
                y: "-100%",
                top: "100%",
                scale: 0.8,
                opacity: 0.4,
                transition: { duration: shouldAnimate ? 1 : 0 },
              }
            : {
                y: "-50%",
                scale: 1,
                opacity: 1,
                transition: { duration: shouldAnimate ? 1 : 0 },
              }
        }
      >
        <div className="p-2">
          <Card className="bg-accent text-accent-foreground">
            <CardContent className="pt-3 md:pt-6">
              <p className="text-lg md:text-xl">{topic}</p>
            </CardContent>
          </Card>
        </div>
        <div
          className={cn(
            "absolute inset-x-2 top-full py-4 text-center text-xl text-white md:text-2xl",
            countdown !== null ? "opacity-100" : "opacity-0",
          )}
        >
          Recording starts in{" "}
          <span className="font-bold">{countdown ?? 0}</span>
        </div>
      </motion.div>
    </div>
  );
}
