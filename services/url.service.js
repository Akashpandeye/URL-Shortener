import { db } from "../db/index.js";
import { urlTable } from "../model/url.model.js";
import { eq } from "drizzle-orm";

export async function createUrl(url, code, userId) {
    const [result] = await db.insert(urlTable).values({
        shortCode: code,
        targetUrl: url,
        userId: userId
    }).returning({
        id: urlTable.id,
        shortCode: urlTable.shortCode,
        targetUrl: urlTable.targetUrl
    })
    return result;
}

export async function getUrlByShortCode(code) {
    const [result] = await db.select({
        targetUrl: urlTable.targetUrl
    }).from(urlTable).where(eq(urlTable.shortCode, code));
    return result;
}