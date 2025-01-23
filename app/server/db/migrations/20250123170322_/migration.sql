/*
  Warnings:

  - You are about to drop the column `url` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cloudflareId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cloudflareId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Video_url_key";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "url",
ADD COLUMN     "cloudflareId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_cloudflareId_key" ON "Video"("cloudflareId");
