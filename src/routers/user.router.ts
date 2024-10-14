import { Router } from "express";

import { avatarConfig } from "../constans/image.constants";
import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middleweres/auth.middleware";
import { commonMiddleware } from "../middleweres/common.middleware";
import { fileMiddleware } from "../middleweres/file.middleware";
import { UserValidator } from "../valadators/user.validator";

const router = Router();

router.get("/", userController.getList);

router.get("/me", authMiddleware.checkAccessToken, userController.getMe);
router.put(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateMe,
);
router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);

router.post(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  fileMiddleware.isFileValid("avatar", avatarConfig),
  userController.uploadAvatar,
);

router.delete(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  userController.deleteAvatar,
);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getById,
);

export const userRouter = router;
