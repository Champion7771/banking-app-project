import express from "express";
import { protect } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import {
  getAllUsers,
  getAllTransactions,
  getAdminAnalytics,
  blockUser,
  unblockUser,
  freezeUser,
  unfreezeUser,
  deleteUser,
} from "../controllers/admin.controller";

const router = express.Router();

// USERS
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
// TRANSACTIONS
router.get(
  "/transactions",
  protect,
  authorizeRoles("admin"),
  getAllTransactions,
);
// ANALYTICS
router.get("/analytics", protect, authorizeRoles("admin"), getAdminAnalytics);
// BLOCK USER
router.patch("/block/:id", protect, authorizeRoles("admin"), blockUser);
// UNBLOCK USER
router.patch("/unblock/:id", protect, authorizeRoles("admin"), unblockUser);
// FREEZE USER
router.patch("/freeze/:id", protect, authorizeRoles("admin"), freezeUser);
// UNFREEZE USER
router.patch("/unfreeze/:id", protect, authorizeRoles("admin"), unfreezeUser);
// DELETE USER
router.delete("/user/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
