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
        "Valid conversation id is required",
        (value) => !!value && mongoose.Types.ObjectId.isValid(value)
      ),
  }),
});

export const createGroupValidateSchema = yup.object().shape({
  body: yup.object().shape({
    name: yup.string().required("Name is required"),
    members: yup
      .array()
      .min(1, "At least one member required")
      .of(
        yup
          .string()
          .test(
            "validId",
            "Valid user id is required",
            (value) => !!value && mongoose.Types.ObjectId.isValid(value)
          )
      ),
  }),
});

export const addMemberToGroupValidateSchema = yup.object().shape({
  body: yup.object().shape({
    members: yup
      .array()
      .min(1, "At least one member required")
      .of(
        yup
          .string()
          .test(
            "validId",
            "Valid user id is required",
            (value) => !!value && mongoose.Types.ObjectId.isValid(value)
          )
      ),
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
