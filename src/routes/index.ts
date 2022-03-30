import { Router } from "express";
import authRoutes from "./auth.route";
import conversationRoutes from "./conversation.route";
import friendshipRoutes from "./friendship.route";
import userRoutes from "./user.route";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/friendship", friendshipRoutes);
router.use("/conversation", conversationRoutes);

export default router;
