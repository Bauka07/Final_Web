import express from "express";
import { register, login, getMe, googleCallback, googleAuthFailed } from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import passport from "../config/passport.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: "/auth/google/failure",
    session: false 
  }),
  googleCallback
);

router.get("/google/failure", googleAuthFailed);

// Protected routes
router.get("/me", authenticate, getMe);

export default router;
