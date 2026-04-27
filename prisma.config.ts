import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load env before Prisma reads `env("DATABASE_URL")`. Prefer project root (this file lives there).
const projectRoot = dirname(fileURLToPath(import.meta.url));
const envFiles = [join(projectRoot, ".env"), join(projectRoot, ".env.local")];
for (const p of envFiles) {
  if (existsSync(p)) {
    config({ path: p });
  }
}
// Fallback if CLI cwd differs (e.g. monorepo / nested invoke).
if (!process.env.DATABASE_URL) {
  for (const name of [".env", ".env.local"] as const) {
    const p = resolve(process.cwd(), name);
    if (existsSync(p)) {
      config({ path: p });
    }
  }
}

// Neon: use a separate "direct" (non-pooled) connection for migrations if you have one.
// If `DIRECT_URL` is not set, reuse `DATABASE_URL` so Prisma can still run.
if (process.env.DATABASE_URL && !process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_URL"),
  },
});
