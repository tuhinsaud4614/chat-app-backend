import * as yup from "yup";
import { createUserValidateSchema } from "../schema/user.schema";

export enum UserRole {
  admin = "ADMIN",
  user = "USER",
}

export type createUserReqBody = yup.TypeOf<
  typeof createUserValidateSchema
>["body"];
