import { Router } from "express";
import {
  addMembersToGroup,
  allConversations,
  changeGroupAvatar,
  changeGroupName,
  createGroup,
  promoteMemberToGroup,
  removeMemberToGroup,
  singleConversation,
} from "../controllers/conversation.controller";
import { validateRequest } from "../middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { imageUpload } from "../middleware/file.middleware";
import {
  addMemberToGroupValidateSchema,
  AllConversationsValidateSchema,
  changeGroupAvatarValidateSchema,
  changeGroupNameValidateSchema,
  createGroupValidateSchema,
  promoteMemberFromGroupValidateSchema,
  removeMemberFromGroupValidateSchema,
  singleConversationValidateSchema,
} from "../schema/conversation.schema";
import { maxFileSize } from "../utility";

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

router.patch(
  "/:conversationId/promote-member",
  validateRequest(promoteMemberFromGroupValidateSchema, 422),
  promoteMemberToGroup
);

router.patch(
  "/:conversationId/change-group-avatar",
  imageUpload(maxFileSize(5)).single("avatar"),
  validateRequest(changeGroupAvatarValidateSchema, 422),
  changeGroupAvatar
);

router.get(
  "/:conversationId",
  validateRequest(singleConversationValidateSchema, 422),
  singleConversation
);

export default router;
