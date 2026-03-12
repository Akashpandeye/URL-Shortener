import { db } from "../lib/db.js";
import { urlTable } from "../models/url.model.js";
import { runAuthMiddleware, ensureAuth } from "../middleware/auth.middleware.js";
import { eq } from "drizzle-orm";

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

    const { user, authError } = await runAuthMiddleware(req.headers);
    if (authError) {
        return res.status(401).json({ error: authError });
    }

    const authGuard = ensureAuth(user);
    if (authGuard) {
        return res.status(401).json(authGuard);
    }

    try {
        const result = await db.select({
            shortCode: urlTable.shortCode,
            targetUrl: urlTable.targetUrl,
            id: urlTable.id,
            createdAt: urlTable.createdAt,
            updatedAt: urlTable.updatedAt,
        }).from(urlTable).where(eq(urlTable.userId, user.id));

        return res.status(200).json({ data: { result } });
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve URLs" });
    }
}
