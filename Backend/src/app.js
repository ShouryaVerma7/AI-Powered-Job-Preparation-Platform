const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
}))

// Routes
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// ── Global Error Handler ──────────────────────────────────────────────────────
// Catches any error thrown or passed via next(err) in controllers/middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err)

    // Multer file-size error
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large. Maximum size is 3MB." })
    }

    // Multer file-type error (thrown in fileFilter)
    if (err.message === "Only PDF files are allowed") {
        return res.status(400).json({ message: "Only PDF files are allowed." })
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(e => e.message)
        return res.status(400).json({ message: messages.join(", ") })
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        return res.status(400).json({ message: `${field} already exists.` })
    }

    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    })
})

module.exports = app