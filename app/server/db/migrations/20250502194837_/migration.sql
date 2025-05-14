/*
  Warnings:

  - You are about to drop the column `transcriptId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `Transcript` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_transcriptId_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "transcriptId";

-- DropTable
DROP TABLE "Transcript";
