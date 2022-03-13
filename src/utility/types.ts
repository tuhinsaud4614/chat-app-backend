import * as yup from "yup";
import { createUserValidateSchema } from "../schema/user.schema";

export type createUserReqBody = yup.TypeOf<
  typeof createUserValidateSchema
>["body"];
