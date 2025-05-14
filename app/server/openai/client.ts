import OpenAI from "openai";

const apiKey = process.env.OPEN_AI_SECRET_KEY;

if (!apiKey) throw new Error("Missing OpenAOI api key");

const client = new OpenAI({
  apiKey,
});

export default client;
