-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creativity" TEXT,
    "creativityScore" INTEGER,
    "clarity" TEXT,
    "clarityScore" INTEGER,
    "engagement" TEXT,
    "engagementScore" INTEGER,
    "tone" TEXT,
    "toneScore" INTEGER,
    "pacing" TEXT,
    "pacingScore" INTEGER,
    "language" TEXT,
    "languageScore" INTEGER,
    "averageScore" INTEGER,
    "recommendations" TEXT[],
    "commendations" TEXT[],
    "shortSummary" TEXT,
    "summary" TEXT,
    "transcriptId" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_transcriptId_key" ON "Report"("transcriptId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
