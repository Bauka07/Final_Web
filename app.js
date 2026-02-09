import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import connectDB from "./config/database.js";
import passport from "./config/passport.js";

import errorHandler from "./middleware/errorHandler.js";

import noteRoutes from "./routes/noteRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "*", // для задания норм, потом можно ограничить
    credentials: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files (frontend)
app.use(express.static("public"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tags", tagRoutes);

// Root route
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Notes API - Final Project Edition",
    version: "3.0.0",
    features: [
      "Google OAuth 2.0",
      "Dark Mode",
      "Archive & Trash",
      "Image Attachments (Cloudinary)",
      "PDF Export",
      "Advanced Search & Filters"
    ],
    endpoints: {
      auth: "/api/auth (POST /register, POST /login, GET /google)",
      categories: "/api/categories",
      notes: "/api/notes (with archive, trash, attachments, pdf export)",
      tags: "/api/tags",
      admin: "/api/admin (admin only)"
    },
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
