import { mongoose } from "@typegoose/typegoose";
import * as yup from "yup";

export const sendTextValidateSchema = yup.object().shape({
  body: yup.object().shape({
    text: yup.string().required("Text is required"),
  }),
  params: yup.object().shape({
    conversationId: yup
      .string()
      .test(
        "validId",
        "Valid conversation id is required",
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
        "Valid conversation id is required",
        (value) => !!value && mongoose.Types.ObjectId.isValid(value)
      ),
  }),
});

export const sendImageValidateSchema = yup.object().shape({
  file: yup.mixed().required("Image is required"),
  params: yup.object().shape({
    conversationId: yup
      .string()
      .test(
        "validId",
        "Valid conversation id is required",
        (value) => !!value && mongoose.Types.ObjectId.isValid(value)
      ),
  }),
});

export const seenByValidateSchema = yup.object().shape({
  params: yup.object().shape({
    messageId: yup
      .string()
      .test(
        "validId",
        "Valid message id is required",
        (value) => !!value && mongoose.Types.ObjectId.isValid(value)
      ),
  }),
});
