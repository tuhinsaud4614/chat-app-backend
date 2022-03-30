import { Router } from "express";
import {
  allConversations,
  sendMessage,
  singleConversation,
} from "../controllers/conversation.controller";
import { validateRequest } from "../middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";
import {
  sendMessageValidateSchema,
  singleConversationValidateSchema,
} from "../schema/conversation.schema";

const router = Router();

router.get("/", verifyAccessToken, allConversations);
router.get(
  "/:conversationId",
  validateRequest(singleConversationValidateSchema, 422),
  verifyAccessToken,
  singleConversation
);

router.post(
  "/:conversationId/message",
  validateRequest(sendMessageValidateSchema, 422),
  verifyAccessToken,
  sendMessage
);

export default router;
