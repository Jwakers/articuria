import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type CurrentTopicProps = {
  topic: string | null;
  showBackground: boolean;
  move: boolean;
  countdown: number | null;
};

export default function TopicAndCountdown({
  topic,
  showBackground,
  move,
  countdown,
}: CurrentTopicProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 size-full transition-opacity",
        showBackground && !move && "bg-black/60 backdrop-blur-md",
      )}
    >
      <motion.div
        data-animate-topic
        className={cn(
          "absolute flex w-full flex-col justify-center gap-4",
          "hover:!opacity-100",
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
        }}
        animate={
          move
            ? {
                y: "-100%",
                top: "100%",
                scale: 0.8,
                opacity: 0.4,
                transition: { duration: 1 },
              }
            : {
                y: "-50%",
                scale: 1,
                opacity: 1,
                transition: { duration: 1 },
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
            "absolute inset-x-2 top-full py-4 text-center text-xl text-white transition-opacity md:text-2xl",
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
