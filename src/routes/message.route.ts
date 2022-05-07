import { Router } from "express";
import {
  seenBy,
  sendAttachment,
  sendImage,
  sendText,
} from "../controllers/message.controller";
import { validateRequest } from "../middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { attachmentUpload, imageUpload } from "../middleware/file.middleware";
import {
  seenByValidateSchema,
  sendAttachmentValidateSchema,
  sendImageValidateSchema,
  sendTextValidateSchema,
} from "../schema/message.schema";
import { maxFileSize } from "../utility";

const router = Router();

router.use(verifyAccessToken);

router.post(
  "/:conversationId/send-text",
  validateRequest(sendTextValidateSchema, 422),
  sendText
);

router.post(
  "/:conversationId/send-attachment",
  attachmentUpload(maxFileSize(50)).single("attachment"),
  validateRequest(sendAttachmentValidateSchema, 422),
  sendAttachment
);

router.post(
  "/:conversationId/send-image",
  imageUpload(maxFileSize(20)).single("image"),
  validateRequest(sendImageValidateSchema, 422),
  sendImage
);

router.patch(
  "/:messageId/seen-by",
  validateRequest(seenByValidateSchema, 422),
  seenBy
);

export default router;
