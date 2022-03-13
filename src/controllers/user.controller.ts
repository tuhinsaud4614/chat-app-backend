import { RequestHandler } from "express";
import { HttpError, HttpSuccess } from "../models";
import { createUserService } from "../services/user.service";
import { createUserReqBody } from "../utility/types";

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
    });
    const result = new HttpSuccess<string>(
      "User created successfully",
      newUser._id as string
    ).toObj();
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
    next(
      new HttpError(
        "User creation failed.",
        500,
        "User not created. something went wrong."
      )
    );
  }
};
