import { Router } from "express";
import {
  getNewTokens,
  loginUser,
  logout,
} from "../controllers/auth.controller";
import { validateRequest } from "../middleware";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/auth.middleware";
import { refreshTokenValidateSchema } from "../schema/auth.schema";
import { userLoginValidateSchema } from "../schema/user.schema";

const router = Router();

router.post("/login", validateRequest(userLoginValidateSchema, 422), loginUser);

router.post(
  "/token",
  validateRequest(refreshTokenValidateSchema, 422),
  verifyRefreshToken,
  getNewTokens
);

router.delete("/logout", verifyAccessToken, logout);

export default router;
