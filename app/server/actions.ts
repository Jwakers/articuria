"use server";

import { validateFile } from "@/lib/utils";
import { Video } from "@prisma/client";
import {
  createUserVideo,
  deleteUserVideoById,
  getRandomTableTopic,
} from "./db/queries";

export async function getTableTopic() {
  const topic = await getRandomTableTopic();

  return topic;
}

export async function createVideo({
  tableTopicId,
  title,
  formData,
}: {
  tableTopicId: Video["tableTopicId"];
  title: string;
  formData: FormData;
}) {
  const file = formData.get("file") as File | null;

  if (!file) throw new Error("No file found");

  validateFile(file, true);

  const video = await createUserVideo({
    tableTopicId,
    title,
    formData,
  });

  return video;
}

export async function deleteVideo(id: Video["id"]) {
  const video = await deleteUserVideoById(id);

  return video;
}
