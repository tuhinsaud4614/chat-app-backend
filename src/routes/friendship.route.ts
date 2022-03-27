import { Router } from "express";
import { sendFriendRequest } from "../controllers/friendship.controller";
import { validateRequest } from "../middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { sendRequestValidateSchema } from "../schema/friendship.schema";

const router = Router();

router.post(
  "/send-request/:receiverId",
  validateRequest(sendRequestValidateSchema, 422),
  verifyAccessToken,
  sendFriendRequest
);

export default router;
