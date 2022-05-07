import { Router } from "express";
import {
  allConversations,
  createGroup,
  singleConversation,
} from "../controllers/conversation.controller";
import { validateRequest } from "../middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";
import {
  AllConversationsValidateSchema,
  createGroupValidateSchema,
  singleConversationValidateSchema,
} from "../schema/conversation.schema";

const router = Router();

router.use(verifyAccessToken);

router.get(
  "/",
  validateRequest(AllConversationsValidateSchema, 422),
  allConversations
);

router.post(
  "/create-group",
  validateRequest(createGroupValidateSchema, 422),
  createGroup
);

router.get(
  "/:conversationId",
  validateRequest(singleConversationValidateSchema, 422),
  singleConversation
);

export default router;
