import { sign as jwtSign } from "jsonwebtoken";
import { IOmitUser, redisClient } from "../utility";

export const generateToken = async (
  user: IOmitUser,
  key: string,
  expires: string,
  settable: boolean = false
) => {
  const refresh_token = jwtSign({ ...user }, key, {
    expiresIn: expires,
  });

  if (settable) {
    await redisClient.set(user.id, JSON.stringify(refresh_token));
  }
  return refresh_token;
};
