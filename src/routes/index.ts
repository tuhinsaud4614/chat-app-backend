import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);

export default router;
