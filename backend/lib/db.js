import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// If process.env is missing, provide a dummy string to prevent neon() from crashing at module load
const dbUrl = process.env.DATABASE_URL || "postgres://dummy:dummy@dummy.tech/dummy";
const sql = neon(dbUrl);
export const db = drizzle({ client: sql });
