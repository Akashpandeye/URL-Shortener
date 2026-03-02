import jwt from "jsonwebtoken";
import { validateUserToken } from "../utils/token.js";

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function authMiddleware(req, res, next) {
    const authHeader = req.headers[`authorization`];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const [_, token] = authHeader.split(' ');
    try {
        const payload = await validateUserToken(token);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

export default authMiddleware;