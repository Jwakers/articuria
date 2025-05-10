/*
  Warnings:

  - You are about to drop the column `transcriptId` on the `Report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_transcriptId_fkey";

-- DropIndex
DROP INDEX "Report_transcriptId_key";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "transcriptId";
