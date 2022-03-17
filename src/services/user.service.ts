import { nanoid } from "nanoid";
import logger from "../logger";
import UserModel, { User } from "../models/user.model";
import { redisClient, sendMail, USER_VERIFICATION_KEY_NAME } from "../utility";

export const createUserService = async (input: Partial<User>) => {
  return await UserModel.create(input);
};

export const findUserById = async (id: string) => {
  return await UserModel.findById(id);
};

export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

export const userVerificationMessage = (
  userId: string,
  code: string,
  host?: string
) => {
  const link = host
    ? `<a href="http://${host}/api/v1/user/verify/${userId}/${code}">Activation Link</a>`
    : "";

  const message = `<b style="color:red;">User ID:</b> ${userId}<b>
<br/>
<br/>Verification Code:</b> ${code}
<br/><br/>${link}
`;
  return message;
};

export const userResetPasswordMessage = (
  userId: string,
  code: string,
  host?: string
) => {
  const link = host
    ? `<a href="http://${host}/api/v1/user/verify-reset-password/${userId}/${code}">Validate Reset Password Link</a>`
    : "";

  const message = `<b style="color:red;">User ID:</b> ${userId}<b>
<br/>
<br/>Reset Code:</b> ${code}
<br/><br/>${link}
`;
  return message;
};

export const sendMailToUser = async (to: string, message: string) => {
  const info = await sendMail({
    from: "foo@example.com",
    to: to,
    subject: "Chat App account verification code",
    html: message,
  });
  logger.info(info);
};

export const sendUserVerificationCode = async (
  userId: string,
  email: string,
  host?: string
) => {
  const verificationCode = nanoid();
  const message = userVerificationMessage(userId, verificationCode, host);
  await redisClient.set(USER_VERIFICATION_KEY_NAME(userId), verificationCode);
  await sendMailToUser(email, message);
};
