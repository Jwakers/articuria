/*
  Warnings:

  - The `status` column on the `MuxVideo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `audioRenditionStatus` column on the `MuxVideo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MuxProcessingStatus" AS ENUM ('WAITING', 'READY', 'ERRORED');

-- AlterTable
ALTER TABLE "MuxVideo" DROP COLUMN "status",
ADD COLUMN     "status" "MuxProcessingStatus",
DROP COLUMN "audioRenditionStatus",
ADD COLUMN     "audioRenditionStatus" "MuxProcessingStatus";

-- CreateIndex
CREATE INDEX "MuxVideo_userId_idx" ON "MuxVideo"("userId");
