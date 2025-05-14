/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `videoId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "videoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Report_videoId_key" ON "Report"("videoId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
