// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import Cloudflare from "cloudflare";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

export const cloudflareClient = new Cloudflare({
  apiKey: process.env.CLOUDFLARE_API_TOKEN,
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
