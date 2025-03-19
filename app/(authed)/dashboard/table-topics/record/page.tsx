import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import ContactUsCard from "./_components/contact-us-card";
import TableTopicsGuide from "./_components/table-topics-guide";
import TableTopicsRecorder from "./_components/table-topics-recorder";

export const metadata: Metadata = {
  title: "Record",
  description: "Record table topics",
};

export default function TopicCreatePage() {
  return (
    <div className="space-y-8">
      <TableTopicsRecorder />
      <Separator />
      <TableTopicsGuide />
      <ContactUsCard />
    </div>
  );
}
