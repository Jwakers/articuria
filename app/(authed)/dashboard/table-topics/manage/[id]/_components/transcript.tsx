"use client";

/* 
UI Features
- Button: "Generate Transcript & Feedback"
- Triggers transcript generation and feedback analysis.
- Word-level Interactivity:
    - Hover on a word to:
        - Move/set the audio playhead to the word's timestamp (set to the side with a play on hover icon).
        - Optionally preview playback from that point.

Summary Feedback
- General Stats:
- Total word count
- Duration of the audio (in mm:ss)
- Words per minute (WPM)

Filler Word Analysis:
- Number of filler words detected.
- Optionally list most common filler words.
- Sentiment Analysis:

AI-Generated Review:
- Send transcript to Google AI (or similar) with:
- The intended topic
- The full transcript text
- Filler word count
- Words per minute (pacing)
- Sentiment data

AI returns a topic-specific review focused on:
- Clarity
- Engagement
- Tone
- Speaking pace
- Use of filler words
- Grammar
- Score all of these from one to 10 and return an average
*/

import { getTranscriptionData } from "@/app/server/assembly-ai/assembly-ai-actions";
import { getUserVideoById } from "@/app/server/db/queries";
import { generateTopicReport } from "@/app/server/google-ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/lib/constants";
import { disfluencyData } from "@/lib/utils";
import type { Transcript as TransciptData } from "assemblyai";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

// NOTES
// Users can generate 1 feedback report for free
// When a video is saved a notification should show them they can go to the video and generate feedback for it if their account allows
type Transcript = NonNullable<TranscriptProps["video"]>["transcript"] | null;
type TranscriptProps = {
  video: Awaited<ReturnType<typeof getUserVideoById>>;
};

export default function Transcript({ video }: TranscriptProps) {
  const [transcriptPending, startTranscriptTransition] = useTransition();
  const [reportPending, startReportTransition] = useTransition();

  const [transcript, setTranscript] = useState(video?.transcript);
  const [report, setReport] = useState(video?.transcript?.report);
  const transcriptData = transcript?.data as TransciptData | undefined;

  const handleGenerateTranscript = async () => {
    if (!video?.cloudflareId) {
      toast.error(() => (
        <p>
          Video ID unavailable. Please{" "}
          <Link href={ROUTES.dashboard.contact}>contact support</Link>
        </p>
      ));
      return;
    }

    startTranscriptTransition(async () => {
      if (transcript) return;
      const { data, error } = await getTranscriptionData(video);

      if (error) {
        toast.error(error);
        return;
      }
      setTranscript(data);
    });
  };

  const generateReport = async () => {
    if (!video?.id) {
      toast.error("No video ID");
      return;
    }

    const { data, error } = await generateTopicReport(video.id);
    setReport(data);
  };

  useEffect(() => {
    if (report || reportPending) return;
    startReportTransition(async () => {
      await generateReport();
    });
  }, [report, transcript]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl md:text-2xl">Transcript &amp; Feedback</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!transcript ? (
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Here you can generate a transcript and feedback on your table
              topic performance
            </p>
            <Button
              onClick={handleGenerateTranscript}
              disabled={transcriptPending}
            >
              <span>
                {!transcriptPending ? "Generate feedback" : "Generating..."}
              </span>
              {!transcriptPending ? <ArrowRight /> : <Spinner />}
            </Button>
          </div>
        ) : null}

        {transcript ? (
          <div className="space-y-4">
            <div className="rounded border bg-muted shadow-inner">
              <Table className="border-b">
                <TableHeader>
                  <TableRow className="border-none">
                    <TableHead className="border-r">Time</TableHead>
                    <TableHead>Text</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transcriptData?.sentiment_analysis_results?.map((item) => {
                    return (
                      <TableRow className="border-none" key={item.start}>
                        <TableCell className="border-r py-0">
                          <button
                            className="group flex w-full items-center justify-between gap-1"
                            type="button"
                            // onClick={() => setPlayhead(item.start / 1000)}
                          >
                            <span className="text-xs text-muted-foreground">
                              {(item.start / 1000).toFixed(2)}s
                            </span>
                            <Play className="w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                          </button>
                        </TableCell>
                        <TableCell className="py-0">{item.text}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableCaption className="pb-4 text-center text-sm text-muted-foreground">
                  Transcript generated {new Date().toLocaleDateString()}
                </TableCaption>
              </Table>
            </div>
            <GeneralTable transcript={transcript ?? null} />
            <FillerWordReport transcript={transcript ?? null} />
            {report ? (
              <div className="prose">
                <div className="text-2xl font-medium">Report</div>
                <p className="text-xl font-medium">Short summary</p>
                <p>{report.shortSummary}</p>

                <div>
                  <p className="text-xl font-medium">Creativity</p>
                  <p>{report.creativity}</p>
                  <p>Score: {report.creativityScore}</p>
                </div>
                <div>
                  <p className="text-xl font-medium">Clarity</p>
                  <p>{report.clarity}</p>
                  <p>Score: {report.clarityScore}</p>
                </div>
                <div>
                  <p className="text-xl font-medium">Engagement</p>
                  <p>{report.engagement}</p>
                  <p>Score: {report.engagementScore}</p>
                </div>
                <div>
                  <p className="text-xl font-medium">Pacing</p>
                  <p>{report.pacing}</p>
                  <p>Score: {report.pacingScore}</p>
                </div>
                <div>
                  <p className="text-xl font-medium">Language</p>
                  <p>{report.language}</p>
                  <p>Score: {report.languageScore}</p>
                </div>
                <div>
                  <p className="text-xl font-medium">Tone</p>
                  <p>{report.tone}</p>
                  <p>Score: {report.toneScore}</p>
                </div>
                <p>Average score: {report.averageScore}</p>
                <div>
                  <div className="text-xl font-medium">Recommendations</div>
                  <ul>
                    {report.recommendations?.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xl font-medium">Commendations</div>
                  <ul>
                    {report.commendations?.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xl font-medium">Full summary</p>
                  <p>{report.summary}</p>
                </div>
              </div>
            ) : null}
            {transcript && !report ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Generating report...</span>
                <Spinner />
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function GeneralTable({ transcript }: { transcript: Transcript }) {
  const transcriptData = transcript?.data as TransciptData | undefined;
  if (!transcript || !transcriptData) return null;

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Word count</TableHead>
          <TableHead>Words per minute</TableHead>
          <TableHead>Total duration</TableHead>
          <TableHead>Speaking duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{transcriptData.words?.length}</TableCell>
          <TableCell>{transcript.wordsPerMinute}</TableCell>
          <TableCell>
            {((transcriptData.audio_duration ?? 0) / 60).toFixed(2)}
          </TableCell>
          <TableCell>
            {(transcript.speakingDuration / 1000 / 60).toFixed(2)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function FillerWordReport({ transcript }: { transcript: Transcript }) {
  const transcriptData = transcript?.data as TransciptData | undefined;
  if (!transcript || !transcriptData) return null;
  const words = transcriptData?.words;
  if (!words?.length) return null;

  const data = useMemo(
    () => disfluencyData(words.map((item) => item.text)),
    [],
  );
  const fillerWords = Object.entries(data).map(([word, count]) => ({
    word,
    count,
  }));

  // TODO - on hover these words should be highlighted in the table

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Filler Word</TableHead>
          <TableHead>Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fillerWords.map(({ word, count }) => (
          <TableRow key={word}>
            <TableCell>{word}</TableCell>
            <TableCell>{count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell />
          <TableCell>
            Total: <span>{transcript?.fillerWordCount}</span>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
