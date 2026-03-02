import express from 'express'
import { shortendPostRequestBodySchema } from '../validation/request.validation.js';
import { nanoid } from 'nanoid';
import { db } from '../db/index.js';
import { urlTable } from '../model/url.model.js';
import authMiddleware, { ensureAuth } from '../middleware/auth.middleware.js';
import { createUrl } from '../services/url.service.js';
import { and, eq } from 'drizzle-orm';




const router = express.Router();


router.post('/shorten', authMiddleware, ensureAuth, async function (req, res) {
    const validationResult = await shortendPostRequestBodySchema.safeParseAsync(req.body);
    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.format() });
    }
    const { url, code } = validationResult.data;

    const shortCode = code ?? nanoid(6);
    try {
        const result = await createUrl(url, shortCode, req.user.id);
        return res.status(201).json({ data: { result } });
    } catch (error) {
        return res.status(400).json({ error: "Short code already exists or invalid data provided" });
    }
})

router.get('/codes', ensureAuth, async function (req, res) {
    const result = await db.select({
        shortCode: urlTable.shortCode,
        targetUrl: urlTable.targetUrl,
        id: urlTable.id,
        createdAt: urlTable.createdAt,
        updatedAt: urlTable.updatedAt
    }).from(urlTable).where(eq(urlTable.userId, req.user.id));
    return res.status(200).json({ data: { result } });
})

router.delete('/:id', ensureAuth, async function (req, res) {
    const id = req.params.id;
    const [result] = await db.delete(urlTable).where(and(eq(urlTable.id, id), eq(urlTable.userId, req.user.id))).returning({
        shortCode: urlTable.shortCode,
        targetUrl: urlTable.targetUrl
    });
    return res.status(200).json({ data: { result } });
})

router.get('/:shortCode', async function (req, res) {
    const code = req.params.shortCode;
    const [result] = await db.select({
        targetUrl: urlTable.targetUrl
    }).from(urlTable).where(eq(urlTable.shortCode, code));

    if (!result) {
        return res.status(404).json({ error: "URL not found" });
    }
    return res.redirect(result.targetUrl);
})

export default router;

