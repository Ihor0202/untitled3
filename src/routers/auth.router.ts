import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleweres/auth.middleware";
import { commonMiddleware } from "../middleweres/common.middleware";
import { UserValidator } from "../valadators/user.validator";
import {ActionTokenTypeEnum} from "../enums/action-token-type.enum";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isBodyValid(UserValidator.create),
  authController.signUp,
);

router.post(
  "/sign-in",
  commonMiddleware.isBodyValid(UserValidator.signIn),
  authController.signIn,
);

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

router.post("/logout",
    authMiddleware.checkAccessToken,
    authController.logout
);

router.post("/logout/all",
    authMiddleware.checkAccessToken,
    authController.logoutAll
);

router.post("/forgot-password", authController.forgotPasswordSendEmail);

router.put(
    "/forgot-password",
    authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT_PASSWORD),
    authController.forgotPasswordSet
);

router.post(
    "/change-password",
    authMiddleware.checkAccessToken,
    commonMiddleware.isBodyValid(UserValidator.changePassword),
    authController.changePassword
);

router.post(
    "/verify",
    authMiddleware.checkActionToken(ActionTokenTypeEnum.VERIFY_EMAIL),
    authController.verify
);

export const authRouter = router;
