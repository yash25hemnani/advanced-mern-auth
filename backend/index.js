const express = require("express")
const dotenv = require('dotenv');
dotenv.config()

const cookieParser = require("cookie-parser")
const cors = require('cors');

const connectToDB = require("./config/db")
connectToDB()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json()); // To parse incoming requests from req.body
app.use(cookieParser()); // To parse incoming cookies

const authRoutes = require('./routes/auth.routes');

app.get("/", (req, res) => {
    res.send("Hello world!")
})

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
})

