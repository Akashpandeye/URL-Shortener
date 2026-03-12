import jwt from "jsonwebtoken";
import { UserTokenValidationSchema } from "../validation/token.validation.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function createUserToken(payload) {
    const validationResult = await UserTokenValidationSchema.safeParseAsync(payload);
    if (validationResult.error) {
        throw new Error(validationResult.error.message);
    }
    const payloadValidationData = validationResult.data;
    const token = jwt.sign(payloadValidationData, JWT_SECRET, { expiresIn: '1h' });
    return token;
}

export const validateUserToken = async (token) => {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
};
