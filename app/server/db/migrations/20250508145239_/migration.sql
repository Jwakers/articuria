/*
  Warnings:

  - Added the required column `userId` to the `MuxVideo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MuxVideo" ADD COLUMN     "uploadStatus" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;
