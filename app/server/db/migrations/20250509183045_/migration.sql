/*
  Warnings:

  - You are about to drop the column `tableTopicId` on the `Video` table. All the data in the column will be lost.
  - Added the required column `tableTopicId` to the `MuxVideo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_tableTopicId_fkey";

-- AlterTable
ALTER TABLE "MuxVideo" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "tableTopicId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "tableTopicId";

-- AddForeignKey
ALTER TABLE "MuxVideo" ADD CONSTRAINT "MuxVideo_tableTopicId_fkey" FOREIGN KEY ("tableTopicId") REFERENCES "TableTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
