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
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DIFFICULTY_OPTIONS, THEME_OPTIONS } from "@/convex/schema";
import { useMediaRecorder } from "@/hooks/use-media-recorder";
import { useUser } from "@/hooks/use-user";
import { DIFFICULTY_MAP, ROUTES, THEME_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "convex/react";
import { Download, HelpCircle, Loader2, Save, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TopicAndCountdown from "./topic-and-countdown";

const COUNTDOWN_TIME = 5;
const DIFFICULTY_VALUES = Object.values(DIFFICULTY_MAP);
const THEME_VALUES = Object.values(THEME_MAP);

const formSchema = z.object({
  difficulty: z
    .enum([...DIFFICULTY_OPTIONS], {
      message: `Invalid selection, should be one of ${DIFFICULTY_VALUES.join(", ")}`,
    })
    .optional(),
  theme: z
    .enum([...THEME_OPTIONS], {
      message: `Invalid selection, should be one of ${THEME_VALUES.join(", ")}`,
    })
    .optional(),
});

export default function TableTopicsRecorder() {
  const [currentTopicId, setCurrentTopicId] =
    useState<Id<"tableTopics"> | null>(null);
  const currentTopic = useQuery(
    api.tableTopics.get,
    currentTopicId ? { topicId: currentTopicId } : "skip",
  );
  const [isPending, startTransition] = useTransition();
  const [countdown, setCountdown] = useState<number | null>(null);
  const { accountLimits } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const canSetDifficulty = accountLimits?.tableTopicOptions.difficulty;
  const canSetTheme = accountLimits?.tableTopicOptions.theme;

  const {
    isRecording,
    isSaving,
    savedVideoId,
    recordedVideoURL,
    videoElementRef,
    timeElapsed,
    startRecording,
    stopRecording,
    resetRecording,
    uploadVideo,
  } = useMediaRecorder();

  const { video } =
    useQuery(api.videos.getEnriched, {
      videoId: savedVideoId ?? undefined,
    }) ?? {};

  const onSubmit = ({ difficulty, theme }: z.infer<typeof formSchema>) => {
    if ((difficulty && !canSetDifficulty) || (theme && !canSetTheme)) {
      toast.error("Upgrade your account to use table topic options");
      return;
    }

    startTransition(async () => {
      try {
        if (currentTopicId) await handleDiscardRecording();
        const topicId = await getTableTopic({
          difficulty,
          theme,
        });

        setCurrentTopicId(topicId);
        setCountdown(COUNTDOWN_TIME);
      } catch (error) {
        console.error(error);
        toast.error("Failed to generate topic");
      }
    });
  };

  const handleSaveRecording = async () => {
    if (!currentTopic?.topic)
      return toast.error("Topic not set. Please generate a new topic.");

    await uploadVideo({
      title: currentTopic?.topic ?? "Table topic",
      tableTopicId: currentTopic?._id,
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
    setCurrentTopicId(null);
  };

  const getTimingColor = () => {
    if (timeElapsed > 120) return "bg-red-500";
    if (timeElapsed > 90) return "bg-amber-500";
    if (timeElapsed > 60) return "bg-green-500";
    return "bg-transparent";
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
          <h1 className="text-xl font-bold md:text-2xl">
            Table topics recorder
          </h1>
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
              <p className="text-muted-foreground text-sm md:col-span-2">
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
              {isPending ? <Loader2 className="animate-spin" /> : null}
              {!recordedVideoURL ? "Generate topic" : "Generate new topic"}
            </Button>
          </form>
        </Form>
        <div className="bg-accent relative aspect-video overflow-hidden rounded-md">
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
            <div className="absolute top-4 right-4 flex size-4 items-center justify-center md:size-6">
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
            {isPending && !currentTopicId && !recordedVideoURL ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                }}
                className="bg-overlay text-overlay-foreground absolute inset-0 flex items-center justify-center"
              >
                <Loader2 className="animate-spin" />
              </motion.div>
            ) : null}

            {/* Backdrop blur must be outside of conditional rendering to properly transition */}
            <div
              key="backdrop-blur-sm"
              className={cn(
                "pointer-events-none absolute inset-0 backdrop-blur-xs transition-opacity duration-500",
                currentTopic?.topic && !recordedVideoURL && !isRecording
                  ? "opacity-100"
                  : "opacity-0",
              )}
            />
            {currentTopic?.topic && !recordedVideoURL ? (
              <motion.div
                key={currentTopic?.topic}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TopicAndCountdown
                  topic={currentTopic?.topic}
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
              {!video ? (
                <Button
                  onClick={handleSaveRecording}
                  disabled={isSaving}
                  aria-busy={isSaving}
                  aria-live="polite"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              ) : null}
              {video?.status === "READY" ? (
                <Button asChild>
                  <Link
                    href={`${ROUTES.dashboard.tableTopics.manage}/${video._id}`}
                  >
                    Go to video
                  </Link>
                </Button>
              ) : null}
              {video && video.status !== "READY" ? (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  Processing video...
                  <Loader2 className="animate-spin" />
                </div>
              ) : null}
              <Button onClick={handleDownloadRecording} variant="secondary">
                <Download />
                Download
              </Button>
            </div>
            {!video ? (
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
