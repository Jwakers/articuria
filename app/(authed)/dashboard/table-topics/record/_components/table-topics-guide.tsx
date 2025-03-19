"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { HelpCircle } from "lucide-react";

export default function TableTopicsGuide() {
  return (
    <div className="w-full max-w-3xl" id="table-topics-guide">
      <div className="mb-4 flex items-center gap-2">
        <HelpCircle className="size-4" />
        <h2 className="text-2xl font-bold">Table Topics Guide</h2>
      </div>

      <p className="mb-6 text-muted-foreground">
        Learn about Table Topics speeches and how our app helps you practice and
        improve with the{" "}
        <a
          href="https://www.toastmasters.org/membership/club-meeting-roles/table-topics-speaker"
          target="_blank"
          rel="noopener"
        >
          Toastmasters
        </a>{" "}
        timing system.
      </p>

      <Accordion type="single" collapsible>
        <AccordionItem value="table-topics">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <span>What Are Table Topics?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <p>
                Table Topics is an impromptu speaking exercise that forms a core
                part of Toastmasters meetings. It's designed to help members
                develop their ability to organize thoughts quickly and speak
                coherently without preparation.
              </p>

              <p>
                Our app helps you practice and review your table topics so you
                can feel confident in your ability to speak in an impromptu
                setting.
              </p>

              <Card className="mt-2 bg-accent text-accent-foreground">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    How Table Topics Work
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      A topic will be generated for you at random. This will be
                      displayed above the video
                    </li>
                    <li>The video will then start recording your talk</li>
                    <li>
                      When you are ready to finish your topic, click the stop
                      recording button
                    </li>
                    <li>
                      You can then either save the video or delete it. If you
                      choose to delete the video, you don't get another try at
                      the same topic. The Topics will always be random.
                    </li>
                    <li>
                      Responses should be 1-2 minutes long (more on this below
                      in the traffic light system section)
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <p className="mt-2">
                Table Topics help develop critical thinking, quick organisation
                of thoughts, and the ability to speak confidently under pressure
                — valuable skills in professional and personal settings.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">
                      Benefits of Table Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      <li>Improves thinking on your feet</li>
                      <li>Builds confidence in spontaneous speaking</li>
                      <li>Develops concise communication skills</li>
                      <li>Reduces filler words and hesitations</li>
                      <li>Prepares you for interviews and Q&A sessions</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">
                      Example Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      <li>
                        If you could have dinner with anyone from history, who
                        would it be and why?
                      </li>
                      <li>
                        What's the most important lesson you've learned in life?
                      </li>
                      <li>
                        Describe a challenge you overcame and what you learned
                      </li>
                      <li>
                        If you could change one thing about your city, what
                        would it be?
                      </li>
                      <li>What advice would you give to your younger self?</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="traffic-light">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <span>The Traffic Light System</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <p>
                Toastmasters uses a traffic light system to help speakers manage
                their time. For table topics speeches, the standard timing is:
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
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

              <p className="mt-2 text-muted-foreground">
                If you do go over or under the time that is perfectly okay.
                These are just the guides used in Toastmasters meetings. For
                practice purposes, go at your own pace and find what suits you
                best in order to feel like you are improving.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="video-indicators">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <span>Video Overlay Indicators</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <p>
                Our app displays coloured circle indicators that overlay your
                recorded videos to help you visualize your timing during review:
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-normal">
                      During recording
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative flex aspect-video items-center justify-center rounded-md bg-secondary">
                      <div className="text-sm text-muted-foreground">
                        Video Preview
                      </div>
                      <div className="absolute right-4 top-4 size-6 rounded-full bg-green-500"></div>
                    </div>
                    <p className="mt-3 text-sm">
                      A coloured circle appears in the corner of your screen,
                      changing from green to yellow to red as time progresses.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-normal">
                      Colour key
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-green-500"></div>
                        <div className="text-sm">Green indicator at 1:00</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-yellow-500"></div>
                        <div className="text-sm">Yellow indicator at 1:30</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-red-500"></div>
                        <div className="text-sm">Red indicator at 2:00</div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
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

        <AccordionItem value="tips">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <span>Tips for Using the Timing System</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <p>Here are some tips to make the most of our timing system:</p>

              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Practice glancing at the indicator without breaking your
                  speech flow
                </li>
                <li>
                  When you see the yellow light, start wrapping up your main
                  point
                </li>
                <li>
                  When you see the red light, move directly to your conclusion
                </li>
                <li>
                  During review, note the timestamps when indicators change to
                  improve your pacing
                </li>
                <li>
                  Try to finish your speech after the red light appears but
                  before the 2:00 mark
                </li>
              </ul>

              <div className="mt-4 rounded-md bg-primary/5 p-4">
                <h4 className="mb-2 font-medium">Pro Tip</h4>
                <p className="text-sm">
                  The ideal table topic speech has a clear opening, one main
                  point with a supporting example, and a concise conclusion.
                  Structure your practice with this format in mind to master the
                  timing.
                </p>
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
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-3">
          <div className={cn("h-6 w-6 rounded-full", colorClass)}></div>
          <span className="font-medium">{time}</span>
        </div>
        <p className="text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
