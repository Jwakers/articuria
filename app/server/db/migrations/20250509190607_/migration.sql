/*
  Warnings:

  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Transcript" DROP CONSTRAINT "Transcript_videoId_fkey";

-- DropTable
DROP TABLE "Video";

-- AddForeignKey
ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "MuxVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "MuxVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
