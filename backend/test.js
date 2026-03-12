import signupHandler from "./api/users/signup.js";

const req = {
    method: "POST",
    headers: {},
    body: {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123!"
    }
};

const res = {
    setHeader: () => {},
    status: (code) => ({
        json: (data) => console.log(`Status ${code}:`, data),
        end: () => console.log(`Status ${code} ended`)
    })
};

signupHandler(req, res).catch(console.error);
