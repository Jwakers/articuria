import { Metadata } from "next";
import VideoLimitAlert from "../../_components/video-limit-alert";
import ContactUsCard from "./_components/contact-us-card";
import TableTopicsGuide from "./_components/table-topics-guide";
import TableTopicsRecorder from "./_components/table-topics-recorder";

export const metadata: Metadata = {
  title: "Record Table Topics",
  description: "Record your table topic performance, save and process feedback",
};

export default function TopicRecordPage() {
  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-8">
        {/* Main Recording Section */}
        <div className="space-y-8">
          <VideoLimitAlert />
          <TableTopicsRecorder />
        </div>

        {/* Divider with visual enhancement */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <hr className="border-muted-foreground/20 w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Learn More
            </span>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="space-y-8">
          <TableTopicsGuide />
          <ContactUsCard />
        </div>
      </div>
    </div>
  );
}
