import express from "express";
import { protect } from "../middleware/auth.middleware";
import { getNotifications } from "../controllers/notification.controller";

const router = express.Router();

router.get("/", protect, getNotifications);

export default router;
