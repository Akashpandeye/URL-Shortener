import { db } from "../db/index.js";
import { usersTable } from "../model/user.model.js";
import { eq } from "drizzle-orm"; // <-- ADDED: eq is needed for the where clause

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

// Fixed: receive `password` (which will be the hashed password) and `salt`
export async function createUser({ firstName, lastName, email, password, salt }) {
    const [user] = await db.insert(usersTable).values({
        firstName,
        lastName,
        email,
        password, // <-- Uses the destructured `password` variable
        salt,     // <-- Uses the destructured `salt` variable
    }).returning({ id: usersTable.id });

    return user;
}
