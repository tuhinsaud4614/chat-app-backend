import { RequestHandler } from "express";
import { HttpError, HttpSuccess } from "../models";
import {
  createUserService,
  sendUserVerificationCode,
} from "../services/user.service";
import { createUserReqBody, UserRole } from "../utility/types";

export const createUser: RequestHandler<{}, {}, createUserReqBody> = async (
  req,
  res,
  next
) => {
  const { firstName, email, lastName, password } = req.body;
  try {
    const newUser = await createUserService({
      firstName,
      lastName,
      password,
      email,
      role: UserRole.user,
    });

    await sendUserVerificationCode(newUser._id as string, email as string);

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
