import { Router } from "express";
import {
  addMembersToGroup,
  allConversations,
  createGroup,
  singleConversation,
} from "../controllers/conversation.controller";
import { validateRequest } from "../middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";
import {
  addMemberToGroupValidateSchema,
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

router.patch(
  "/:conversationId/add-members",
  validateRequest(addMemberToGroupValidateSchema, 422),
  addMembersToGroup
);

router.get(
  "/:conversationId",
  validateRequest(singleConversationValidateSchema, 422),
  singleConversation
);

export default router;
