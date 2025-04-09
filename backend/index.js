const express = require("express")
const dotenv = require('dotenv');
dotenv.config()

const connectToDB = require("./config/db")
connectToDB()

const app = express()

app.get("/", (req, res) => {
    res.send("Hello world!")
})

app.use("/api/auth", authRoutes)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

