import { Router } from "express";
import {
  addMembersToGroup,
  allConversations,
  changeGroupName,
  createGroup,
  removeMemberToGroup,
  singleConversation,
} from "../controllers/conversation.controller";
import { validateRequest } from "../middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";
import {
  addMemberToGroupValidateSchema,
  AllConversationsValidateSchema,
  changeGroupNameValidateSchema,
  createGroupValidateSchema,
  removeMemberFromGroupValidateSchema,
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
  "/:conversationId/change-group-name",
  validateRequest(changeGroupNameValidateSchema, 422),
  changeGroupName
);

router.patch(
  "/:conversationId/add-members",
  validateRequest(addMemberToGroupValidateSchema, 422),
  addMembersToGroup
);

router.delete(
  "/:conversationId/remove-member",
  validateRequest(removeMemberFromGroupValidateSchema, 422),
  removeMemberToGroup
);

router.get(
  "/:conversationId",
  validateRequest(singleConversationValidateSchema, 422),
  singleConversation
);

export default router;
