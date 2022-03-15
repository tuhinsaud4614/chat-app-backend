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

export const sendMailToUser = async (
  id: string,
  email: string,
  code: string,
  host?: string
) => {
  const link = host
    ? `<a href="http://${host}/api/v1/user/verify/${id}/${code}">Activation Link</a>`
    : "";

  const info = await sendMail({
    from: "foo@example.com",
    to: email,
    subject: "Chat App account verification code",
    html: `<b style="color:red;">User ID:</b> ${id}<b>
  <br/>
  <br/>Verification Code:</b> ${code}
  <br/><br/>${link}
  `,
  });
  logger.info(info);
};

export const sendUserVerificationCode = async (
  userId: string,
  email: string,
  host?: string
) => {
  const verificationCode = nanoid();
  await redisClient.set(USER_VERIFICATION_KEY_NAME(userId), verificationCode);
  await sendMailToUser(userId, email, verificationCode, host);
};
