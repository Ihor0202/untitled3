import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { commonMiddleware } from "../middleweres/common.middleware";
import { UserValidator } from "../valodators/user.validator";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isBodyValid(UserValidator.create),
  authController.signUp,
);

router.post(
  "/sign-in",
  // commonMiddleware.isBodyValid(UserValidator.create),
  authController.signIn,
);

export const authRouter = router;
