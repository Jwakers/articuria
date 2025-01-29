"use server";

import { Video } from "@prisma/client";
import {
  deleteUserVideoById,
  getRandomTableTopic,
  setUserVideo as setVideoDb,
} from "./db/queries";

export async function getTableTopic() {
  const topic = await getRandomTableTopic();

  return topic;
}

export async function setVideo({
  cloudflareId,
  tableTopicId,
}: {
  cloudflareId: Video["cloudflareId"];
  tableTopicId: Video["tableTopicId"];
}) {
  const video = await setVideoDb({
    cloudflareId,
    tableTopicId,
  });

  return video;
}

export async function deleteVideo(id: Video["id"]) {
  const video = await deleteUserVideoById(id);

  return video;
}
