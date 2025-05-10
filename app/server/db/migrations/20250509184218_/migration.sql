/*
  Warnings:

  - You are about to drop the column `uploadStatus` on the `MuxVideo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MuxVideo" DROP COLUMN "uploadStatus",
ADD COLUMN     "status" TEXT;
