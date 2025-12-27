import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/db";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});

