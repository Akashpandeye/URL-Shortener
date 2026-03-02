import express from "express";
import { signupPostRequestSchema, loginPostRequestSchema } from "../validation/request.validation.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail, createUser } from "../services/users.service.js";
import jwt from "jsonwebtoken";



const router = express.Router();

router.post('/signup', async (req, res) => {
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
        salt
    });

    return res.status(201).json({ data: { id: user.id } });
})

router.post('/login', async (req, res) => {
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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ data: { token } });
})
export default router;