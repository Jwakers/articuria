-- CreateTable
CREATE TABLE "MuxVideo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadId" TEXT,
    "assetId" TEXT,

    CONSTRAINT "MuxVideo_pkey" PRIMARY KEY ("id")
);
