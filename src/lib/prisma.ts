import { PrismaClient } from "@prisma/client";

/** Neon: `schema` uses `directUrl`; if only `DATABASE_URL` is set, mirror it (see prisma.config.ts). */
if (process.env.DATABASE_URL && !process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient({ log: ["query"] });
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
