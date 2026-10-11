import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";
import { getDatabaseConfig } from "../shared/database-config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export const pool = mysql.createPool(getDatabaseConfig());

export const db = drizzle(pool, { schema, mode: "default" });
