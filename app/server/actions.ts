"use server";

import { getRandomTableTopic } from "./db/queries";

export async function getTableTopic() {
  const topic = await getRandomTableTopic();

  return topic;
}
