-- CreateTable
CREATE TABLE "TableTopic" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topic" TEXT NOT NULL,

    CONSTRAINT "TableTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tableTopicId" INTEGER NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TableTopic_topic_key" ON "TableTopic"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "Video_url_key" ON "Video"("url");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_tableTopicId_fkey" FOREIGN KEY ("tableTopicId") REFERENCES "TableTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
