import * as yup from "yup";
import { refreshTokenValidateSchema } from "../schema/auth.schema";
import {
  createUserValidateSchema,
  resendUserVerificationCodeValidateSchema,
  userForgetPasswordValidateSchema,
  userLoginValidateSchema,
  userResetPasswordValidateSchema,
  verifyValidateSchema,
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

export type verifyValidateReqParams = yup.TypeOf<
  typeof verifyValidateSchema
>["params"];

export type UserLoginReqBody = yup.TypeOf<
  typeof userLoginValidateSchema
>["body"];

export type RefreshTokenReqBody = yup.TypeOf<
  typeof refreshTokenValidateSchema
>["body"];

export type UserForgetPasswordReqBody = yup.TypeOf<
  typeof userForgetPasswordValidateSchema
>["body"];

export type UserResetPasswordReqBody = yup.TypeOf<
  typeof userResetPasswordValidateSchema
>["body"];

export type UserResetPasswordReqParams = yup.TypeOf<
  typeof userResetPasswordValidateSchema
>["params"];
