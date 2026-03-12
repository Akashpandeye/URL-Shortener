import { validateUserToken } from "../utils/token.js";

/**
 * Parses authorization header and attaches user to a request-like object.
 * Returns { user } or null if no valid token.
 */
export async function runAuthMiddleware(headers) {
    const authHeader = headers["authorization"] || headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { user: null, authError: null };
    }
    const [, token] = authHeader.split(" ");
    try {
        const payload = await validateUserToken(token);
        return { user: payload, authError: null };
    } catch (error) {
        return { user: null, authError: "Invalid or expired token" };
    }
}

/**
 * Ensures the user is authenticated, returns error response data if not.
 */
export function ensureAuth(user) {
    if (!user || !user.id) {
        return { error: "You must be logged in to create a short URL" };
    }
    return null;
}
