import { db } from "../lib/db.js";
import { urlTable } from "../models/url.model.js";
import { eq } from "drizzle-orm";

/**
 * Handles GET /:shortCode — redirects to target URL
 * Vercel route: /api/[shortCode]
 * Note: DELETE /:id is handled in [id].js — Vercel resolves method-level
 * In production, you'd use a single [slug].js with method branching.
 * This file handles GET redirects only.
 */
export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { shortCode } = req.query;

    // Ignore browser auto-requests
    if (shortCode === "favicon.ico") {
        return res.status(204).end();
    }

    try {
        const [result] = await db.select({
            targetUrl: urlTable.targetUrl,
        }).from(urlTable).where(eq(urlTable.shortCode, shortCode));

        if (!result) {
            return res.status(404).json({ error: "URL not found" });
        }

        return res.redirect(301, result.targetUrl);
    } catch (error) {
        return res.status(500).json({ error: "Failed to resolve short URL" });
    }
}
