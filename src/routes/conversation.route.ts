import { Router } from "express";
import {
  allConversations,
  sendAttachment,
  sendText,
  singleConversation,
} from "../controllers/conversation.controller";
import { validateRequest } from "../middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { attachmentUpload } from "../middleware/file.middleware";
import {
  sendAttachmentValidateSchema,
  sendMessageValidateSchema,
  singleConversationValidateSchema,
} from "../schema/conversation.schema";
import { maxFileSize } from "../utility";

const router = Router();

router.get("/", verifyAccessToken, allConversations);
router.get(
  "/:conversationId",
  verifyAccessToken,
  validateRequest(singleConversationValidateSchema, 422),
  singleConversation
);

router.post(
  "/:conversationId/text",
  verifyAccessToken,
  validateRequest(sendMessageValidateSchema, 422),
  sendText
);

router.post(
  "/:conversationId/attachment",
  verifyAccessToken,
  attachmentUpload(maxFileSize(50)).single("attachment"),
  validateRequest(sendAttachmentValidateSchema, 422),
  sendAttachment
);

export default router;
