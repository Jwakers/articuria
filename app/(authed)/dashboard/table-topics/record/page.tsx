import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import VideoLimitAlert from "../../_components/video-limit-alert";
import ContactUsCard from "./_components/contact-us-card";
import TableTopicsGuide from "./_components/table-topics-guide";
import TableTopicsRecorder from "./_components/table-topics-recorder";

export const metadata: Metadata = {
  title: "Record",
  description: "Record table topics",
};

export default async function TopicRecordPage() {
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
