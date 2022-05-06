import { mongoose } from "@typegoose/typegoose";
import * as yup from "yup";

export const AllConversationsValidateSchema = yup.object().shape({
  query: yup.object().shape({
    page: yup
      .number()
      .required("Page is required")
      .min(1, "Minimum page number should be 1"),
    limit: yup
      .number()
      .required("Limit is required")
      .min(1, "Minimum limit should be 1"),
  }),
});

export const singleConversationValidateSchema = yup.object().shape({
  query: yup.object().shape({
    page: yup
      .number()
      .required("Page is required")
      .min(1, "Minimum page number should be 1"),
    limit: yup
      .number()
      .required("Limit is required")
      .min(1, "Minimum limit should be 1"),
  }),
  params: yup.object().shape({
    conversationId: yup
      .string()
      .test(
        "validId",
        "Valid conversationId id is required",
        (value) => !!value && mongoose.Types.ObjectId.isValid(value)
      ),
  }),
});

export const sendMessageValidateSchema = yup.object().shape({
  body: yup.object().shape({
    text: yup.string().required("Text is required"),
  }),
  params: yup.object().shape({
    conversationId: yup
      .string()
      .test(
        "validId",
        "Valid conversationId id is required",
        (value) => !!value && mongoose.Types.ObjectId.isValid(value)
      ),
  }),
});

export const sendAttachmentValidateSchema = yup.object().shape({
  file: yup.mixed().required("Attachment is required"),
  params: yup.object().shape({
    conversationId: yup
      .string()
      .test(
        "validId",
        "Valid conversationId id is required",
        (value) => !!value && mongoose.Types.ObjectId.isValid(value)
      ),
  }),
});
