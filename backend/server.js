const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const frontendPath = path.join(__dirname, "..", "frontend");
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Shreya Gupta portfolio API is running" });
});

app.use("/api/contact", contactRoutes);

app.use(express.static(frontendPath, {
  maxAge: process.env.NODE_ENV === "production" ? "1d" : 0,
  extensions: ["html"]
}));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio app running on port ${PORT}`);
});
