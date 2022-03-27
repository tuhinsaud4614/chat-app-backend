import { Router } from "express";
import {
  acceptFriendRequest,
  sendFriendRequest,
} from "../controllers/friendship.controller";
import { validateRequest } from "../middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";
import {
  acceptRequestValidateSchema,
  sendRequestValidateSchema,
} from "../schema/friendship.schema";

const router = Router();

router.post(
  "/send-request/:receiverId",
  validateRequest(sendRequestValidateSchema, 422),
  verifyAccessToken,
  sendFriendRequest
);

router.patch(
  "/accept-request/:friendshipId",
  validateRequest(acceptRequestValidateSchema, 422),
  verifyAccessToken,
  acceptFriendRequest
);

export default router;
