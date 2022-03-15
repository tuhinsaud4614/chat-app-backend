import { nanoid } from "nanoid";
import logger from "../logger";
import UserModel, { User } from "../models/user.model";
import { redisClient, sendMail, USER_VERIFICATION_KEY_NAME } from "../utility";

export const createUserService = async (input: Partial<User>) => {
  return await UserModel.create(input);
};

export const sendUserVerificationCode = async (
  userId: string,
  email: string
) => {
  const verificationCode = nanoid();
  await redisClient.set(USER_VERIFICATION_KEY_NAME(userId), verificationCode);

  const info = await sendMail({
    from: "foo@example.com",
    to: email,
    subject: "Chat App account verification code",
    html: `<b style="color:red;">User ID:</b> ${userId}<b><br/><br/>Verification Code:</b> ${verificationCode}`,
  });
  logger.info(info);
};
