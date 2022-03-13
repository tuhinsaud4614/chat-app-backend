import { Router } from "express";
import { createUser } from "../controllers/user.controller";
import { validateRequest } from "../middleware";
import { createUserValidateSchema } from "../schema/user.schema";

const router = Router();

router.post(
  "/create",
  validateRequest(createUserValidateSchema, 422),
  createUser
);

export default router;
