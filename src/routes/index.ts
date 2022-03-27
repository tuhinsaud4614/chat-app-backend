import { Router } from "express";
import authRoutes from "./auth.route";
import friendshipRoutes from "./friendship.route";
import userRoutes from "./user.route";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/friendship", friendshipRoutes);

export default router;
