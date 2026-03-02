import express from "express";
import { db } from "../db/index.js";
import { usersTable } from "../model/user.model.js";
import { eq } from "drizzle-orm";
import { randomBytes, createHmac } from "crypto";
import { signupPostRequestSchema } from "../validation/request.validation.js";

const router = express.Router();

router.post('/signup', async (req, res) => {
    const validationResult = await signupPostRequestSchema.safeParseAsync(req.body);
    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.format() });
    }

    const { firstName, lastName, email, password } = validationResult.data;


    // without zod
    // if (!firstName) return res.status(400).json({ message: "First name is required" });
    // if (!lastName) return res.status(400).json({ message: "Last name is required" });
    // if (!email) return res.status(400).json({ message: "Email is required" });
    // if (!password) return res.status(400).json({ message: "Password is required" });

    const [existingUser] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email));

    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });

    }
    const salt = randomBytes(256).toString("hex");
    const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");



    const [user] = await db.insert(usersTable).values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salt,
    }).returning({ id: usersTable.id });

    return res.status(201).json({ data: { id: user.id } });
})

export default router;