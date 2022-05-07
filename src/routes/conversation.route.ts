import { Router } from "express";
import {
  allConversations,
  singleConversation,
} from "../controllers/conversation.controller";
import { validateRequest } from "../middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";
import {
  AllConversationsValidateSchema,
  singleConversationValidateSchema,
} from "../schema/conversation.schema";

const router = Router();

router.get(
  "/",
  verifyAccessToken,
  validateRequest(AllConversationsValidateSchema, 422),
  allConversations
);
router.get(
  "/:conversationId",
  verifyAccessToken,
  validateRequest(singleConversationValidateSchema, 422),
  singleConversation
);

export default router;
