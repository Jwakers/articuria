import { db } from "@/app/server/db";
import { auth } from "@clerk/nextjs/server";
import { Video } from "@prisma/client";
import "server-only";
import topics from "./topics.json";

export async function getRandomTableTopic() {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const topic = await db.tableTopic.upsert({
    where: {
      topic: randomTopic,
    },
    update: {},
    create: {
      topic: randomTopic,
    },
  });

  return topic;
}

export async function setVideo({
  cloudflareId,
  tableTopicId,
}: {
  cloudflareId: Video["cloudflareId"];
  tableTopicId: Video["tableTopicId"];
}) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  const video = await db.video.create({
    data: {
      cloudflareId,
      tableTopicId,
      userId: user.userId,
    },
  });

  return video;
}
