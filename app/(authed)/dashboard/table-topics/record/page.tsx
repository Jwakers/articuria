import { Separator } from "@/components/ui/separator";
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
    <div className="space-y-8">
      <div className="space-y-2">
        <VideoLimitAlert />
        <TableTopicsRecorder />
      </div>
      <Separator />
      <TableTopicsGuide />
      <ContactUsCard />
    </div>
  );
}
