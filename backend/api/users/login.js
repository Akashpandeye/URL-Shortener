import { loginPostRequestSchema } from "../../validation/request.validation.js";
import { hashPasswordWithSalt } from "../../utils/hash.js";
import { getUserByEmail } from "../../services/users.service.js";
import { createUserToken } from "../../utils/token.js";

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

    try {
        const validationResult = await loginPostRequestSchema.safeParseAsync(req.body);
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error.format() });
        }

        const { email, password } = validationResult.data;
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const { password: hashedPasswordFromUser } = hashPasswordWithSalt(password, user.salt);

        if (user.password !== hashedPasswordFromUser) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = await createUserToken({ id: user.id });
        return res.status(200).json({ data: { token } });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal Server Error", message: error.message || String(error) });
    }
}
