import express from 'express'
import { shortendPostRequestBodySchema } from '../validation/request.validation.js';
import { nanoid } from 'nanoid';
import { db } from '../db/index.js';
import { urlTable } from '../model/url.model.js';




const router = express.Router();

router.post('/shorten', async function (req, res) {
    const userId = req.user?.id;
    if (!userId) {
        return res
            .status(401)
            .json({ error: "You must be logged in to create a short URL" });
    }
    const validationResult = await shortendPostRequestBodySchema.safeParseAsync(req.body);
    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.format() });
    }
    const { url, code } = validationResult.data;

    const shortCode = code ?? nanoid(6);
    const [result] = await db.insert(urlTable).values({
        shortCode,
        targetUrl: url,
        userId: req.user.id
    }).returning({
        id: urlTable.id,
        shortCode: urlTable.shortCode,
        targetUrl: urlTable.targetUrl
    })
    return res.status(201).json({ resultid: result });
})

export default router;