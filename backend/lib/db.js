import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";

// Fix for Node >= 20 native fetch throwing fetch failed
neonConfig.fetchConnectionCache = true; 

// If process.env is missing, provide a dummy string to prevent neon() from crashing at module load
const dbUrl = process.env.DATABASE_URL || "postgres://dummy:dummy@dummy.tech/dummy";
const sql = neon(dbUrl);
export const db = drizzle({ client: sql });
