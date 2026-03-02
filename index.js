import express from "express";
import usersRouter from "./routes/users.routes.js";

const app = express()
const PORT = process.env.PORT ?? 8000

app.use(express.json())

app.use('/users', usersRouter)

app.get('/', (req, res) => {
    res.json({ status: "server is up and running" })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
