import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleweres/auth.middleware";
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

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);
export const authRouter = router;
