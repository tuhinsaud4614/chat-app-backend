import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import logger from "../logger";
import { HttpError } from "../models";
import { IOmitUser, redisClient, RefreshTokenReqBody } from "../utility";

export const verifyRefreshToken: RequestHandler<
  {},
  {},
  RefreshTokenReqBody
> = async (req, _, next) => {
  const { token } = req.body;

  try {
    const decoded = verify(token!, process.env.REFRESH_TOKEN_SECRET_KEY!);

    if (typeof decoded === "object" && "id" in decoded) {
      const value = await redisClient.get(decoded["id"]);
      if (value && token === JSON.parse(value)) {
        // @ts-ignore
        req.user = {
          id: decoded["id"],
          avatar: decoded["avatar"],
          email: decoded["email"],
          firstName: decoded["firstName"],
          lastName: decoded["lastName"],
        } as IOmitUser;
        return next();
      }
    }

    return next(new HttpError("Could not refresh the tokens.", 401));
  } catch (error) {
    logger.error(error);
    return next(new HttpError("Something went wrong.", 500));
  }
};

export const verifyAccessToken: RequestHandler = (req, _, next) => {
  if (!req.headers.authorization) {
    return next(new HttpError("Invalid request.", 403));
  }

  const token = req.headers.authorization.replace(/^Bearer\s/, "");

  try {
    const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY!);

    if (typeof decoded === "object" && "email" in decoded) {
      // @ts-ignore
      req.user = decoded as IOmitUser;
      return next();
    }

    return next(new HttpError("Authentication failed.", 403));
  } catch (error) {
    return next(new HttpError("Authentication failed.", 403));
  }
};
