"use client";

import { Authenticated } from "convex/react";
import TableTopicsRecorder from "./_components/table-topics-recorder";

// export const metadata: Metadata = {
//   title: "Record Table Topics",
//   description: "Record your table topic performance, save and process feedback",
// };

export default function TopicRecordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        {/* <VideoLimitAlert /> */}
        <Authenticated>
          <TableTopicsRecorder />
        </Authenticated>
      </div>
      {/* <Separator />
      <TableTopicsGuide />
      <ContactUsCard /> */}
    </div>
  );
}
