import { validateUserToken } from "../utils/token.js";

/** 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function authMiddleware(req, res, next) {
    const authHeader = req.headers[`authorization`];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    const [_, token] = authHeader.split(' ');
    try {
        const payload = await validateUserToken(token);
        req.user = payload;
        return next();
    } catch (error) {
        return next();
    }
}

/**     
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function ensureAuth(req, res, next) {
    if (!req.user || !req.user.id) {
        return res
            .status(401)
            .json({ error: "You must be logged in to create a short URL" });
    }
    next();
}

export default authMiddleware;