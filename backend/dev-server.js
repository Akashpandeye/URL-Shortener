import express from "express";
import cors from "cors";

// Ensure dotenv runs before other imports!
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

// Import handlers manually since Vercel usually auto-routes them
import signupHandler from "./api/users/signup.js";
import loginHandler from "./api/users/login.js";
import shortenHandler from "./api/shorten.js";
import codesHandler from "./api/codes.js";
import idHandler from "./api/[id].js";
import shortCodeHandler from "./api/[shortCode].js";

// Mock Vercel req/res for Express
const wrapHandler = (handler) => async (req, res) => {
    // Inject params into query safely bypassing the Express getter
    const mergedQuery = { ...req.query, ...req.params };
    Object.defineProperty(req, 'query', {
        get: () => mergedQuery,
        configurable: true
    });
    
    // Call handler
    try {
        await handler(req, res);
    } catch (e) {
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error", message: e.message });
        }
    }
};

// Map routes
app.post("/api/users/signup", wrapHandler(signupHandler));
app.post("/api/users/login", wrapHandler(loginHandler));
app.post("/api/shorten", wrapHandler(shortenHandler));
app.get("/api/codes", wrapHandler(codesHandler));
app.delete("/api/:id", wrapHandler(idHandler));
app.get("/api/:shortCode", wrapHandler(shortCodeHandler));

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Local Dev Server running on http://localhost:${PORT}`);
    console.log(`Backend is ready for frontend testing.\n`);
});
