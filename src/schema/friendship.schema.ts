import { Types } from "mongoose";
import * as yup from "yup";

export const sendRequestValidateSchema = yup.object().shape({
  params: yup.object().shape({
    receiverId: yup
      .string()
      .test(
        "validId",
        "Valid receiver id is required",
        (value) => !!value && Types.ObjectId.isValid(value)
      ),
  }),
});

export const acceptRequestValidateSchema = yup.object().shape({
  params: yup.object().shape({
    friendshipId: yup
      .string()
      .test(
        "validId",
        "Valid friendship id is required",
        (value) => !!value && Types.ObjectId.isValid(value)
      ),
  }),
});

export const activeFriendValidateSchema = yup.object().shape({
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
