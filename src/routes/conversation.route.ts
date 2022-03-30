import { Router } from "express";
import { allConversations } from "../controllers/conversation.controller";
import { verifyAccessToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verifyAccessToken, allConversations);

export default router;
