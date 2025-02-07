import { Metadata } from "next";
import TableTopicsRecorder from "./_components/table-topics-recorder";

export const metadata: Metadata = {
  title: "Record",
  description: "Record table topics",
};

export default function TopicCreatePage() {
  return <TableTopicsRecorder />;
}
