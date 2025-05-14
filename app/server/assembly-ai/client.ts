import { AssemblyAI } from "assemblyai";

export function getAssemblyAiClient() {
  const apiKey = process.env.ASSEMBLY_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing key for AssemblyAI. Please set ASSEMBLY_AI_API_KEY environment variable.",
    );
  }
  return new AssemblyAI({ apiKey });
}

export const assemblyAi = getAssemblyAiClient();
