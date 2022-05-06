import * as yup from "yup";
import { refreshTokenValidateSchema } from "../schema/auth.schema";
import {
  AllConversationsValidateSchema,
  sendAttachmentValidateSchema,
  sendMessageValidateSchema,
  singleConversationValidateSchema,
} from "../schema/conversation.schema";
import {
  acceptRequestValidateSchema,
  activeFriendValidateSchema,
  sendRequestValidateSchema,
} from "../schema/friendship.schema";
import {
  createUserValidateSchema,
  resendUserVerificationCodeValidateSchema,
  userForgetPasswordValidateSchema,
  userLoginValidateSchema,
  userResetPasswordValidateSchema,
  userStatusValidateSchema,
  verifyValidateSchema,
} from "../schema/user.schema";
import {
  AUDIO_MIMES,
  DOCUMENT_MIMES,
  IMAGE_MIMES,
  VIDEO_MIMES,
} from "./constants";

export enum UserRole {
  admin = "ADMIN",
  user = "USER",
}

export enum GroupUserRole {
  admin = "admin",
  moderator = "moderator",
  member = "member",
}

export type IMAGE_MIME_TYPE = keyof typeof IMAGE_MIMES;
export type AUDIO_MIME_TYPE = keyof typeof AUDIO_MIMES;
export type VIDEO_MIME_TYPE = keyof typeof VIDEO_MIMES;
export type DOCUMENT_MIME_TYPE = keyof typeof DOCUMENT_MIMES;
export type AttachmentType = "DOCUMENT" | "AUDIO" | "VIDEO";

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

export type UserStatusReqBody = yup.TypeOf<
  typeof userStatusValidateSchema
>["body"];

export type SendRequestReqParams = yup.TypeOf<
  typeof sendRequestValidateSchema
>["params"];

export type AcceptRequestReqParams = yup.TypeOf<
  typeof acceptRequestValidateSchema
>["params"];

export type ActiveFriendsQuery = yup.TypeOf<
  typeof activeFriendValidateSchema
>["query"];

export type AllConversationReqQuery = yup.TypeOf<
  typeof AllConversationsValidateSchema
>["query"];

export type SingleConversationReqParams = yup.TypeOf<
  typeof singleConversationValidateSchema
>["params"];

export type SingleConversationQuery = yup.TypeOf<
  typeof singleConversationValidateSchema
>["query"];

export type SendMessageReqParams = yup.TypeOf<
  typeof sendMessageValidateSchema
>["params"];

export type SendMessageReqBody = yup.TypeOf<
  typeof sendMessageValidateSchema
>["body"];

export type SendAttachmentReqParams = yup.TypeOf<
  typeof sendAttachmentValidateSchema
>["params"];
