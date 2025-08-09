"use client";

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
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DIFFICULTY_MAP, THEME_MAP } from "@/convex/constants";
import { DIFFICULTY_OPTIONS, THEME_OPTIONS } from "@/convex/schema";
import { useMediaRecorder } from "@/hooks/use-media-recorder";
import { useUser } from "@/hooks/use-user";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import {
  Clock,
  Download,
  HelpCircle,
  Loader2,
  Mic,
  Play,
  Save,
  Sparkles,
  Square,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TopicAndCountdown from "./topic-and-countdown";

const COUNTDOWN_TIME = 6;
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
  const getTopicMutation = useMutation(api.tableTopics.getNewTopic);
  const [isPending, setIsPending] = useState(false);
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
    useQuery(
      api.videos.getEnriched,
      savedVideoId
        ? {
            videoId: savedVideoId ?? undefined,
          }
        : "skip",
    ) ?? {};

  const onSubmit = async ({
    difficulty,
    theme,
  }: z.infer<typeof formSchema>) => {
    if ((difficulty && !canSetDifficulty) || (theme && !canSetTheme)) {
      toast.error("Upgrade your account to use table topic options");
      return;
    }

    try {
      setIsPending(true);
      if (currentTopicId) await handleDiscardRecording();
      const topicId = await getTopicMutation({
        difficulty,
        theme,
      });

      setCurrentTopicId(topicId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate topic");
      setIsPending(false);
    }
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
    return "bg-blue-500";
  };

  const timingColor = getTimingColor();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!currentTopic?.topic) return;

    setIsPending(false);
    setCountdown(COUNTDOWN_TIME);
  }, [currentTopic]);

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2 text-center">
        <h1 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
          Table Topics Recorder
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          Practice your impromptu speaking skills with AI-generated topics.
          Record your response and get instant feedback to improve your public
          speaking.
        </p>
      </div>

      {/* Main Recording Interface */}
      <Card className="from-background to-muted/20 overflow-hidden border-0 bg-gradient-to-br shadow-lg">
        <CardHeader className="from-primary/5 to-primary/10 border-b bg-gradient-to-r">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Mic className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Ready to Record?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {!currentTopic?.topic
                    ? "Generate a topic to get started"
                    : isRecording
                      ? "Recording in progress..."
                      : "Topic ready - recording will start automatically"}
                </p>
              </div>
            </div>
            {isRecording && (
              <Badge variant="secondary" className="animate-pulse">
                <div className="mr-2 h-2 w-2 animate-ping rounded-full bg-red-500" />
                LIVE
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Topic Generation Form */}
          {!currentTopic?.topic && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4 pt-6">
                <div className="space-y-2 text-center">
                  <Sparkles className="text-primary mx-auto h-8 w-8" />
                  <h3 className="text-lg font-semibold">
                    Customize Your Topic
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Choose difficulty and theme to get a topic tailored to your
                    skill level
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    <FormField
                      control={form.control}
                      name="difficulty"
                      disabled={!canSetDifficulty}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className={cn(
                              "text-sm font-medium",
                              !canSetDifficulty && "text-muted-foreground",
                            )}
                          >
                            Difficulty Level
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(DIFFICULTY_MAP).map(
                                ([key, val]) => (
                                  <SelectItem value={key} key={key}>
                                    {val}
                                  </SelectItem>
                                ),
                              )}
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
                            className={cn(
                              "text-sm font-medium",
                              !canSetTheme && "text-muted-foreground",
                            )}
                          >
                            Topic Theme
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            {...field}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select theme" />
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

                    {!canSetDifficulty && !canSetTheme && (
                      <div className="md:col-span-2">
                        <div className="bg-muted/50 rounded-lg border border-dashed p-4">
                          <p className="text-muted-foreground text-center text-sm">
                            💎 <strong>Pro Feature:</strong> Customize
                            difficulty and theme with a paid subscription
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <Button
                        disabled={isRecording || isPending}
                        className="h-12 w-full text-base font-medium"
                        type="submit"
                        size="lg"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating Topic...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate Topic
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          )}

          {/* Video Recording Area */}
          <div className="space-y-4 pt-6">
            <div className="from-muted/30 to-muted/50 border-muted-foreground/20 relative aspect-video overflow-hidden rounded-xl border-2 border-dashed bg-gradient-to-br">
              <video
                ref={videoElementRef}
                className="h-full w-full object-cover"
                autoPlay={!recordedVideoURL}
                muted={!recordedVideoURL}
                controls={!!recordedVideoURL}
                src={recordedVideoURL || undefined}
                playsInline
                aria-label="Table topic recording preview"
              />

              {/* Recording Status Overlay */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-4 right-4 left-4"
                >
                  <div className="flex items-center justify-between rounded-lg bg-black/70 p-3 text-white backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn("h-3 w-3 rounded-full", timingColor)}
                        />
                        <span className="text-sm font-medium">Recording</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono text-sm font-medium">
                        {formatTime(timeElapsed)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Recording Progress Bar */}
              {isRecording && (
                <div className="absolute right-0 bottom-0 left-0">
                  <Progress
                    value={(timeElapsed / 120) * 100}
                    className="h-1 rounded-none"
                    style={
                      {
                        "--progress-background":
                          timingColor === "bg-red-500"
                            ? "#ef4444"
                            : timingColor === "bg-amber-500"
                              ? "#f59e0b"
                              : timingColor === "bg-green-500"
                                ? "#22c55e"
                                : "#3b82f6",
                      } as React.CSSProperties
                    }
                  />
                </div>
              )}

              {/* Loading Overlay */}
              <AnimatePresence>
                {isPending && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm"
                  >
                    <div className="space-y-4 text-center">
                      <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
                      <p className="font-medium text-white">
                        Generating your topic...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Topic Display */}
              <AnimatePresence>
                {currentTopic?.topic && !isRecording && !recordedVideoURL && (
                  <motion.div
                    key={currentTopic?.topic}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TopicAndCountdown
                      topic={currentTopic?.topic}
                      countdown={countdown}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recording Controls */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  size="lg"
                  className="h-12 px-8 text-base font-medium shadow-lg"
                >
                  <Square className="mr-2 h-5 w-5" />
                  Stop Recording
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>

        {/* Action Buttons */}
        {recordedVideoURL && (
          <CardFooter className="bg-muted/30 border-t">
            <div className="w-full space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Recording Complete!</h4>
              </div>

              <div className="flex flex-wrap gap-3">
                {!video ? (
                  <Button
                    onClick={handleSaveRecording}
                    disabled={isSaving}
                    className="min-w-[120px] flex-1"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Recording
                      </>
                    )}
                  </Button>
                ) : null}

                {video?.status === "READY" ? (
                  <Button asChild className="min-w-[120px] flex-1">
                    <Link
                      href={`${ROUTES.dashboard.tableTopics.manage}/${video._id}`}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      View Video
                    </Link>
                  </Button>
                ) : null}

                {video && video.status !== "READY" ? (
                  <div className="text-muted-foreground bg-muted/50 flex items-center gap-2 rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Processing video...</span>
                  </div>
                ) : null}

                <Button
                  onClick={handleDownloadRecording}
                  variant="outline"
                  className="min-w-[120px] flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>

                {!video && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="min-w-[120px] flex-1"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Recording?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Your recording will be
                          permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDiscardRecording}>
                          Delete Recording
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Help Link */}
      <div className="text-center">
        <a
          href="#table-topics-guide"
          className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          Learn more about table topics
        </a>
      </div>
    </div>
  );
}
