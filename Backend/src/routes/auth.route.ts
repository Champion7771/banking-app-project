import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getProfile,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { loginLimiter } from "../middleware/rateLimit.middleware";

const router = express.Router();
router.get("/profile", protect, getProfile);
router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);
export default router;
