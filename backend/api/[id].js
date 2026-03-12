import { db } from "../lib/db.js";
import { urlTable } from "../models/url.model.js";
import { runAuthMiddleware, ensureAuth } from "../middleware/auth.middleware.js";
import { and, eq } from "drizzle-orm";

/**
 * Handles DELETE /:id
 * Vercel route: /api/[id]
 * Note: This file handles DELETE. GET /:shortCode is in [shortCode].js
 * Vercel uses the same file for dynamic segments - method routing separates them.
 */
export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
    res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { user, authError } = await runAuthMiddleware(req.headers);
    if (authError) {
        return res.status(401).json({ error: authError });
    }

    const authGuard = ensureAuth(user);
    if (authGuard) {
        return res.status(401).json(authGuard);
    }

    const { id } = req.query;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        const [result] = await db
            .delete(urlTable)
            .where(and(eq(urlTable.id, id), eq(urlTable.userId, user.id)))
            .returning({
                shortCode: urlTable.shortCode,
                targetUrl: urlTable.targetUrl,
            });

        if (!result) {
            return res.status(404).json({ error: "URL not found or you do not have permission" });
        }

        return res.status(200).json({ data: { result } });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete URL" });
    }
}
