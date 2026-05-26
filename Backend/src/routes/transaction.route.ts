import express from "express";
import { protect } from "../middleware/auth.middleware";
import { transferMoney } from "../controllers/transaction.controller";
import { getTransactionHistory } from "../controllers/transaction.controller";
import { transferLimiter } from "../middleware/rateLimit.middleware";

const router = express.Router();

router.post("/transfer", transferLimiter, protect, transferMoney);
router.get("/history", protect, getTransactionHistory);

export default router;
