"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import {
  Clock,
  HelpCircle,
  Lightbulb,
  Star,
  Target,
  Video,
} from "lucide-react";

export default function TableTopicsGuide() {
  return (
    <div className="mx-auto w-full max-w-4xl" id="table-topics-guide">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-primary/10 rounded-full p-3">
            <HelpCircle className="text-primary h-8 w-8" />
          </div>
        </div>
        <h2 className="text-foreground mb-3 text-2xl font-bold">
          Table Topics Guide
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl leading-relaxed">
          Learn about Table Topics speeches and how our app helps you practice
          and improve with the{" "}
          <a
            href="https://www.toastmasters.org/membership/club-meeting-roles/table-topics-speaker"
            target="_blank"
            rel="noopener"
            className="text-primary font-medium hover:underline"
          >
            Toastmasters
          </a>{" "}
          timing system.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="table-topics" className="rounded-lg border px-4">
          <AccordionTrigger className="py-4 text-lg font-semibold hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span>What Are Table Topics?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-4 pb-2">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Table Topics is an impromptu speaking exercise that forms a
                    core part of Toastmasters meetings. It&apos;s designed to
                    help members develop their ability to organize thoughts
                    quickly and speak coherently without preparation.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    Our app helps you practice and review your table topics so
                    you can feel confident in your ability to speak in an
                    impromptu setting.
                  </p>
                </div>

                <Card className="border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-blue-900 dark:text-blue-100">
                      How Table Topics Work
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-none space-y-3">
                      {[
                        "A topic will be generated for you at random and displayed above the video",
                        "The video will then start recording your talk automatically",
                        "When you're ready to finish, click the stop recording button",
                        "You can then save or delete the video. Deleted videos don't get another try",
                        "Responses should be 1-2 minutes long (see traffic light system below)",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Badge
                            variant="secondary"
                            className="flex h-6 w-6 items-center justify-center bg-blue-100 p-0 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          >
                            {index + 1}
                          </Badge>
                          <span className="text-sm text-blue-800 dark:text-blue-200">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                Table Topics help develop critical thinking, quick organisation
                of thoughts, and the ability to speak confidently under pressure
                — valuable skills in professional and personal settings.
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="border-green-200/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-green-900 dark:text-green-100">
                      <Star className="h-4 w-4" />
                      Benefits of Table Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "Improves thinking on your feet",
                        "Builds confidence in spontaneous speaking",
                        "Develops concise communication skills",
                        "Reduces filler words and hesitations",
                        "Prepares you for interviews and Q&A sessions",
                      ].map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-purple-900 dark:text-purple-100">
                      <Lightbulb className="h-4 w-4" />
                      Example Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "If you could have dinner with anyone from history, who would it be and why?",
                        "What's the most important lesson you've learned in life?",
                        "Describe a challenge you overcame and what you learned",
                        "If you could change one thing about your city, what would it be?",
                        "What advice would you give to your younger self?",
                      ].map((topic, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="traffic-light" className="rounded-lg border px-4">
          <AccordionTrigger className="py-4 text-lg font-semibold hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span>The Traffic Light System</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-4 pb-2">
              <p className="text-muted-foreground leading-relaxed">
                Toastmasters uses a traffic light system to help speakers manage
                their time. For table topics speeches, the standard timing is:
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <TimingCard
                  colorClass="bg-green-500"
                  time="1:00 - 1:30"
                  description="You should be developing your response"
                />
                <TimingCard
                  colorClass="bg-yellow-500"
                  time="1:30 - 2:00"
                  description="Start wrapping up your thoughts"
                />
                <TimingCard
                  colorClass="bg-red-500"
                  time="Over 2:00"
                  description="Conclude your speech"
                />
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> If you do go over or under the time
                  that is perfectly okay. These are just the guides used in
                  Toastmasters meetings. For practice purposes, go at your own
                  pace and find what suits you best in order to feel like you
                  are improving.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="video-indicators"
          className="rounded-lg border px-4"
        >
          <AccordionTrigger className="py-4 text-lg font-semibold hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                <Video className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <span>Video Overlay Indicators</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-4 pb-2">
              <p className="text-muted-foreground leading-relaxed">
                Our app displays coloured circle indicators that overlay your
                recorded videos to help you visualize your timing during review:
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20">
                  <CardHeader>
                    <CardTitle className="text-base font-normal">
                      During recording
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted border-muted-foreground/30 relative flex aspect-video items-center justify-center rounded-lg border-2 border-dashed">
                      <div className="text-muted-foreground text-sm">
                        Video Preview
                      </div>
                      <div className="absolute top-4 right-4 h-6 w-6 animate-pulse rounded-full bg-green-500"></div>
                    </div>
                    <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                      A coloured circle appears in the corner of your screen,
                      changing from green to yellow to red as time progresses.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20">
                  <CardHeader>
                    <CardTitle className="text-base font-normal">
                      Colour key
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                        <div className="h-6 w-6 rounded-full bg-green-500"></div>
                        <div className="text-sm font-medium">
                          Green indicator at 1:00
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950/20">
                        <div className="h-6 w-6 rounded-full bg-yellow-500"></div>
                        <div className="text-sm font-medium">
                          Yellow indicator at 1:30
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
                        <div className="h-6 w-6 rounded-full bg-red-500"></div>
                        <div className="text-sm font-medium">
                          Red indicator at 2:00
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                      These are only guides, based on Toastmasters official
                      rules. There is no penalty when practising from going over
                      or under.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tips" className="rounded-lg border px-4">
          <AccordionTrigger className="py-4 text-lg font-semibold hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <Lightbulb className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Tips for Using the Timing System</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-4 pb-2">
              <p className="text-muted-foreground leading-relaxed">
                Here are some tips to make the most of our timing system:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <ul className="space-y-3">
                  {[
                    "Practice glancing at the indicator without breaking your speech flow",
                    "When you see the yellow light, start wrapping up your main point",
                    "When you see the red light, move directly to your conclusion",
                    "During review, note the timestamps when indicators change to improve your pacing",
                    "Try to finish your speech after the red light appears but before the 2:00 mark",
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground text-sm leading-relaxed">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-emerald-800 dark:from-emerald-950/20 dark:to-teal-950/20">
                  <div className="mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-100">
                      Pro Tip
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-emerald-800 dark:text-emerald-200">
                    The ideal table topic speech has a clear opening, one main
                    point with a supporting example, and a concise conclusion.
                    Structure your practice with this format in mind to master
                    the timing.
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function TimingCard({
  colorClass,
  time,
  description,
}: {
  colorClass: ClassValue;
  time: string;
  description: string;
}) {
  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg transition-shadow duration-200 hover:shadow-xl dark:from-gray-900 dark:to-gray-800">
      <CardContent className="pt-6 pb-6 text-center">
        <div className={cn("mx-auto mb-4 size-10 rounded-full", colorClass)} />
        <div className="mb-3 flex items-center justify-center gap-2">
          <div className={cn("h-4 w-4 rounded-full", colorClass)}></div>
          <span className="text-lg font-bold">{time}</span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
