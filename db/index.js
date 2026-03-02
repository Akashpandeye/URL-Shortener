import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import dotenv from "dotenv/config";

export const db = drizzle(process.env.DATABASE_URL);
export default db;