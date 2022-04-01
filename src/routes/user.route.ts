import { Router } from "express";
import {
  createUser,
  forgetPassword,
  resendUserActivationLink,
  resetPassword,
  uploadAvatar,
  userVerify,
  verifyResetPassword,
} from "../controllers/user.controller";
import { validateRequest } from "../middleware";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { imageUpload } from "../middleware/file.middleware";
import {
  createUserValidateSchema,
  resendUserVerificationCodeValidateSchema,
  userForgetPasswordValidateSchema,
  userProfileValidateSchema,
  userResetPasswordValidateSchema,
  verifyValidateSchema,
} from "../schema/user.schema";
import { maxFileSize } from "../utility";

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

router.patch(
  "/profile",
  verifyAccessToken,
  imageUpload(maxFileSize(5)).single("avatar"),
  validateRequest(userProfileValidateSchema, 422),
  uploadAvatar
);
export default router;
