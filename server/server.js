// server/server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Route imports
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

/* ---------------- CORS CONFIG FIX ---------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://team-task-manager-production-f602.up.railway.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow Postman / server-to-server requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Blocked by CORS policy: Not allowed origin"));
  },
  credentials: true
}));


/* -------------------------------------------------- */

// Middleware
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("Team Task Manager API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});