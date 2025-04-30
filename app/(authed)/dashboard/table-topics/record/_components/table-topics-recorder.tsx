"use client";

import { getTableTopic } from "@/app/server/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { useMediaRecorder } from "@/hooks/use-media-recorder";
import { DIFFICULTY_MAP, ROUTES, THEME_MAP } from "@/lib/constants";
import { cn, userWithMetadata } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Difficulty, Theme, Video } from "@prisma/client";
import { Download, HelpCircle, Save, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TopicAndCountdown from "./topic-and-countdown";

const COUNTDOWN_TIME = 5;
const difficultyValues = Object.values(DIFFICULTY_MAP);
const themeValues = Object.values(THEME_MAP);

const formSchema = z.object({
  difficulty: z
    .nativeEnum(Difficulty, {
      message: `Invalid selection, should be one of ${difficultyValues.join(", ")}`,
    })
    .optional(),
  theme: z
    .nativeEnum(Theme, {
      message: `Invalid selection, should be one of ${themeValues.join(", ")}`,
    })
    .optional(),
});

export default function TableTopicsRecorder() {
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const topicId = useRef<Video["tableTopicId"] | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { accountLimits } = userWithMetadata(useUser().user);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const canSetDifficulty = accountLimits?.tableTopicOptions.difficulty;
  const canSetTheme = accountLimits?.tableTopicOptions.theme;

  const {
    isRecording,
    isSaving,
    isSaved,
    savedVideoId,
    recordedVideoURL,
    videoElementRef,
    timeElapsed,
    startRecording,
    stopRecording,
    resetRecording,
    uploadVideo,
  } = useMediaRecorder();

  const onSubmit = ({ difficulty, theme }: z.infer<typeof formSchema>) => {
    if ((difficulty && !canSetDifficulty) || (theme && !canSetTheme)) {
      toast.error("Upgrade your account to use table topic options");
      return;
    }

    startTransition(async () => {
      try {
        if (currentTopic) handleDiscardRecording(); // Note: awaiting here causes some strange behaviour where the stream is not properly reset
        const { topic, id } = await getTableTopic({
          difficulty,
          theme,
        });
        setCurrentTopic(topic);
        topicId.current = id;
        setCountdown(COUNTDOWN_TIME);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to generate topic";
        toast.error(message);
      }
    });
  };

  const handleSaveRecording = async () => {
    if (!topicId.current)
      return toast.error("Topic ID not set. Please generate a new topic.");

    await uploadVideo({
      title: currentTopic ?? "Table topic",
      tableTopicId: topicId.current,
    });
  };

  const handleDownloadRecording = () => {
    if (!recordedVideoURL)
      return toast.error("No recording was found. Please try again.");

    const downloadLink = document.createElement("a");
    downloadLink.style.display = "none";
    downloadLink.href = recordedVideoURL;
    downloadLink.download = "table-topic.webm";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDiscardRecording = async () => {
    await resetRecording();
    setCurrentTopic(null);
    topicId.current = null;
  };

  const getTimingColor = () => {
    if (timeElapsed <= 60) return "bg-transparent";
    if (timeElapsed > 120) return "bg-red-500";
    if (timeElapsed > 90) return "bg-amber-500";
    if (timeElapsed > 60) return "bg-green-500";
  };

  const timingColor = getTimingColor();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      startRecording();
      setCountdown(null);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, startRecording]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl">Table topics recorder</h1>
          <a
            href="#table-topics-guide"
            title="Find out more about table topics"
            aria-label="Learn about table topics"
          >
            <HelpCircle className="size-4" />
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-2 md:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="difficulty"
              disabled={!canSetDifficulty}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={cn(!canSetDifficulty && "text-muted-foreground")}
                  >
                    Difficulty
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(DIFFICULTY_MAP).map(([key, val]) => (
                        <SelectItem value={key} key={key}>
                          {val}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="theme"
              disabled={!canSetTheme}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={cn(!canSetTheme && "text-muted-foreground")}
                  >
                    Theme
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(THEME_MAP).map(([key, val]) => (
                        <SelectItem value={key} key={key}>
                          {val}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!canSetDifficulty && !canSetTheme ? (
              <p className="text-sm text-muted-foreground md:col-span-2">
                Setting options for table topics are only available for paid
                users.
              </p>
            ) : null}
            <Button
              disabled={
                isRecording ||
                isPending ||
                (countdown !== null && countdown > 0)
              }
              className="md:col-span-2"
              type="submit"
              size="lg"
            >
              {isPending ? <Spinner /> : null}
              {!recordedVideoURL ? "Generate topic" : "Generate new topic"}
            </Button>
          </form>
        </Form>
        <div className="relative aspect-video overflow-hidden rounded-md bg-accent">
          <video
            ref={videoElementRef}
            className="h-full w-full"
            autoPlay={!recordedVideoURL} // Autoplay is required to see the stream without manually calling .play()
            muted={!recordedVideoURL}
            controls={!!recordedVideoURL}
            src={recordedVideoURL || undefined}
            playsInline
            aria-label="Table topic recording preview"
          />
          {isRecording ? (
            <div className="absolute right-4 top-4 flex size-4 items-center justify-center md:size-6">
              <span
                className={cn(
                  "absolute inline-flex size-full animate-ping rounded-full",
                  timingColor,
                )}
              />
              <span
                className={cn(
                  "relative inline-flex size-full rounded-full",
                  timingColor,
                )}
              />
            </div>
          ) : null}

          <AnimatePresence>
            {isPending && !currentTopic && !recordedVideoURL ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                }}
                className="absolute inset-0 flex items-center justify-center bg-overlay text-overlay-foreground"
              >
                <Spinner />
              </motion.div>
            ) : null}

            {/* Backdrop blur must be outside of conditional rendering to properly transition */}
            <div
              key="backdrop-blur"
              className={cn(
                "pointer-events-none absolute inset-0 backdrop-blur-sm transition-opacity duration-500",
                currentTopic && !recordedVideoURL && !isRecording
                  ? "opacity-100"
                  : "opacity-0",
              )}
            />
            {currentTopic && !recordedVideoURL ? (
              <motion.div
                key={currentTopic}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TopicAndCountdown
                  topic={currentTopic}
                  countdown={countdown}
                  showBackground={!isRecording}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        {isRecording && (
          <div className="flex justify-between">
            <Button onClick={stopRecording} variant="destructive">
              Stop Recording
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {recordedVideoURL && (
          <div className="flex w-full flex-wrap justify-between gap-4">
            <div className="flex gap-2">
              {!isSaved ? (
                <Button
                  onClick={handleSaveRecording}
                  disabled={isSaving}
                  aria-busy={isSaving}
                  aria-live="polite"
                >
                  {isSaving ? <Spinner /> : <Save />}
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              ) : null}
              {savedVideoId ? (
                <Button asChild variant="link">
                  <Link
                    href={`${ROUTES.dashboard.tableTopics.manage}/${savedVideoId}`}
                  >
                    Go to video
                  </Link>
                </Button>
              ) : null}
              <Button onClick={handleDownloadRecording} variant="secondary">
                <Download />
                Download
              </Button>
            </div>
            {!isSaved ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your video from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDiscardRecording}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : null}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
