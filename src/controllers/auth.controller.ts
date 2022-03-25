import { RequestHandler } from "express";
import { HttpError, HttpSuccess } from "../models";
import { generateToken } from "../services/auth.service";
import { findUserByEmail, findUserById } from "../services/user.service";
import {
  IOmitUser,
  redisClient,
  REFRESH_TOKEN_KEY_NAME,
  trimmedObjValue,
  UserLoginReqBody,
} from "../utility";

export const loginUser: RequestHandler<{}, {}, UserLoginReqBody> = async (
  req,
  res,
  next
) => {
  const { email, password } = trimmedObjValue(req.body);

  const er = new HttpError("Invalid email or password.", 400);

  try {
    const user = await findUserByEmail(email as string);

    if (!user || !user.verified) {
      return next(er);
    }

    const isValid = await user.validatePassword(password as string);

    if (!isValid) {
      return next(er);
    }

    const leanUser = {
      id: user._id,
      email: user.email,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = await generateToken(
      leanUser,
      process.env.ACCESS_TOKEN_SECRET_KEY!,
      process.env.ACCESS_TOKEN_EXPIRES!
    );

    const refreshToken = await generateToken(
      leanUser,
      process.env.REFRESH_TOKEN_SECRET_KEY!,
      process.env.REFRESH_TOKEN_EXPIRES!,
      true
    );

    const result = new HttpSuccess("User logged in successfully.", {
      ...leanUser,
      accessToken,
      refreshToken,
    }).toObj();
    res.status(200).json(result);
  } catch (error) {
    next(new HttpError("Could not login user.", 500));
  }
};

export const getNewTokens: RequestHandler = async (req, res, next) => {
  try {
    // @ts-ignore
    const user = req.user as IOmitUser;

    const isExist = await findUserById(user.id);

    if (!isExist) {
      return next(new HttpError("User not exist.", 404));
    }

    const accessToken = await generateToken(
      user,
      process.env.ACCESS_TOKEN_SECRET_KEY!,
      process.env.ACCESS_TOKEN_EXPIRES!
    );

    const refreshToken = await generateToken(
      user,
      process.env.REFRESH_TOKEN_SECRET_KEY!,
      process.env.REFRESH_TOKEN_EXPIRES!,
      true
    );

    const result = new HttpSuccess("Get the tokens successfully.", {
      ...user,
      accessToken,
      refreshToken,
    }).toObj();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Authentication failed", 401));
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    // @ts-ignore
    const { id } = req.user as IOmitUser;

    const redisToken = await redisClient.get(REFRESH_TOKEN_KEY_NAME(id));

    if (!redisToken) {
      return next(new HttpError("Already logged out.", 400));
    }

    await redisClient.del(REFRESH_TOKEN_KEY_NAME(id));

    const result = new HttpSuccess("Logout successfully.", "").toObj();
    return res.status(200).json(result);
  } catch (error) {
    return next(new HttpError("Logout failed.", 400));
  }
};
