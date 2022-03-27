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
