import { signupPostRequestSchema } from "../../validation/request.validation.js";
import { hashPasswordWithSalt } from "../../utils/hash.js";
import { getUserByEmail, createUser } from "../../services/users.service.js";

export default async function handler(req, res) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const validationResult = await signupPostRequestSchema.safeParseAsync(req.body);
    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.format() });
    }

    const { firstName, lastName, email, password } = validationResult.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }

    const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

    const user = await createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salt,
    });

    return res.status(201).json({ data: { id: user.id } });
}
