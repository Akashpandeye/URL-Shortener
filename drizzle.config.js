import dotenv from "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./model/index.js",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },

});