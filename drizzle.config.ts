import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { getDatabaseConfig } from "./shared/database-config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: getDatabaseConfig(),
});
