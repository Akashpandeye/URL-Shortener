import { db } from "../lib/db.js";
import { usersTable } from "../models/user.model.js";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email) {
    const [existingUser] = await db
        .select({
            id: usersTable.id,
            firstName: usersTable.firstName,
            lastName: usersTable.lastName,
            email: usersTable.email,
            password: usersTable.password,
            salt: usersTable.salt,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email));
    return existingUser;
}

export async function createUser({ firstName, lastName, email, password, salt }) {
    const [user] = await db.insert(usersTable).values({
        firstName,
        lastName,
        email,
        password,
        salt,
    }).returning({ id: usersTable.id });
    return user;
}
