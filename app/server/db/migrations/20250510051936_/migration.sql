-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Transcript" DROP CONSTRAINT "Transcript_videoId_fkey";

-- AddForeignKey
ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "MuxVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "MuxVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
