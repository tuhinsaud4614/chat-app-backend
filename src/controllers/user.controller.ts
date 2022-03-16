import { RequestHandler } from "express";
import { HttpError, HttpSuccess } from "../models";
import {
  createUserService,
  findUserById,
  sendMailToUser,
  sendUserVerificationCode,
} from "../services/user.service";
import {
  CreateUserReqBody,
  redisClient,
  ResendVerificationCodeReqParams,
  trimmedObjValue,
  UserRole,
  USER_VERIFICATION_KEY_NAME,
  VerifyUserReqParams,
} from "../utility";

export const createUser: RequestHandler<{}, {}, CreateUserReqBody> = async (
  req,
  res,
  next
) => {
  const { email, firstName, lastName, password } = trimmedObjValue(req.body);

  try {
    const newUser = await createUserService({
      firstName,
      lastName,
      password,
      email,
      role: UserRole.user,
    });

    await sendUserVerificationCode(
      newUser._id as string,
      email as string,
      req.get("host")
    );

    const result = new HttpSuccess("User created successfully", {
      userId: newUser._id,
    }).toObj();

    res.status(201).json(result);
  } catch (error: any) {
    if (error.code === 11000) {
      return next(
        new HttpError(
          "User already exist.",
          409,
          "This user already exist. Try the new one."
        )
      );
    }
    if (error instanceof HttpError) {
      return next(error);
    }

    next(
      new HttpError(
        "User creation failed.",
        500,
        "User not created. something went wrong."
      )
    );
  }
};

export const resendUserActivationLink: RequestHandler<
  ResendVerificationCodeReqParams
> = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await findUserById(id as string);

    const er = new HttpError("Could not resend verification code.", 400);

    if (!user) {
      return next(er);
    }

    if (user.verified) {
      return next(new HttpError("User already verified.", 400));
    }

    const VRKey = USER_VERIFICATION_KEY_NAME(id as string);
    const redisCode = await redisClient.get(VRKey);

    if (!redisCode) {
      return next(er);
    }

    await sendMailToUser(id as string, user.email, redisCode, req.get("host"));
    res
      .status(200)
      .json(
        new HttpSuccess("Re-send verification code successfully.", "").toObj()
      );
  } catch (error) {
    return next(new HttpError("Could not resend verification code.", 400));
  }
};

export const userVerify: RequestHandler<VerifyUserReqParams> = async (
  req,
  res,
  next
) => {
  const { id, verificationCode } = req.params;

  try {
    const user = await findUserById(id as string);

    if (!user) {
      return next(new HttpError("User verification failed.", 400));
    }

    if (user.verified) {
      return next(new HttpError("User already verified", 409));
    }

    const VRKey = USER_VERIFICATION_KEY_NAME(id as string);

    const redisCode = await redisClient.get(VRKey);

    if (verificationCode !== redisCode) {
      return next(new HttpError("User verification failed.", 400));
    }

    user.verified = true;
    await redisClient.del(VRKey);
    await user.save();

    res
      .status(200)
      .json(new HttpSuccess("User verified successfully", "Succeed").toObj());
  } catch (error) {
    return next(new HttpError("User verification failed", 400));
  }
};
