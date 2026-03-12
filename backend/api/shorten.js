import { shortendPostRequestBodySchema } from "../validation/request.validation.js";
import { nanoid } from "nanoid";
import { runAuthMiddleware, ensureAuth } from "../middleware/auth.middleware.js";
import { createUrl } from "../services/url.service.js";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Auth middleware
    const { user, authError } = await runAuthMiddleware(req.headers);
    if (authError) {
        return res.status(401).json({ error: authError });
    }

    // ensureAuth guard
    const authGuard = ensureAuth(user);
    if (authGuard) {
        return res.status(401).json(authGuard);
    }

    const validationResult = await shortendPostRequestBodySchema.safeParseAsync(req.body);
    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.format() });
    }

    const { url, code } = validationResult.data;
    const shortCode = code ?? nanoid(6);

    try {
        const result = await createUrl(url, shortCode, user.id);
        return res.status(201).json({ data: { result } });
    } catch (error) {
        return res.status(400).json({ error: "Short code already exists or invalid data provided" });
    }
}
