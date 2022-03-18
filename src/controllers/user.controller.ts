import { RequestHandler } from "express";
import { nanoid } from "nanoid";
import { HttpError, HttpSuccess } from "../models";
import {
  createUserService,
  findUserByEmail,
  findUserById,
  sendMailToUser,
  sendUserVerificationCode,
  userResetPasswordMessage,
  userVerificationMessage,
} from "../services/user.service";
import {
  CreateUserReqBody,
  ESocketEvents,
  redisClient,
  ResendVerificationCodeReqParams,
  SocketIO,
  trimmedObjValue,
  UserForgetPasswordReqBody,
  UserResetPasswordReqBody,
  UserResetPasswordReqParams,
  UserRole,
  USER_RESET_PASSWORD_KEY_NAME,
  USER_RESET_PASSWORD_VERIFIED_KEY_NAME,
  USER_VERIFICATION_KEY_NAME,
  verifyValidateReqParams,
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
      return next(new HttpError("User already verified.", 409));
    }

    const VRKey = USER_VERIFICATION_KEY_NAME(id as string);
    const redisCode = await redisClient.get(VRKey);

    if (!redisCode) {
      return next(er);
    }

    const host = req.get("host");
    const message = userVerificationMessage(id as string, redisCode, host);

    await sendMailToUser(user.email, message);
    res
      .status(200)
      .json(
        new HttpSuccess("Re-send verification code successfully.", "").toObj()
      );
  } catch (error) {
    return next(new HttpError("Could not resend verification code.", 400));
  }
};

export const userVerify: RequestHandler<verifyValidateReqParams> = async (
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
      .json(new HttpSuccess("User verified successfully", "").toObj());
  } catch (error) {
    return next(new HttpError("User verification failed", 400));
  }
};

export const forgetPassword: RequestHandler<
  {},
  {},
  UserForgetPasswordReqBody
> = async (req, res, next) => {
  let { email } = req.body;
  email = email!.trim();

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return next(new HttpError("User not found!", 404));
    }

    const resetCode = nanoid();
    const key = USER_RESET_PASSWORD_KEY_NAME(user._id);
    await redisClient.set(key, resetCode);
    redisClient.expire(key, 1800);
    const host = req.get("host");
    const message = userResetPasswordMessage(user._id, resetCode, host);

    await sendMailToUser(email, message);

    res
      .status(200)
      .json(
        new HttpSuccess("Send reset password code successfully.", "").toObj()
      );
  } catch (err) {
    console.log("Reset password error & error is", err);
    return next(new HttpError("Something went wrong!", 500));
  }
};

export const verifyResetPassword: RequestHandler<
  verifyValidateReqParams
> = async (req, res, next) => {
  const { id, verificationCode } = req.params;

  try {
    const user = await findUserById(id as string);

    if (!user) {
      return next(new HttpError("Reset password verification failed.", 400));
    }

    if (!user.verified) {
      return next(new HttpError("User not verified", 409));
    }

    const VRKey = USER_RESET_PASSWORD_KEY_NAME(id as string);

    const redisCode = await redisClient.get(VRKey);

    if (verificationCode !== redisCode) {
      return next(new HttpError("Reset password verification failed.", 400));
    }

    const io = SocketIO.getInstance();
    const newVerifiedCode = nanoid();
    const newVerifiedKey = USER_RESET_PASSWORD_VERIFIED_KEY_NAME(id as string);

    await redisClient.set(newVerifiedKey, newVerifiedCode);
    redisClient.expire(newVerifiedKey, 600);
    await redisClient.del(VRKey);

    io.emit(ESocketEvents.VerifyResetPassword, {
      id: id,
      verifiedCode: newVerifiedCode,
    });

    res
      .status(200)
      .json(new HttpSuccess("Reset password verify successfully.", "").toObj());
  } catch (error) {
    return next(new HttpError("Reset password verification failed", 400));
  }
};

export const resetPassword: RequestHandler<
  UserResetPasswordReqParams,
  {},
  UserResetPasswordReqBody
> = async (req, res, next) => {
  const { id, verifiedCode } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await findUserById(id as string);

    if (!user) {
      return next(new HttpError("Reset password failed.", 400));
    }

    if (!user.verified) {
      return next(new HttpError("User not verified", 409));
    }

    const VRKey = USER_RESET_PASSWORD_VERIFIED_KEY_NAME(id as string);

    const redisCode = await redisClient.get(VRKey);

    if (verifiedCode !== redisCode) {
      return next(new HttpError("Reset password failed.", 400));
    }

    user.password = newPassword as string;
    user.save();

    await redisClient.del(VRKey);

    res
      .status(200)
      .json(new HttpSuccess("Reset password successfully.", "").toObj());
  } catch (error) {
    return next(new HttpError("Reset password failed", 400));
  }
};
