import { Router } from "express";
import {
  createUser,
  forgetPassword,
  resendUserActivationLink,
  resetPassword,
  userVerify,
  verifyResetPassword,
} from "../controllers/user.controller";
import { validateRequest } from "../middleware";
import {
  createUserValidateSchema,
  resendUserVerificationCodeValidateSchema,
  userForgetPasswordValidateSchema,
  userResetPasswordValidateSchema,
  verifyValidateSchema,
} from "../schema/user.schema";

const router = Router();

router.post(
  "/create",
  validateRequest(createUserValidateSchema, 422),
  createUser
);

router.get(
  "/verify/:id/:verificationCode",
  validateRequest(verifyValidateSchema, 422),
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

router.get(
  "/verify-reset-password/:id/:verificationCode",
  validateRequest(verifyValidateSchema, 422),
  verifyResetPassword
);

router.post(
  "/reset-password/:id/:verifiedCode",
  validateRequest(userResetPasswordValidateSchema, 422),
  resetPassword
);

export default router;
