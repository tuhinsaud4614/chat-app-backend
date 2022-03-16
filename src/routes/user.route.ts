import { Router } from "express";
import {
  createUser,
  forgetPassword,
  resendUserActivationLink,
  userVerify,
} from "../controllers/user.controller";
import { validateRequest } from "../middleware";
import {
  createUserValidateSchema,
  resendUserVerificationCodeValidateSchema,
  userForgetPasswordValidateSchema,
  userVerifyValidateSchema,
} from "../schema/user.schema";

const router = Router();

router.post(
  "/create",
  validateRequest(createUserValidateSchema, 422),
  createUser
);

router.get(
  "/verify/:id/:verificationCode",
  validateRequest(userVerifyValidateSchema, 422),
  userVerify
);

router.get(
  "/resend-verification-code/:id",
  validateRequest(resendUserVerificationCodeValidateSchema, 422),
  resendUserActivationLink
);

router.post(
  "/forget-password",
  validateRequest(userForgetPasswordValidateSchema, 422),
  forgetPassword
);

export default router;
