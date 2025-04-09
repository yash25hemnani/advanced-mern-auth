const express = require("express")
const dotenv = require('dotenv');
dotenv.config()

const connectToDB = require("./config/db")
connectToDB()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json()); // To parse incoming requests from req.body

const authRoutes = require('./routes/auth.routes');

app.get("/", (req, res) => {
    res.send("Hello world!")
})

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
})

