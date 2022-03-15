import * as yup from "yup";
import {
  createUserValidateSchema,
  resendUserVerificationCodeValidateSchema,
  userVerifyValidateSchema,
} from "../schema/user.schema";

export enum UserRole {
  admin = "ADMIN",
  user = "USER",
}

export type CreateUserReqBody = yup.TypeOf<
  typeof createUserValidateSchema
>["body"];

export type ResendVerificationCodeReqParams = yup.TypeOf<
  typeof resendUserVerificationCodeValidateSchema
>["params"];

export type VerifyUserReqParams = yup.TypeOf<
  typeof userVerifyValidateSchema
>["params"];
