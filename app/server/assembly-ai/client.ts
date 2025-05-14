import { AssemblyAI } from "assemblyai";

const apiKey = process.env.ASSEMBLY_AI_API_KEY;
if (!apiKey) throw new Error("Messing key for assembly ai");

export const assemblyAi = new AssemblyAI({ apiKey });
